// src/lib/api/visits.js
// Visit: fetch, create (upload foto + insert + backfill koordinat), delete.
import { supabase, MOCK_MODE } from '../supabase';
import { uploadAllVisitPhotos } from '../storage';
import { deletePhotosByVisit } from '../photoStore';
import { MOCK_DATA, persistMock } from './_mock';
import { fetchAllPaged } from './_helpers';

// Kolom foto di baris visit (URL R2) — daftar TIDAK menariknya lagi (egress).
export const VISIT_PHOTO_COLS = [
  'photo_tampak_depan', 'photo_in', 'photo_out',
  'photo_spanduk_before', 'photo_spanduk_putih', 'photo_spanduk_after',
  'photo_poster_before', 'photo_poster_putih', 'photo_poster_after',
  'photo_delivery_gimmick', 'photo_deploy_planogram',
];

const countPhotos = (v) => VISIT_PHOTO_COLS.filter(k => v[k]).length;

/**
 * Daftar visit LEAN — view visit_list (tanpa 11 kolom URL foto, ada photo_count).
 * Terukur: -28% gzip & -55% raw vs visit_details (829KB -> 597KB gz / load penuh).
 * Fallback otomatis ke visit_details bila migrasi 0017 belum dijalankan.
 */
export async function fetchVisits({ mdId, month } = {}) {
  if (MOCK_MODE) {
    let v = [...MOCK_DATA.visits];
    if (mdId) v = v.filter(x => x.md_id === mdId);
    if (month) v = v.filter(x => x.visit_date.startsWith(month));
    return v
      .sort((a, b) => b.visit_date.localeCompare(a.visit_date))
      .map(x => ({ ...x, photo_count: countPhotos(x) }));
  }

  const buildQuery = (view) => () => {
    let query = supabase
      .from(view)
      .select('*')
      .order('visit_date', { ascending: false });
    if (mdId) query = query.eq('md_id', mdId);
    if (month) {
      const start = month + '-01';
      const [y, m] = month.split('-');
      const lastDay = new Date(Number(y), Number(m), 0).getDate();
      const end = `${month}-${String(lastDay).padStart(2, '0')}`;
      query = query.gte('visit_date', start).lte('visit_date', end);
    }
    return query;
  };
  try {
    return await fetchAllPaged(buildQuery('visit_list'));
  } catch (e) {
    // View belum ada (migrasi 0017 belum jalan) -> perilaku lama.
    console.warn('visit_list tak tersedia, fallback visit_details:', e.message);
    const rows = await fetchAllPaged(buildQuery('visit_details'));
    return rows.map(x => ({ ...x, photo_count: countPhotos(x) }));
  }
}

/**
 * Delta visit sejak `since` (ISO updated_at terakhir yang dimiliki client).
 * Dipakai merge incremental — jangan tarik ulang seluruh daftar (egress).
 * Mengembalikan baris LEAN (visit_list) yang berubah/baru saja.
 */
export async function fetchVisitsDelta({ since, mdId } = {}) {
  if (MOCK_MODE) {
    let v = MOCK_DATA.visits.filter(x => since && x.updated_at && x.updated_at > since);
    if (mdId) v = v.filter(x => x.md_id === mdId);
    return v.map(x => ({ ...x, photo_count: countPhotos(x) }));
  }
  const build = (view) => () => {
    let q = supabase.from(view).select('*')
      .gt('updated_at', since)
      .order('updated_at', { ascending: true });
    if (mdId) q = q.eq('md_id', mdId);
    return q;
  };
  try {
    return await fetchAllPaged(build('visit_list'));
  } catch (e) {
    const rows = await fetchAllPaged(build('visit_details'));
    return rows.map(x => ({ ...x, photo_count: countPhotos(x) }));
  }
}

/**
 * 1 visit LENGKAP (termasuk URL foto) — dipanggil saat modal detail dibuka.
 */
export async function fetchVisitFull(visitId) {
  if (MOCK_MODE) {
    const v = MOCK_DATA.visits.find(x => x.id === visitId);
    return v ? { ...v, photo_count: countPhotos(v) } : null;
  }
  const { data, error } = await supabase
    .from('visit_details')
    .select('*')
    .eq('id', visitId)
    .maybeSingle();
  if (error) throw error;
  return data ? { ...data, photo_count: countPhotos(data) } : null;
}

/**
 * Peta id -> kolom foto untuk BANYAK visit (dipakai Export Excel).
 * Hanya id + 11 kolom foto (bukan seluruh baris), paged.
 */
export async function fetchVisitPhotosMap(visitIds) {
  const map = new Map();
  if (MOCK_MODE) {
    MOCK_DATA.visits.forEach(v => { if (visitIds.includes(v.id)) map.set(v.id, v); });
    return map;
  }
  const cols = 'id,' + VISIT_PHOTO_COLS.join(',');
  // In-filter panjang bisa melebihi limit URL -> chunk 200 id per request.
  for (let i = 0; i < visitIds.length; i += 200) {
    const chunk = visitIds.slice(i, i + 200);
    const { data, error } = await supabase.from('visits').select(cols).in('id', chunk);
    if (error) throw error;
    (data || []).forEach(v => map.set(v.id, v));
  }
  return map;
}

