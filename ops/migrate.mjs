// ops/migrate.mjs — jalankan migrasi Supabase yang BELUM diterapkan (otomatis via GitHub Action).
// Tracking: schema `migrations` (terpisah dari public, aman dari 0000_reset).
// First run = baseline: migrasi lama dianggap sudah diterapkan, hanya file baru yang jalan.
// Tanpa dependensi (Node 20+, fetch bawaan).
const REF = process.env.SUPABASE_PROJECT_REF;
const TOKEN = process.env.SUPABASE_ACCESS_TOKEN;
const API = `https://api.supabase.com/v1/projects/${REF}/database/query`;

// Sudah diterapkan manual sebelum otomatisasi — ditandai tanpa dijalankan ulang.
const BASELINE = [
  '0000_reset.sql', '0001_schema.sql', '0002_tampak_depan_and_status_v2.sql',
  '0003_backfill_bengkel_coords.sql', '0004_distributor_per_visit.sql',
  '0005_distributor_region.sql', '0006_status_two_level.sql', '0007_webauthn.sql',
  '0008_attendance.sql', '0009_super_admin_md_password.sql', '0010_tl_role.sql',
  '0011_account_visibility.sql', '0012_visit_photos_gimmick_planogram.sql',
  '0013_super_admin_only_delete.sql', '0014_tl_multi_region.sql',
  '0015_laporan_views.sql', '0016_spanduk_poster_putih.sql', '0017_visit_list_lean.sql',
  '0018_egress_log.sql',
];

// Migrasi destruktif TIDAK PERNAH dijalankan otomatis.
const NEVER_AUTO = new Set(['0000_reset.sql']);

async function runSql(query) {
  const res = await fetch(API, {
    method: 'POST',
    headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  });
  const body = await res.json().catch(() => null);
  if (!res.ok) throw new Error(`API ${res.status}: ${JSON.stringify(body)}`);
  // Management API mengembalikan array baris langsung (bukan {data: ...}).
  return Array.isArray(body) ? body : (body?.data ?? []);
}

if (!REF || !TOKEN) {
  console.error('Set secret GitHub: SUPABASE_ACCESS_TOKEN (project ref sudah di-hardcode di workflow)');
  process.exit(1);
}

// 1. Pastikan tabel tracking ada
await runSql(`create schema if not exists migrations;
create table if not exists migrations.applied (
  name text primary key,
  applied_at timestamptz not null default now()
);`);

// 2. Nama yang sudah diterapkan
let applied = new Set((await runSql('select name from migrations.applied')).map(r => r.name));
console.log(`Tercatat sudah diterapkan: ${applied.size} migrasi.`);

// 2b. Deteksi schema hilang (mis. tabel ter-drop): jika `profiles` tak ada,
//     jalankan SEMUA migrasi (kecuali 0000_reset) — jangan percaya baseline.
const prof = await runSql(`select to_regclass('public.profiles') is not null as ok`);
if (prof[0]?.ok === false) {
  console.log('PERINGATAN: tabel public.profiles tidak ada — mode REBUILD, jalankan semua migrasi.');
  applied = new Set();
} else if (applied.size === 0) {
// 3. Baseline pertama kali: tandai migrasi lama tanpa menjalankannya

  for (const name of BASELINE) {
    await runSql(`insert into migrations.applied(name) values ('${name}') on conflict do nothing;`);
  }
  applied = new Set((await runSql('select name from migrations.applied')).map(r => r.name));
  console.log(`Baseline: ${applied.size} migrasi lama ditandai sudah diterapkan.`);
}

// 4. Jalankan file baru (urut nama), masing-masing dalam 1 transaksi
import { readdirSync, readFileSync } from 'node:fs';
const files = readdirSync('supabase/migrations').filter(f => f.endsWith('.sql')).sort();
let ran = 0;
for (const f of files) {
  if (NEVER_AUTO.has(f)) continue;                       // jangan pernah otomatis
  if (applied.has(f)) continue;
  const sql = readFileSync(`supabase/migrations/${f}`, 'utf8');
  console.log(`Menjalankan ${f} ...`);
  try {
    await runSql(`begin;\n${sql}\ncommit;`);
    await runSql(`insert into migrations.applied(name) values ('${f}') on conflict do nothing;`);
    ran++;
  } catch (e) {
    console.error(`GAGAL ${f}: ${e.message}`);
    process.exit(1);
  }
}
console.log(ran ? `Selesai: ${ran} migrasi baru.` : 'Tidak ada migrasi baru. Sudah sinkron.');
