// src/lib/api/_helpers.js
// Stream paged requests immediately while retaining a complete result for callers
// that require it. A late-page failure rejects instead of looking like complete data.
export async function fetchPagedProgressively(buildQuery, {
  batch = 1000,
  onPage,
  onError,
} = {}) {
  const all = [];
  let offset = 0;
  let firstPage = true;

  while (true) {
    const { data, error } = await buildQuery().range(offset, offset + batch - 1);
    if (error) {
      if (!firstPage) onError?.(error);
      throw error;
    }

    const rows = data || [];
    all.push(...rows);
    onPage?.(rows, { offset, firstPage, done: rows.length < batch });
    firstPage = false;
    if (rows.length < batch) return all;
    offset += rows.length;
  }
}

// PostgREST caps responses around 1000 rows, so keep fetching until complete.
export async function fetchAllPaged(buildQuery, batch = 1000) {
  return fetchPagedProgressively(buildQuery, { batch });
}