/**
 * Create visit: upload photos to B2, then insert row.
 * Kalau bengkel belum punya lat/lng di master, dan MD captured GPS,
 * otomatis backfill bengkels.lat/lng via RPC (idempotent).
 *
 * @param {Object} args - { mdId, bengkelId, distributorId, visitDate, picName, picPhone, status,
 *                          remarks, lat, lng, photos, backfillBengkelCoords? }
 * @returns {Promise<{ visit: Object, bengkelBackfilled: boolean }>}
 */
export async function createVisit(args) {
  // Pakai visitId dari form (kalau foto sudah di-upload duluan pakai id itu),
  // kalau tidak ada generate baru.
  const visitId = args.visitId || crypto.randomUUID();

  // Anti-duplikat: 1 MD × 1 bengkel × 1 hari. Dicek SEBELUM upload foto
  // (jangan buang bandwidth), dan dilindungi lagi unique index DB (23505).
  const dupMsg = 'Visit untuk bengkel ini sudah ada hari ini — 1 bengkel maksimal 1 visit per hari.';
  if (!MOCK_MODE) {
    const { data: dup, error: dupErr } = await supabase
      .from('visits')
      .select('id')
      .eq('md_id', args.mdId)
      .eq('bengkel_id', args.bengkelId)
      .eq('visit_date', args.visitDate)
      .limit(1);
    if (dupErr) throw dupErr;
    if (dup && dup.length > 0) throw new Error(dupMsg);
  } else if (MOCK_DATA.visits.some(v =>
    v.md_id === args.mdId && v.bengkel_id === args.bengkelId && v.visit_date === args.visitDate)) {
    throw new Error(dupMsg);
  }

  // 1. Upload all photos in parallel
  const photoUrls = await uploadAllVisitPhotos(args.photos, visitId);

  // 2. Insert visit row
  const payload = {
    id: visitId,
    md_id: args.mdId,
    bengkel_id: args.bengkelId,
    distributor_id: args.distributorId || null,
    visit_date: args.visitDate,
    pic_name: args.picName,
    pic_phone: args.picPhone,
    status: args.status,
    sub_type: args.subType || null,
    remarks: args.remarks || null,
    visit_lat: args.lat,
    visit_lng: args.lng,
    ...photoUrls,
  };

  const canBackfill = args.backfillBengkelCoords && args.lat != null && args.lng != null;

  if (MOCK_MODE) {
    const nowIso = new Date().toISOString();
    MOCK_DATA.visits.unshift({ ...payload, created_at: nowIso, updated_at: nowIso });
    let bengkelBackfilled = false;
    if (canBackfill) {
      const b = MOCK_DATA.bengkels.find(x => x.id === args.bengkelId);
      if (b && (b.lat == null || b.lng == null)) {
        b.lat = args.lat;
        b.lng = args.lng;
        bengkelBackfilled = true;
      }
    }
    persistMock();
    return { visit: payload, bengkelBackfilled };
  }

  const { data, error } = await supabase
    .from('visits')
    .insert(payload)
    .select()
    .single();
  if (error) {
    if (error.code === '23505') throw new Error(dupMsg);  // kalah race dgn device lain
    throw error;
  }

  // Backfill bengkel coords (best-effort — error di sini tidak boleh gagalkan visit yang sudah saved)
  let bengkelBackfilled = false;
  if (canBackfill) {
    try {
      const { data: ok, error: bfErr } = await supabase.rpc('backfill_bengkel_coords', {
        p_bengkel_id: args.bengkelId,
        p_lat: args.lat,
        p_lng: args.lng,
      });
      if (bfErr) {
        console.warn('Backfill bengkel coords gagal:', bfErr.message);
      } else {
        bengkelBackfilled = !!ok;
      }
    } catch (e) {
      console.warn('Backfill RPC error:', e);
    }
  }

  return { visit: data, bengkelBackfilled };
}

/**
 * Hapus 1 visit beserta foto-fotonya.
 * Mock: hapus dari MOCK_DATA.visits + foto IndexedDB.
 * Produksi: hapus file di Storage (visit-photos/visits/{id}/*) lalu delete row.
 */
export async function deleteVisit(visitId) {
  if (MOCK_MODE) {
    MOCK_DATA.visits = MOCK_DATA.visits.filter(v => v.id !== visitId);
    persistMock();
    await deletePhotosByVisit(visitId);
    return;
  }

  // 1. Hapus foto di Storage (best-effort)
  try {
    const folder = `visits/${visitId}`;
    const { data: files } = await supabase.storage.from('visit-photos').list(folder);
    if (files && files.length) {
      const paths = files.map(f => `${folder}/${f.name}`);
      await supabase.storage.from('visit-photos').remove(paths);
    }
  } catch (e) {
    console.warn('Hapus foto Storage gagal (lanjut hapus row):', e);
  }

  // 2. Hapus row visit (RLS: hanya super_admin boleh delete)
  //    .select() -> verifikasi row benar-benar terhapus. Kalau RLS memblok,
  //    delete mengembalikan 0 baris TANPA error (sukses palsu) -> kita jadikan error.
  const { data, error } = await supabase.from('visits').delete().eq('id', visitId).select('id');
  if (error) throw error;
  if (!data || data.length === 0) {
    throw new Error('Visit tidak terhapus (0 baris). Pastikan login sebagai super admin — hanya super admin yang boleh menghapus.');
  }
}
