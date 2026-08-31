// Validasi + (opsional) insert visit dari Template_Import_Visit.xlsx
// Jalankan dari folder project: node ops/import/import-visits.mjs [--insert]
import XLSX from 'xlsx';
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'node:fs';

const cfg = JSON.parse(readFileSync('D:/Phyton/KC/Data/App/Mobil1/ops/backup/backup.config.json', 'utf8'));
const s = createClient(cfg.supabaseUrl, cfg.serviceRoleKey, { auth: { persistSession: false } });
const DO_INSERT = process.argv.includes('--insert');
const FILE = process.argv.find(a => a.startsWith('--file='))?.slice(7) || 'C:/Users/Ilham_PC/Downloads/Template_Import_Visit.xlsx';

const STATUS_OK = ['Pemasangan', 'Revisit'];
const URLCOLS = { url_tampak_depan:'photo_tampak_depan', url_foto_in:'photo_in', url_foto_out:'photo_out', url_spanduk_before:'photo_spanduk_before', url_spanduk_putih:'photo_spanduk_putih', url_spanduk_after:'photo_spanduk_after', url_poster_before:'photo_poster_before', url_poster_putih:'photo_poster_putih', url_poster_after:'photo_poster_after', url_delivery_gimmick:'photo_delivery_gimmick', url_deploy_planogram:'photo_deploy_planogram' };
const T = (v) => (v == null ? '' : String(v).trim());
function toDateStr(v) {
  if (v === '' || v == null) return '';
  if (typeof v === 'number') { const d = XLSX.SSF.parse_date_code(v); return d ? `${d.y}-${String(d.m).padStart(2,'0')}-${String(d.d).padStart(2,'0')}` : String(v); }
  if (v instanceof Date) return `${v.getFullYear()}-${String(v.getMonth()+1).padStart(2,'0')}-${String(v.getDate()).padStart(2,'0')}`;
  return T(v);
}
async function fetchAll(table, sel) { let out=[]; for(let f=0;;f+=1000){ const {data,error}=await s.from(table).select(sel).range(f,f+999); if(error)throw error; out.push(...data); if(data.length<1000)break;} return out; }

const wb = XLSX.readFile(FILE, { cellDates: true });
const rows = XLSX.utils.sheet_to_json(wb.Sheets['Data'], { defval: '' });

const profiles = await fetchAll('profiles', 'id,email,full_name');
const emailMap = new Map(profiles.filter(p=>p.email).map(p=>[p.email.toLowerCase().trim(), p]));
const bengkels = await fetchAll('bengkels', 'id,code,name');
const codeMap = new Map();
for (const b of bengkels) { const k=(b.code||'').toLowerCase().trim(); if(!codeMap.has(k))codeMap.set(k,[]); codeMap.get(k).push(b); }
const distributors = await fetchAll('distributors', 'id,name');
const distMap = new Map();
for (const d of distributors) { const k=(d.name||'').toLowerCase().trim(); if(k&&!distMap.has(k))distMap.set(k,d.id); const ks=k.replace(/\s+/g,''); if(ks&&!distMap.has(ks))distMap.set(ks,d.id); }

