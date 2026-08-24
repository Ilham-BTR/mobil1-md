// src/lib/api/_mock.js
// State mock (dev tanpa Supabase) — di-persist ke localStorage.
// MOCK_DATA dishare by reference ke semua modul api; dimutasi in-place
// (Object.assign / push / filter-reassign properti), TIDAK pernah di-reassign
// sebagai objek, jadi aman diimpor dari mana saja.
import { SEED_REGIONS, SEED_DISTRIBUTORS, SEED_KOTAS, SEED_BENGKELS } from '../seedData';
import { clearPhotos } from '../photoStore';

// Bump versi ini tiap kali seed data berubah → localStorage lama diabaikan, seed baru ke-load.
const MOCK_STORAGE_KEY = 'mobil1_mock_data_v2';

// State default kalau localStorage belum ada isinya — di-seed dari CSV (lihat scripts/generate-seed.mjs)
export const DEFAULT_MOCK = {
  regions: SEED_REGIONS,
  kotas: SEED_KOTAS,
  distributors: SEED_DISTRIBUTORS,
  bengkels: SEED_BENGKELS,
  // Akun login default: 1 admin + 1 MD
  profiles: [
    { id: 'u1', email: 'budi@mobil1.id',  full_name: 'Budi Santoso',  role: 'md',          region_id: 'r1', monthly_target: 40, login_password: 'mobil1' },
    { id: 'u4', email: 'admin@mobil1.id', full_name: 'Admin Pusat',   role: 'admin',       region_id: null, monthly_target: 0,  login_password: 'mobil1' },
    { id: 'u5', email: 'super@mobil1.id', full_name: 'Super Admin',   role: 'super_admin', region_id: null, monthly_target: 0,  login_password: 'mobil1' },
    { id: 'u6', email: 'tl@mobil1.id',    full_name: 'TL Jawa Timur', role: 'tl',          region_id: 'r1', monthly_target: 0,  login_password: 'mobil1' },
  ],
  visits: [],
};

// Load dari localStorage; fallback ke default
function loadMockData() {
  if (typeof localStorage === 'undefined') return structuredClone(DEFAULT_MOCK);
  try {
    const raw = localStorage.getItem(MOCK_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Pastikan semua key ada (kalau struktur lama)
      return { ...structuredClone(DEFAULT_MOCK), ...parsed };
    }
  } catch (e) { console.warn('Gagal load mock data dari localStorage:', e); }
  return structuredClone(DEFAULT_MOCK);
}

export const MOCK_DATA = loadMockData();

// Simpan MOCK_DATA ke localStorage (dipanggil tiap mutasi)
export function persistMock() {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(MOCK_DATA));
  } catch (e) { console.warn('Gagal simpan mock data ke localStorage:', e); }
}

// Attendance lazy-init (mock) — dipakai modul attendance.
export function mockAtt() {
  if (!MOCK_DATA.attendances) MOCK_DATA.attendances = [];
  return MOCK_DATA.attendances;
}

// Reset semua data demo ke default (panggil dari console: window.__resetMockData())
export function resetMockData() {
  Object.assign(MOCK_DATA, structuredClone(DEFAULT_MOCK));
  persistMock();
  clearPhotos();  // hapus juga foto di IndexedDB
}
if (typeof window !== 'undefined') window.__resetMockData = resetMockData;
