// src/lib/api/master.js
// Master data: regions, kotas, distributors, bengkels, akun (profiles), TL regions.
import { supabase, MOCK_MODE } from '../supabase';
import { MOCK_DATA, persistMock } from './_mock';
import { fetchAllPaged } from './_helpers';

export async function fetchRegions() {
  if (MOCK_MODE) return [...MOCK_DATA.regions];
  const { data, error } = await supabase.from('regions').select('*').order('name');
  if (error) throw error;
  return data;
}

export async function fetchKotas() {
  if (MOCK_MODE) return [...MOCK_DATA.kotas];
  const { data, error } = await supabase.from('kotas').select('*, region:regions!region_id(*)').order('name');
  if (error) throw error;
  return data;
}

export async function fetchDistributors() {
  if (MOCK_MODE) return [...MOCK_DATA.distributors];
  const { data, error } = await supabase.from('distributors').select('*, region:regions!region_id(*)').order('name');
  if (error) throw error;
  return data;
}

// regionId (opsional): batasi ke bengkel di region itu saja. Dipakai MD supaya
// tak menarik SEMUA bengkel (2000+) yang bikin OOM di HP RAM kecil.
export async function fetchBengkels(regionId = null) {
  if (MOCK_MODE) {
    const all = [...MOCK_DATA.bengkels];
    if (!regionId) return all;
    const kotaIds = new Set(MOCK_DATA.kotas.filter(k => k.region_id === regionId).map(k => k.id));
    return all.filter(b => kotaIds.has(b.kota_id));
  }
  if (regionId) {
    // inner join kotas + filter region -> hanya bengkel di region MD
    return fetchAllPaged(() =>
      supabase.from('bengkels')
        .select('*, kota:kotas!inner(*, region:regions!region_id(*))')
        .eq('kota.region_id', regionId)
        .order('code')
    );
  }
  return fetchAllPaged(() =>
    supabase.from('bengkels').select('*, kota:kotas(*, region:regions!region_id(*))').order('code')
  );
}

// ---- Cache bengkels (egress): IndexedDB + delta-sync by updated_at ----------
// Bengkels = query terberat kedua (terukur 405KB gz / 2.6MB raw utk semua,
// ~72KB gz per-region MD) dan ditarik TIAP login. Cache di IDB; load berikutnya
// cukup delta (updated_at > lastSync) -> ~1KB. Full refresh paksa saat mutasi
// master bengkel (delete tak terdeteksi delta) & saat cache > 7 hari.
const BENGKEL_CACHE_TTL_MS = 7 * 24 * 3600 * 1000;
const bengkelCacheKey = (regionId) => 'bengkels:' + (regionId || 'all');

export async function fetchBengkelsCached(regionId = null, { force = false } = {}) {
  if (MOCK_MODE) return fetchBengkels(regionId);
  const key = bengkelCacheKey(regionId);
  const { kvGet, kvSet } = await import('../kvCache');
  const cached = !force ? await kvGet(key) : null;
  const fresh = cached && Array.isArray(cached.rows) && cached.lastSync
    && (Date.now() - (cached.savedAt || 0) < BENGKEL_CACHE_TTL_MS);

  if (!fresh) {
    const rows = await fetchBengkels(regionId);
    let lastSync = null;
    for (const b of rows) if (b.updated_at && (!lastSync || b.updated_at > lastSync)) lastSync = b.updated_at;
    kvSet(key, { rows, lastSync, savedAt: Date.now() });
    return rows;
  }

  // Delta: hanya bengkel yang berubah sejak lastSync (select nested sama persis).
  try {
    const build = regionId
      ? () => supabase.from('bengkels')
          .select('*, kota:kotas!inner(*, region:regions!region_id(*))')
          .eq('kota.region_id', regionId)
          .gt('updated_at', cached.lastSync)
      : () => supabase.from('bengkels')
          .select('*, kota:kotas(*, region:regions!region_id(*))')
          .gt('updated_at', cached.lastSync);
    const delta = await fetchAllPaged(build);
    if (!delta.length) return cached.rows;
    const map = new Map(cached.rows.map(b => [b.id, b]));
    let lastSync = cached.lastSync;
    for (const b of delta) {
      map.set(b.id, b);
      if (b.updated_at && b.updated_at > lastSync) lastSync = b.updated_at;
    }
    const rows = [...map.values()].sort((a, b) => (a.code || '').localeCompare(b.code || ''));
    kvSet(key, { rows, lastSync, savedAt: cached.savedAt });
    return rows;
  } catch (e) {
    console.warn('Delta bengkels gagal, fallback full fetch:', e?.message);
    return fetchBengkels(regionId);
  }
}

