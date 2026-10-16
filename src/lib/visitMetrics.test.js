import { describe, expect, it } from 'vitest';
import { aggregateVisitTotals, aggregateVisitsByMd } from './visitMetrics.js';

describe('aggregateVisitTotals', () => {
  it('counts totals, statuses and active MDs without mutating rows', () => {
    const rows = [
      { status: 'Pemasangan', md_id: 'a' },
      { status: 'Revisit', md_id: 'a' },
      { status: 'Pemasangan', md_id: 'b' },
    ];
    expect(aggregateVisitTotals(rows)).toEqual({ total: 3, pemasangan: 2, revisit: 1, activeMdCount: 2 });
  });
});

describe('aggregateVisitsByMd', () => {
  const visits = [
    { md_id: 'a', visit_date: '2026-10-01', status: 'Pemasangan' },
    { md_id: 'a', visit_date: '2026-10-01', status: 'Revisit' },
    { md_id: 'b', visit_date: '2026-10-02', status: 'Revisit' },
    { md_id: 'a', visit_date: '2026-09-30', status: 'Pemasangan' },
  ];

  it('counts monthly totals, statuses and unique active days', () => {
    const metrics = aggregateVisitsByMd(visits, '2026-10');
    expect(metrics.get('a')).toEqual({ total: 2, pemasangan: 1, revisit: 1, activeDays: 1 });
    expect(metrics.get('b')).toEqual({ total: 1, pemasangan: 0, revisit: 1, activeDays: 1 });
  });

  it('applies an inclusive date range when either bound is set', () => {
    const metrics = aggregateVisitsByMd(visits, null, { dari: '2026-10-01', sampai: '2026-10-01' });
    expect(metrics.get('a')?.total).toBe(2);
    expect(metrics.has('b')).toBe(false);
  });

  it('does not mutate the source array', () => {
    const original = structuredClone(visits);
    aggregateVisitsByMd(visits, '2026-10');
    expect(visits).toEqual(original);
  });
});
