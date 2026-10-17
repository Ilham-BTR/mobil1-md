import { describe, expect, it, vi } from 'vitest';
import { visitToCSVRow } from './visitExport.js';

const mock = vi.hoisted(() => ({ photos: { in: { col: 'photo_in', path: 'foto-in' }, out: { col: 'photo_out', path: 'foto-out' } } }));
vi.mock('./storage', () => ({ VISIT_PHOTO_MAP: mock.photos }));

describe('visitToCSVRow', () => {
  it('uses indexed master lookups and maps the photo column identifiers', () => {
    const ctx = {
      bengkelById: new Map([['b1', { code: 'B01', name: 'Bengkel', kota_id: 'k1', lat: -6, lng: 106 }]]),
      kotaById: new Map([['k1', { name: 'Jakarta', region_id: 'r1' }]]),
      regionById: new Map([['r1', { name: 'Jakarta Greater' }]]),
      distributorById: new Map([['d1', { name: 'Distributor' }]]),
      mdById: new Map([['m1', { full_name: 'MD', email: 'md@example.test' }]]),
    };
    const row = visitToCSVRow({
      id: 'v1', md_id: 'm1', bengkel_id: 'b1', distributor_id: 'd1',
      visit_date: '2026-10-16', status: 'Pemasangan', photo_count: 2,
      photo_in: 'https://cdn.example/photo-in', photo_out: 'https://cdn.example/photo-out',
    }, ctx);
    expect(row.bengkel_code).toBe('B01');
    expect(row.kota).toBe('Jakarta');
    expect(row.region).toBe('Jakarta Greater');
    expect(row.distributor).toBe('Distributor');
    expect(row.link_in).toBe('https://cdn.example/photo-in');
    expect(row.link_out).toBe('https://cdn.example/photo-out');
  });

  it('allows a missing distributor lookup', () => {
    const ctx = { bengkelById: new Map(), kotaById: new Map(), regionById: new Map(), mdById: new Map() };
    expect(visitToCSVRow({ id: 'v', visit_date: '2026-10-16' }, ctx).distributor).toBe('');
  });
});