// Semua akun (untuk kelola di Master Data) — RLS: admin/super lihat semua, TL region-nya, MD miliknya.
export async function fetchAccounts() {
  if (MOCK_MODE) {
    return [...MOCK_DATA.profiles]
      .map(p => ({ ...p, region_ids: p.region_ids?.length ? p.region_ids : (p.region_id ? [p.region_id] : []) }))
      .sort((a, b) => (a.full_name || '').localeCompare(b.full_name || ''));
  }
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('role')
    .order('full_name');
  if (error) throw error;
  const profs = data || [];
  // Lampirkan daftar region untuk TL (RLS tl_regions: TL lihat sendiri, super admin semua).
  const { data: tlr } = await supabase.from('tl_regions').select('tl_id, region_id');
  const byTl = {};
  (tlr || []).forEach(r => { (byTl[r.tl_id] ||= []).push(r.region_id); });
  return profs.map(p => ({
    ...p,
    region_ids: byTl[p.id]?.length ? byTl[p.id] : (p.region_id ? [p.region_id] : []),
  }));
}

/**
 * Set daftar region yang dicover seorang TL (replace semua baris tl_regions).
 * Dipakai super admin saat edit akun TL. Create memakai edge function.
 */
export async function setTlRegions(tlId, regionIds) {
  const ids = (regionIds || []).filter(Boolean);
  if (MOCK_MODE) {
    const p = MOCK_DATA.profiles.find(x => x.id === tlId);
    if (p) { p.region_ids = ids; p.region_id = ids[0] || null; persistMock(); }
    return;
  }
  await supabase.from('tl_regions').delete().eq('tl_id', tlId);
  if (ids.length) {
    const { error } = await supabase.from('tl_regions').insert(ids.map(rid => ({ tl_id: tlId, region_id: rid })));
    if (error) throw error;
  }
}

export async function addMaster(table, payload) {
  if (MOCK_MODE) {
    const id = 'new_' + Date.now();
    const item = { id, ...payload };
    MOCK_DATA[table].push(item);
    persistMock();
    return item;
  }
  const { data, error } = await supabase.from(table).insert(payload).select().single();
  if (error) throw error;
  return data;
}

/**
 * Bulk insert bengkels (untuk import dari Excel/CSV).
 * Payload sudah ter-validate di client. Insert dilakukan dalam batch agar
 * tidak hit limit body size & memberi progress feedback per chunk.
 *
 * @param {Array<Object>} rows - payload siap insert (code, name, kota_id, distributor_id, lat, lng)
 * @param {(done:number,total:number)=>void} [onProgress] - callback opsional per batch
 * @returns {Promise<{inserted:number, errors:Array<{row:number, message:string}>}>}
 */
export async function bulkAddBengkels(rows, onProgress) {
  const BATCH = 50;
  const result = { inserted: 0, errors: [] };

  if (MOCK_MODE) {
    for (let i = 0; i < rows.length; i++) {
      const r = rows[i];
      try {
        // Cek dupe by code di mock
        if (MOCK_DATA.bengkels.some(b => b.code === r.code)) {
          result.errors.push({ row: i + 1, message: `Kode ${r.code} sudah ada` });
        } else {
          MOCK_DATA.bengkels.push({ id: 'new_' + Date.now() + '_' + i, ...r });
          result.inserted++;
        }
      } catch (e) {
        result.errors.push({ row: i + 1, message: e.message });
      }
      if (onProgress && (i + 1) % BATCH === 0) onProgress(i + 1, rows.length);
    }
    persistMock();
    onProgress?.(rows.length, rows.length);
    return result;
  }

  // Supabase: insert per batch (gunakan upsert via on_conflict agar duplicate code bisa di-handle)
  for (let i = 0; i < rows.length; i += BATCH) {
    const chunk = rows.slice(i, i + BATCH);
    const { data, error } = await supabase
      .from('bengkels')
      .insert(chunk)
      .select('id, code');
    if (error) {
      // Kalau batch error karena 1 dupe, fall back ke per-row agar yang lain tetap insert
      for (let j = 0; j < chunk.length; j++) {
        const single = chunk[j];
        const { error: e } = await supabase.from('bengkels').insert(single).select('id').single();
        if (e) result.errors.push({ row: i + j + 1, message: e.message });
        else result.inserted++;
      }
    } else {
      result.inserted += data?.length || chunk.length;
    }
    onProgress?.(Math.min(i + BATCH, rows.length), rows.length);
  }
  return result;
}

/**
 * Bulk insert master sederhana (regions, distributors, kotas).
 * Payload sudah ter-validate & ter-enrich di client (kotas sudah punya region_id).
 * @param {string} table - 'regions' | 'distributors' | 'kotas'
 * @param {Array<Object>} rows
 * @param {(done:number,total:number)=>void} [onProgress]
 * @returns {Promise<{inserted:number, errors:Array<{row:number,message:string}>}>}
 */
