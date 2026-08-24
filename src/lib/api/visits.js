// src/lib/api/visits.js
// Visit: fetch, create (upload foto + insert + backfill koordinat), delete.
import { supabase, MOCK_MODE } from '../supabase';
import { uploadAllVisitPhotos } from '../storage';
import { deletePhotosByVisit } from '../photoStore';
import { MOCK_DATA, persistMock } from './_mock';
import { fetchAllPaged } from './_helpers';

export async function fetchVisits({ mdId, month } = {}) {
  if (MOCK_MODE) {
    let v = [...MOCK_DATA.visits];
    if (mdId) v = v.filter(x => x.md_id === mdId);
    if (month) v = v.filter(x => x.visit_date.startsWith(month));
    return v.sort((a, b) => b.visit_date.localeCompare(a.visit_date));
  }

  const buildQuery = () => {
    let query = supabase
      .from('visit_details')
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
  return fetchAllPaged(buildQuery);
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
    MOCK_DATA.visits.unshift({ ...payload, created_at: new Date().toISOString() });
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
  if (error) throw error;

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