const ok = [], bad = [], warns = [];
rows.forEach((r, i) => {
  const ln = i + 2;
  const errs = [];
  const md = emailMap.get(T(r.md_email).toLowerCase());
  if (!md) errs.push(`MD email tak ditemukan: "${T(r.md_email)}"`);
  const code = T(r.bengkel_kode).toLowerCase(), nama = T(r.bengkel_nama).toLowerCase();
  let bengkel = null;
  const cands = codeMap.get(code) || [];
  if (cands.length === 1) bengkel = cands[0];
  else if (cands.length > 1) { const m = cands.filter(b => (b.name||'').toLowerCase().trim() === nama); if (m.length===1) bengkel=m[0]; else errs.push(`Kode "${T(r.bengkel_kode)}" dobel (${cands.length}) & nama tak cocok/ambigu`); }
  else { const byName = bengkels.filter(b => (b.name||'').toLowerCase().trim() === nama); if (byName.length===1) bengkel=byName[0]; else errs.push(`Bengkel tak ditemukan (kode "${T(r.bengkel_kode)}" / nama "${T(r.bengkel_nama)}")`); }
  const tgl = toDateStr(r.tanggal);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(tgl)) errs.push(`Tanggal tidak valid: "${r.tanggal}"`);
  const status = T(r.status);
  if (!STATUS_OK.includes(status)) errs.push(`Status harus Pemasangan/Revisit: "${status}"`);
  if (errs.length) { bad.push({ ln, errs }); return; }
  const distRaw = T(r.distributor), distKey = distRaw.toLowerCase();
  const distId = distMap.get(distKey) || distMap.get(distKey.replace(/\s+/g,'')) || null;
  if (distRaw && !distId) warns.push(`distributor "${distRaw}" tak cocok dgn master (akan masuk kosong)`);
  const photos = {}; for (const [uc, col] of Object.entries(URLCOLS)) { const u=T(r[uc]); if(u) photos[col]=u; }
  ok.push({ ln, row: {
    md_id: md.id, bengkel_id: bengkel.id, visit_date: tgl, status, sub_type: T(r.sub_type)||null,
    pic_name: T(r.pic_nama) || '-', pic_phone: T(r.pic_hp) || '-', remarks: T(r.remarks)||null,
    distributor_id: distId,
    visit_lat: r.lat===''||r.lat==null?null:Number(r.lat), visit_lng: r.lng===''||r.lng==null?null:Number(r.lng),
    ...photos, created_at: new Date(tgl + 'T12:00:00+07:00').toISOString(),
  }});
});

// Dedup: skip yang sudah ada di DB (md_id + bengkel_id + visit_date)
const existing = await fetchAll('visits', 'md_id,bengkel_id,visit_date');
const keyOf = (r) => `${r.md_id}|${r.bengkel_id}|${r.visit_date}`;
const existKeys = new Set(existing.map(keyOf));
const toInsert = ok.filter(o => !existKeys.has(keyOf(o.row)));
const dupCount = ok.length - toInsert.length;

console.log(`\n=== VALIDASI ===`);
console.log(`Total baris: ${rows.length} | Valid: ${ok.length} (baru: ${toInsert.length}, sudah ada: ${dupCount}) | Bermasalah: ${bad.length}`);
if (bad.length) { console.log('\n--- Baris bermasalah (perbaiki di Excel) ---'); bad.forEach(b=>console.log(`  Baris ${b.ln}: ${b.errs.join('; ')}`)); }
if (warns.length) { console.log('\n--- Peringatan ---'); warns.forEach(w=>console.log(`  Baris: ${w}`)); }
if (ok.length) console.log(`  sub_type terisi: ${ok.filter(o=>o.row.sub_type).length}/${ok.length} | distributor terisi: ${ok.filter(o=>o.row.distributor_id).length}/${ok.length}`);
if (ok.length) { console.log('\n--- Contoh 2 baris siap insert ---'); ok.slice(0,2).forEach(o=>console.log(`  Baris ${o.ln}:`, JSON.stringify({md:o.row.md_id.slice(0,8), bengkel:o.row.bengkel_id.slice(0,8), tgl:o.row.visit_date, status:o.row.status, foto:Object.keys(o.row).filter(k=>k.startsWith('photo_')).length}))); }

if (DO_INSERT && toInsert.length) {
  console.log('\n=== INSERT (hanya yang baru) ===');
  let done=0; for (let i=0;i<toInsert.length;i+=100){ const chunk=toInsert.slice(i,i+100).map(o=>o.row); const {error}=await s.from('visits').insert(chunk); if(error){console.log('GAGAL:', error.message); break;} done+=chunk.length; }
  console.log('Ter-insert (baru):', done);
} else if (!DO_INSERT) {
  console.log('\n(DRY-RUN — belum insert. Konfirmasi dulu baru jalankan dgn --insert.)');
} else {
  console.log('\nTidak ada baris baru untuk di-insert (semua sudah ada).');
}
