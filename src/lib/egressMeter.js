// src/lib/egressMeter.js
// Hitung panggilan PostgREST nyata per-endpoint (client-side), flush batch ke
// RPC log_egress saat tab disembunyikan. Dipasang sebagai global.fetch wrapper
// di supabase client. Best-effort: gagal hitung/flush tak boleh ganggu app.
//
// Analisis: node ops/egress/measure.mjs --live
// (kalikan jumlah panggilan dengan ukuran per-request terukur).

const counts = new Map(); // endpoint -> calls

// Normalisasi URL -> label endpoint pendek: "rest:visit_list", "rpc:log_egress",
// "auth:token", "storage:...". Query string dibuang (biar teragregasi).
export function endpointLabel(url) {
  try {
    const p = new URL(url, window.location.origin).pathname;
    const m = p.match(/\/rest\/v1\/rpc\/([^/?]+)/);
    if (m) return 'rpc:' + m[1];
    const t = p.match(/\/rest\/v1\/([^/?]+)/);
    if (t) return 'rest:' + t[1];
    const a = p.match(/\/auth\/v1\/([^/?]+)/);
    if (a) return 'auth:' + a[1];
    const f = p.match(/\/functions\/v1\/([^/?]+)/);
    if (f) return 'fn:' + f[1];
    const s = p.match(/\/storage\/v1\//);
    if (s) return 'storage';
    return 'other';
  } catch { return 'other'; }
}

export function countCall(url) {
  try {
    const label = endpointLabel(url);
    counts.set(label, (counts.get(label) || 0) + 1);
  } catch { /* no-op */ }
}

// Flush via RPC. supabaseRef dilate-bind (supabase.js meng-import file ini,
// jadi tak bisa impor balik — hindari circular).
let supabaseRef = null;
export function attachEgressMeter(supabase) {
  supabaseRef = supabase;
  const flush = () => {
    if (!supabaseRef || counts.size === 0) return;
    const rows = [...counts.entries()].map(([endpoint, calls]) => ({ endpoint, calls }));
    counts.clear();
    // rpc panggilannya sendiri ikut terhitung di flush berikutnya — memang panggilan nyata.
    supabaseRef.rpc('log_egress', { p_rows: rows }).then(({ error }) => {
      if (error) console.warn('log_egress gagal (diabaikan):', error.message);
    });
  };
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') flush();
  });
  window.addEventListener('pagehide', flush);
}
