import { describe, expect, it } from 'vitest';
import { buildOrphanMdOptions } from './mdOptions';

describe('buildOrphanMdOptions', () => {
  const mdById = new Map([['m1', { id: 'm1', full_name: 'Aktif' }]]);

  it('returns [] when every row md_id is known', () => {
    expect(buildOrphanMdOptions([{ md_id: 'm1' }], mdById)).toEqual([]);
  });

  it('collects unknown md_ids once, preferring md_name then md_email', () => {
    const rows = [
      { md_id: 'x', md_name: 'Budi', md_email: 'b@x.id' },
      { md_id: 'x', md_name: 'Budi' },
      { md_id: 'y', md_email: 'y@x.id' },
      { md_id: 'z' },
      null,
    ];
    expect(buildOrphanMdOptions(rows, mdById)).toEqual([
      { id: 'x', name: 'Budi' },
      { id: 'y', name: 'y@x.id' },
      { id: 'z', name: 'MD terhapus' },
    ]);
  });
});
