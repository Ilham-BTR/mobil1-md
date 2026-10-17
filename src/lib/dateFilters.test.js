import { describe, expect, it } from 'vitest';
import { currentMonthKey } from './dateFilters.js';

describe('currentMonthKey', () => {
  it('returns a zero-padded local month', () => {
    expect(currentMonthKey(new Date(2026, 0, 17))).toBe('2026-01');
    expect(currentMonthKey(new Date(2026, 9, 17))).toBe('2026-10');
  });
});
