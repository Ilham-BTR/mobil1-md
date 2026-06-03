// src/lib/storage.js
// Upload foto visit.
//   - MOCK_MODE  → IndexedDB (per-device, untuk demo/testing)
//   - Production → Supabase Storage bucket `visit-photos` (cloud, multi-device)
//
// Path foto: visits/{visitId}/{photoKey}.{ext}

import { supabase, MOCK_MODE } from './supabase';
import { savePhoto } from './photoStore';

const PHOTO_BUCKET = 'visit-photos';

/**
 * Upload satu foto.
 * @param {File|Blob} file - File hasil compression dari PhotoTile
 * @param {string} visitId - UUID visit
 * @param {string} photoKey - 'foto-in' | 'foto-out' | 'spanduk-before' | dst
 * @returns {Promise<string>} - public URL (Supabase Storage) atau ref IndexedDB (mock)
 */
export async function uploadVisitPhoto(file, visitId, photoKey) {
  if (MOCK_MODE) {
    // Mock: simpan foto ke IndexedDB (persist antar-reload), return ref 'idb:visitId/key'
    const key = `${visitId}/${photoKey}`;
    try {
      await savePhoto(key, file);
      return `idb:${key}`;
    } catch (e) {
      console.warn('Gagal simpan foto ke IndexedDB, fallback blob URL:', e);
      return URL.createObjectURL(file);
    }
  }

  // Production: upload ke Supabase Storage
  const ext = (file.type?.split('/')[1] || 'jpg').replace('jpeg', 'jpg');
  const objectPath = `visits/${visitId}/${photoKey}.${ext}`;

  const { error } = await supabase.storage
    .from(PHOTO_BUCKET)
    .upload(objectPath, file, { contentType: file.type || 'image/jpeg', upsert: true });

  if (error) throw new Error(`Upload foto gagal: ${error.message}`);

  const { data } = supabase.storage.from(PHOTO_BUCKET).getPublicUrl(objectPath);
  return data.publicUrl;
}

/**
 * Upload selfie absen ke bucket visit-photos (path attendance/{mdId}/{date}/{kind}.jpg).
 * @param {File|Blob} file - selfie hasil compression
 * @param {string} mdId
 * @param {string} date - YYYY-MM-DD
 * @param {'in'|'out'} kind
 * @returns {Promise<string>} public URL (atau ref IndexedDB di mock)
 */
export async function uploadAttendancePhoto(file, mdId, date, kind) {
  if (MOCK_MODE) {
    const key = `attendance/${mdId}/${date}/${kind}`;
    try {
      await savePhoto(key, file);
      return `idb:${key}`;
    } catch (e) {
      return URL.createObjectURL(file);
    }
  }

  const objectPath = `attendance/${mdId}/${date}/${kind}.jpg`;
  const { error } = await supabase.storage
    .from(PHOTO_BUCKET)
    .upload(objectPath, file, { contentType: file.type || 'image/jpeg', upsert: true });
  if (error) throw new Error(`Upload selfie gagal: ${error.message}`);

  const { data } = supabase.storage.from(PHOTO_BUCKET).getPublicUrl(objectPath);
  return data.publicUrl;
}

/**
 * Upload semua foto visit secara paralel.
 * @param {Object} photos - { in: {file, ...}, out: {file, ...}, ... }
 * @param {string} visitId - UUID visit
 * @returns {Promise<Object>} - { photo_in, photo_out, photo_spanduk_before, ... } siap di-insert ke `visits`
 */
export async function uploadAllVisitPhotos(photos, visitId) {
  // Map UI key → DB column name + storage path
  const keyMap = {
    tampakDepan:    { col: 'photo_tampak_depan',   path: 'tampak-depan' },
    in:             { col: 'photo_in',             path: 'foto-in' },
    out:            { col: 'photo_out',            path: 'foto-out' },
    spandukBefore:  { col: 'photo_spanduk_before', path: 'spanduk-before' },
    spandukAfter:   { col: 'photo_spanduk_after',  path: 'spanduk-after' },
    posterBefore:   { col: 'photo_poster_before',  path: 'poster-before' },
    posterAfter:    { col: 'photo_poster_after',   path: 'poster-after' },
  };

  const entries = Object.entries(photos)
    .filter(([, p]) => p?.status === 'ready')
    .map(([uiKey, p]) => ({ uiKey, ...keyMap[uiKey], file: p.file }));

  const results = await Promise.all(
    entries.map(async (e) => {
      const url = await uploadVisitPhoto(e.file, visitId, e.path);
      return [e.col, url];
    })
  );

  return Object.fromEntries(results);
}
