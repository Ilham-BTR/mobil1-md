// src/lib/api/_helpers.js
// Ambil SEMUA baris — PostgREST membatasi ~1000 baris/request, jadi paginasi
// pakai .range() sampai habis. buildQuery() harus mengembalikan query BARU tiap
// dipanggil (karena .range diterapkan ulang).
export async function fetchAllPaged(buildQuery, batch = 1000) {
  const all = [];
  for (let from = 0; ; from += batch) {
    const { data, error } = await buildQuery().range(from, from + batch - 1);
    if (error) throw error;
    all.push(...(data || []));
    if (!data || data.length < batch) break;
  }
  return all;
}
