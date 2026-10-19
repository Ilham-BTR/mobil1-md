// Opsi dropdown "MD" utk filter riwayat (Visits & Absen): semua akun MD
// (aktif maupun nonaktif) + md_id yatim yang masih punya baris riwayat tapi
// akunnya sudah dihapus (mock/legacy — di DB asli absen ikut cascade & visit
// FK restrict). Nama diambil dari kolom md_name/md_email denormalisasi di baris.
export function buildOrphanMdOptions(rows, mdById) {
  const seen = new Map();
  for (const r of rows) {
    if (r?.md_id && !mdById.has(r.md_id) && !seen.has(r.md_id)) {
      seen.set(r.md_id, r.md_name || r.md_email || 'MD terhapus');
    }
  }
  return [...seen].map(([id, name]) => ({ id, name }));
}
