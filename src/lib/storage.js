// src/lib/storage.js
// Upload foto visit & selfie absen.
//   - MOCK_MODE  → IndexedDB (per-device, untuk demo/testing)
//   - Production → Backblaze B2 via presigned URL (edge function `get-upload-url`)
//
// Alur production (key B2 tidak pernah ke client):
//   1. invoke edge function `get-upload-url` → dapat { uploadUrl, publicUrl }
//   2. PUT file langsung ke B2 pakai uploadUrl
//   3. simpan publicUrl ke DB (di-serve langsung dari B2, atau via Cloudflare CDN kalau CDN_BASE_URL diset)

import { supabase, MOCK_MODE } from './supabase';
import { savePhoto } from './photoStore';

/**
 * Minta presigned URL ke edge function, lalu PUT file ke B2.
 * @param {string} scope - 'visit' | 'attendance'
 * @param {object} payload - field tambahan sesuai scope (visitId+photoKey, atau date+kind)
 * @param {File|Blob} file
 * @returns {Promise<string>} public URL foto
 */
async function presignAndPut(scope, payload, file) {
  const contentType = file.type || 'image/jpeg';

  const { data, error } = await supabase.functions.invoke('get-upload-url', {
    body: { scope, ...payload, contentType },
  });
  if (error) throw new Error(`Gagal minta upload URL: ${error.message}`);
  if (!data?.uploadUrl) throw new Error(data?.error || 'Upload URL kosong dari server');

  // Content-Type WAJIB sama dengan yang ditandatangani edge function
  const res = await fetch(data.uploadUrl, {
    method: 'PUT',
    headers: { 'Content-Type': contentType },
    body: file,
  });
  if (!res.ok) throw new Error(`Upload ke B2 gagal: ${res.status} ${res.statusText}`);

  return data.publicUrl;
}

/**
 * Upload satu foto.
 * @param {File|Blob} file - File hasil compression dari PhotoTile
 * @param {string} visitId - UUID visit
 * @param {string} photoKey - 'foto-in' | 'foto-out' | 'spanduk-before' | dst
 * @returns {Promise<string>} - public URL (B2/CDN) atau ref IndexedDB (mock)
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

  // Production: upload ke Backblaze B2 via presigned URL
  return presignAndPut('visit', { visitId, photoKey }, file);
}

/**
 * Upload selfie absen ke B2 (path attendance/{userId}/{date}/{kind}.jpg).
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

  // Production: upload ke Backblaze B2 (mdId diabaikan; path pakai user.id dari JWT di server)
  return presignAndPut('attendance', { date, kind }, file);
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
