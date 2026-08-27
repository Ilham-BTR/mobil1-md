// ops/egress/measure.mjs
// Ukur egress per-query PostgREST yang dipakai app (ukuran body + gzip),
// urut dari terbesar. Pakai service key dari ops/backup/backup.config.json.
//
//   node ops/egress/measure.mjs
//
// Meniru query yang PERSIS dipakai app (lihat src/lib/api/*.js):
//   - fetchVisits() admin: visit_details select * (paged 1000)
//   - fetchVisits({mdId}): visit_details per-MD
//   - fetchBengkels(): bengkels + kota + region nested (paged 1000)
//   - fetchBengkels(regionId): inner join per region
//   - fetchAccounts(): profiles + tl_regions
//   - fetchKotas/fetchRegions/fetchDistributors
//   - fetchAttendancesByMonth: attendance_details bulan berjalan
// Egress Supabase dihitung dari byte TERKOMPRES di kabel (PostgREST gzip),
// jadi kolom "gzip" adalah angka yang paling mendekati tagihan.

import { readFileSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const cfg = JSON.parse(readFileSync(path.join(__dirname, '..', 'backup', 'backup.config.json'), 'utf8'));
const BASE = cfg.supabaseUrl + '/rest/v1/';
const KEY = cfg.serviceRoleKey;

const H = { apikey: KEY, Authorization: `Bearer ${KEY}` };

// GET semua halaman ala fetchAllPaged (batch 1000) — kembalikan total byte & rows.
async function paged(pathQ, batch = 1000) {
  let raw = 0, gz = 0, rows = 0, pages = 0;
  for (let from = 0; ; from += batch) {
    const res = await fetch(BASE + pathQ, {
      headers: { ...H, Range: `${from}-${from + batch - 1}`, 'Range-Unit': 'items' },
    });
    if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
    const text = await res.text();
    raw += Buffer.byteLength(text);
    gz += gzipSync(Buffer.from(text)).length;
    const data = JSON.parse(text);
    rows += data.length;
    pages++;
    if (data.length < batch) break;
  }
  return { raw, gz, rows, pages };
}

const fmt = (b) => b >= 1048576 ? (b / 1048576).toFixed(2) + ' MB' : (b / 1024).toFixed(1) + ' KB';

const month = new Date().toISOString().slice(0, 7);
const monthStart = month + '-01';

// Query PERSIS seperti di src/lib/api/*.js
const QUERIES = [
  ['visits ALL (admin loadAll)',        'visit_details?select=*&order=visit_date.desc'],
  ['bengkels ALL (admin loadAll)',      'bengkels?select=*,kota:kotas(*,region:regions!region_id(*))&order=code'],
  ['accounts (admin loadAll)',          'profiles?select=*&order=role&order=full_name'],
  ['kotas (loadAll)',                   'kotas?select=*,region:regions!region_id(*)&order=name'],
  ['distributors (loadAll)',            'distributors?select=*,region:regions!region_id(*)&order=name'],
  ['regions (loadAll)',                 'regions?select=*&order=name'],
  ['attendance bulan ini (admin absen)', `attendance_details?select=*&date=gte.${monthStart}&order=date.desc`],
  ['tl_regions (fetchAccounts)',        'tl_regions?select=tl_id,region_id'],
];

console.log(`Egress per-query (${new Date().toISOString()}) — bulan sampel: ${month}\n`);

const results = [];
for (const [label, q] of QUERIES) {
  try {
    const r = await paged(q);
    results.push({ label, ...r });
    console.log(`  ok: ${label} (${r.rows} rows)`);
  } catch (e) {
    console.log(`  GAGAL: ${label} -> ${e.message.slice(0, 120)}`);
  }
}

// Sampel per-MD & per-region (ambil MD + region pertama yang aktif)
try {
  const prof = await (await fetch(BASE + 'profiles?select=id,region_id&role=eq.md&limit=1', { headers: H })).json();
  if (prof[0]) {
    const r1 = await paged(`visit_details?select=*&md_id=eq.${prof[0].id}&order=visit_date.desc`);
    results.push({ label: 'visits per-MD (login MD, sampel 1 MD)', ...r1 });
    if (prof[0].region_id) {
      const r2 = await paged(`bengkels?select=*,kota:kotas!inner(*,region:regions!region_id(*))&kota.region_id=eq.${prof[0].region_id}&order=code`);
      results.push({ label: 'bengkels per-region (login MD, sampel)', ...r2 });
    }
  }
} catch (e) { console.log('  GAGAL sampel per-MD:', e.message.slice(0, 120)); }

results.sort((a, b) => b.gz - a.gz);
console.log('\n' + '='.repeat(78));
console.log('URUTAN DAMPAK (byte gzip = paling dekat ke tagihan egress):\n');
console.log('  gzip'.padEnd(12) + 'raw'.padEnd(12) + 'rows'.padEnd(8) + 'query');
for (const r of results) {
  console.log(`  ${fmt(r.gz).padEnd(10)} ${fmt(r.raw).padEnd(10)} ${String(r.rows).padEnd(7)} ${r.label}`);
}
const totalGz = results.reduce((s, r) => s + r.gz, 0);
console.log(`\n  TOTAL 1x load semua query: ${fmt(totalGz)} (gzip)`);
console.log('  Catatan: auto-refresh/interval MENGALIKAN angka di atas per panggilan.');
