// List semua objek R2 visits/ di jendela data hilang 31/08/2026, kelompokkan per MD.
// Output: ops/lost-photos-2026-08-31.json
import { readFileSync, writeFileSync } from 'node:fs';

const T = readFileSync('C:/Users/Ilham_PC/.cf_token_tmp', 'utf8').trim();
const A = '6230d5b0d8a1e8194439fd832d9e3c03';
const BUCKET = 'mobil1-posm-photos';
const START = '2026-08-30T21:45:00Z'; // 04:45 WIB (jam backup terakhir)
const END = '2026-08-31T04:25:00Z';   // 11:25 WIB (sedikit lewat jam insiden, jaga aman)
const h = { Authorization: `Bearer ${T}` };

let cursor = null, all = [], pages = 0;
do {
  let url = `https://api.cloudflare.com/client/v4/accounts/${A}/r2/buckets/${BUCKET}/objects?prefix=visits/&per_page=100`;
  if (cursor) url += '&cursor=' + cursor;
  const r = await (await fetch(url, { headers: h })).json();
  if (!r.success) { console.error('API error:', JSON.stringify(r.errors)); process.exit(1); }
  all = all.concat(r.result || []);
  cursor = r.result_info?.is_truncated ? r.result_info.cursor : null;
  pages++;
  if (pages % 50 === 0) console.log(`page ${pages}, terkumpul ${all.length}`);
} while (cursor);

console.log(`Total objek visits/: ${all.length} (${pages} halaman)`);
const win = all.filter(o => o.last_modified >= START && o.last_modified <= END);
console.log(`Objek di jendela hilang (${START} s/d ${END}): ${win.length}`);

const byMd = {};
win.forEach(o => {
  const p = o.key.split('/');
  (byMd[p[1]] = byMd[p[1]] || []).push({ visit: p[2], photo: p[3], at: o.last_modified, key: o.key });
});
for (const md of Object.keys(byMd)) {
  console.log(`MD ${md}: ${byMd[md].length} foto, ${new Set(byMd[md].map(x => x.visit)).size} visit`);
}
writeFileSync('ops/lost-photos-2026-08-31.json', JSON.stringify({ window: [START, END], total: win.length, byMd }, null, 1));
console.log('Tersimpan: ops/lost-photos-2026-08-31.json');
