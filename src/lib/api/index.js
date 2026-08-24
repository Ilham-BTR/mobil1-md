// src/lib/api/index.js
// Data access layer untuk Mobil1 POSM Tracker — barrel.
// Dipecah per domain (auth, master, visits, attendance) + state mock bersama.
// Import lama `from './lib/api'` tetap jalan lewat re-export di sini.
// Mock fallback otomatis aktif kalau .env belum di-set.

export { resetMockData } from './_mock';
export * from './auth';
export * from './master';
export * from './visits';
export * from './attendance';

// Upload-saat-foto-diambil (eager upload) dari UI — di-serve dari storage.
export { uploadOneVisitPhoto, uploadAttendancePhoto } from '../storage';
