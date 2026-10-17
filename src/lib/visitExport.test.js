import { describe, expect, it, vi } from 'vitest';
import { visitToCSVRow } from './visitExport.js';

vi.mock('./storage', () => ({ VISIT_PHOTO_MAP: {
  in: { col: 'photo_in', path: 'foto-in' },
  out: { col: 'photo_out', path: 'foto-out' },
} }));

describe('visitToCSVRow', () => {
  it('builds visit rows without searching master arrays repeatedly', () => {
    const visit = {
      id: 'visit-1', md_id: 'md-1', bengkel_id: 'bengkel-1', distributor_id: 'dist-1',
      visit_date: '2026-10-16', created_at: '2026-10-16T01:00:00Z', status: 'Pemasangan',
      pic_name: 'PIC', photo_count: 3,
    };
    const ctx = {
      bengkelById: new Map([['bengkel-1', { id: 'bengkel-1', code: 'B01', name: 'Bengkel', kota_id: 'kota-1', lat: -6, lng: 106 }]]),
      kotaById: new Map([['kota-1', { id: 'kota-1', name: 'Jakarta', region_id: 'region-1' }]]),
      regionById: new Map([['region-1', { id: 'region-1', name: 'Jakarta Greater' }]]),
      distributorById: new Map([['dist-1', { id: 'dist-1', name: 'Distributor' }]]),
      mdById: new Map([['md-1', { id: 'md-1', full_name: 'MD', email: 'md@example.test' }]]),
    };

    const row = visitToCSVRow(visit, ctx);
    expect(row.bengkel_code).toBe('B01');
    expect(row.kota).toBe('Jakarta');
    expect(row.region).toBe('Jakarta Greater');
    expect(row.distributor).toBe('Distributor');
    expect(row.md_name).toBe('MD');
    expect(row.tanggal).toBeTypeOf('number');
  });

  it('does not throw when distributor master row is absent', () => {
    const ctx = {
      bengkelById: new Map(), kotaById: new Map(), regionById: new Map(),
      distributorById: new Map(), mdById: new Map(),
    };
    const row = visitToCSVRow({ id: 'v', visit_date: '2026-10-16', status: 'Revisit' }, ctx);
    expect(row.distributor).toBe('');
  });
});
