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

import { readFileSync, writeFileSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const cfg = JSON.parse(readFileSync(path.join(__dirname, '..', 'backup', 'backup.config.json'), 'utf8'));
const BASE = cfg.supabaseUrl + '/rest/v1/';
const KEY = cfg.serviceRoleKey;

const H = { apikey: KEY, Authorization: `Bearer ${KEY}` };

// ---------- MODE --live: hitung panggilan nyata (egress_log) x ukuran terukur ----------
if (process.argv.includes('--live')) {
  const days = 7;
  const since = new Date(Date.now() - days * 86400000).toISOString().slice(0, 10);
  const res = await fetch(BASE + `egress_log?select=day,endpoint,calls&day=gte.${since}&order=day.desc`, { headers: H });
  if (!res.ok) { console.error('Gagal baca egress_log (migrasi 0018 sudah jalan?):', await res.text()); process.exit(1); }
  const rows = await res.json();
  let sizes = {};
  try { sizes = JSON.parse(readFileSync(path.join(__dirname, 'sizes.json'), 'utf8')); }
  catch { console.warn('sizes.json belum ada — jalankan pengukuran dulu (tanpa --live) agar estimasi byte akurat.'); }

  const agg = new Map(); // endpoint -> calls
  const perDay = new Map(); // day -> calls
  for (const r of rows) {
    agg.set(r.endpoint, (agg.get(r.endpoint) || 0) + r.calls);
    perDay.set(r.day, (perDay.get(r.day) || 0) + r.calls);
  }
  const fmtB = (b) => b >= 1048576 ? (b / 1048576).toFixed(2) + ' MB' : (b / 1024).toFixed(1) + ' KB';
  console.log(`Panggilan nyata ${days} hari terakhir (dari egress_log):\n`);
  console.log('  calls'.padEnd(9) + 'est.egress'.padEnd(12) + 'endpoint');
  let totalEst = 0;
  for (const [ep, calls] of [...agg.entries()].sort((a, b) => b[1] - a[1])) {
    const per = sizes[ep]?.gzPerRequest ?? 0;
    const est = per * calls; totalEst += est;
    console.log(`  ${String(calls).padEnd(7)} ${(per ? fmtB(est) : '?').padEnd(11)} ${ep}`);
  }
  console.log(`\n  TOTAL estimasi egress REST ${days} hari: ${fmtB(totalEst)} (~${fmtB(totalEst / days)}/hari)`);
  console.log('  Per hari (calls):', [...perDay.entries()].map(([d, c]) => `${d}=${c}`).join('  '));
  console.log('\n  Catatan: estimasi = calls x rata-rata gzip/request terukur; foto R2 & realtime tak termasuk.');
  process.exit(0);
}

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
  ['visits LEAN (admin loadAll, visit_list)', 'visit_list?select=*&order=visit_date.desc'],
  ['visits FULL (visit_details, detail/export)', 'visit_details?select=*&order=visit_date.desc'],
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

// Simpan ukuran gzip rata-rata PER REQUEST per endpoint (dipakai mode --live).
// Kunci = label endpoint yang sama dengan egressMeter.js: "rest:<tabel/view>".
const sizeMap = {};
const tableOf = (q) => q.split('?')[0];
for (const [label, q] of QUERIES) {
  const r = results.find(x => x.label === label);
  if (r) sizeMap['rest:' + tableOf(q)] = { gzPerRequest: Math.round(r.gz / Math.max(1, r.pages)), rows: r.rows, measuredAt: new Date().toISOString() };
}
writeFileSync(path.join(__dirname, 'sizes.json'), JSON.stringify(sizeMap, null, 2));
console.log('  sizes.json diperbarui (dipakai: node ops/egress/measure.mjs --live).');
