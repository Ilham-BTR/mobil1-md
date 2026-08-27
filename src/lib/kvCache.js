// src/lib/kvCache.js
// Key-value cache kecil di IndexedDB (untuk dataset besar spt bengkels yang
// kegedean buat localStorage ~5MB). Semua operasi best-effort: gagal IDB
// (private mode, quota) -> return null / no-op, caller fallback fetch penuh.

const DB_NAME = 'mobil1-kv';
const STORE = 'kv';

function openKv() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(STORE);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function kvGet(key) {
  try {
    const db = await openKv();
    return await new Promise((resolve) => {
      const tx = db.transaction(STORE, 'readonly');
      const req = tx.objectStore(STORE).get(key);
      req.onsuccess = () => resolve(req.result ?? null);
      req.onerror = () => resolve(null);
    });
  } catch { return null; }
}

export async function kvSet(key, value) {
  try {
    const db = await openKv();
    await new Promise((resolve) => {
      const tx = db.transaction(STORE, 'readwrite');
      tx.objectStore(STORE).put(value, key);
      tx.oncomplete = resolve;
      tx.onerror = resolve;
    });
  } catch { /* no-op */ }
}

export async function kvDel(key) {
  try {
    const db = await openKv();
    await new Promise((resolve) => {
      const tx = db.transaction(STORE, 'readwrite');
      tx.objectStore(STORE).delete(key);
      tx.oncomplete = resolve;
      tx.onerror = resolve;
    });
  } catch { /* no-op */ }
}