export async function bulkAddMaster(table, rows, onProgress) {
  const BATCH = 100;
  const result = { inserted: 0, errors: [] };

  if (MOCK_MODE) {
    for (let i = 0; i < rows.length; i++) {
      MOCK_DATA[table].push({ id: 'new_' + Date.now() + '_' + i, ...rows[i] });
      result.inserted++;
    }
    persistMock();
    onProgress?.(rows.length, rows.length);
    return result;
  }

  for (let i = 0; i < rows.length; i += BATCH) {
    const chunk = rows.slice(i, i + BATCH);
    const { data, error } = await supabase.from(table).insert(chunk).select('id');
    if (error) {
      // fallback per-row biar yang valid tetap masuk
      for (let j = 0; j < chunk.length; j++) {
        const { error: e } = await supabase.from(table).insert(chunk[j]).select('id').single();
        if (e) result.errors.push({ row: i + j + 1, message: e.message });
        else result.inserted++;
      }
    } else {
      result.inserted += data?.length || chunk.length;
    }
    onProgress?.(Math.min(i + BATCH, rows.length), rows.length);
  }
  return result;
}

/**
 * Bulk create akun MD.
 * MD = auth user + profile, jadi di real mode WAJIB lewat Edge Function
 * (pakai service_role untuk createUser). Di mock mode cukup push ke profiles.
 *
 * @param {Array<Object>} rows - { email, full_name, role, region_id, monthly_target, password }
 * @param {(done:number,total:number)=>void} [onProgress]
 * @returns {Promise<{inserted:number, errors:Array<{row:number,message:string}>}>}
 */
export async function bulkCreateMDs(rows, onProgress) {
  const result = { inserted: 0, errors: [] };

  if (MOCK_MODE) {
    for (let i = 0; i < rows.length; i++) {
      const r = rows[i];
      if (MOCK_DATA.profiles.some(p => p.email === r.email.toLowerCase())) {
        result.errors.push({ row: i + 1, message: `Email ${r.email} sudah ada` });
      } else {
        MOCK_DATA.profiles.push({
          id: 'new_md_' + Date.now() + '_' + i,
          email: r.email.toLowerCase(),
          full_name: r.full_name,
          role: r.role || 'md',
          region_id: r.region_id || null,
          region_ids: (r.role === 'tl' && Array.isArray(r.region_ids)) ? r.region_ids.filter(Boolean) : undefined,
          monthly_target: r.monthly_target || 30,
          login_password: r.password || 'mobil1',  // mock: simpan password biar bisa login & terlihat admin
        });
        result.inserted++;
      }
      onProgress?.(i + 1, rows.length);
    }
    persistMock();
    return result;
  }

  // Real Supabase: panggil edge function yang pakai service_role
  const { data, error } = await supabase.functions.invoke('admin-create-md', {
    body: { users: rows },
  });
  if (error) throw new Error(`Edge function gagal: ${error.message}`);
  onProgress?.(rows.length, rows.length);
  return data || result;
}

/**
 * Hapus 1 akun MD (hanya super admin) — hapus auth user (profil ikut cascade).
 * Gagal kalau MD masih punya visit (FK restrict).
 * @param {string} userId
 */
export async function deleteMd(userId) {
  if (MOCK_MODE) {
    if (MOCK_DATA.visits.some(v => v.md_id === userId)) throw new Error('MD masih punya visit — tidak bisa dihapus');
    MOCK_DATA.profiles = MOCK_DATA.profiles.filter(p => p.id !== userId);
    persistMock();
    return { ok: true };
  }
  const { data, error } = await supabase.functions.invoke('admin-create-md', {
    body: { action: 'delete', userId },
  });
  if (error) throw new Error(`Hapus akun gagal: ${error.message}`);
  if (data?.error) throw new Error(data.error);
  return data || { ok: true };
}

/**
 * Reset password 1 akun MD (hanya super admin) — update auth + simpan login_password.
 * @param {string} userId
 * @param {string} password
 */
export async function resetMdPassword(userId, password) {
  if (MOCK_MODE) {
    const p = MOCK_DATA.profiles.find(x => x.id === userId);
    if (!p) throw new Error('Akun tidak ditemukan');
    p.login_password = password;
    persistMock();
    return { ok: true };
  }
  const { data, error } = await supabase.functions.invoke('admin-create-md', {
    body: { action: 'reset', userId, password },
  });
  if (error) throw new Error(`Reset password gagal: ${error.message}`);
  if (data?.error) throw new Error(data.error);
  return data || { ok: true };
}

export async function updateMaster(table, id, patch) {
  if (MOCK_MODE) {
    const idx = MOCK_DATA[table].findIndex(x => x.id === id);
    if (idx === -1) throw new Error('Item tidak ditemukan');
    // updated_at ikut di-set (produksi via trigger) -> delta-sync jalan di mock juga
    MOCK_DATA[table][idx] = { ...MOCK_DATA[table][idx], ...patch, updated_at: new Date().toISOString() };
    persistMock();
    return MOCK_DATA[table][idx];
  }
  const { data, error } = await supabase.from(table).update(patch).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

export async function deleteMaster(table, id) {
  if (MOCK_MODE) {
    MOCK_DATA[table] = MOCK_DATA[table].filter(x => x.id !== id);
    persistMock();
    return;
  }
  const { error } = await supabase.from(table).delete().eq('id', id);
  if (error) throw error;
}
