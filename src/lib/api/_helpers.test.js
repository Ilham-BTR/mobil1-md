import { describe, expect, it, vi } from 'vitest';
import { fetchAllPaged, fetchPagedProgressively } from './_helpers.js';

describe('fetchAllPaged', () => {
  it('returns all pages in order with deterministic ranges', async () => {
    const rows = Array.from({ length: 2501 }, (_, id) => ({ id }));
    const ranges = [];
    const buildQuery = () => ({
      range(from, to) {
        ranges.push([from, to]);
        return Promise.resolve({ data: rows.slice(from, to + 1), error: null });
      },
    });

    const result = await fetchAllPaged(buildQuery, 1000);

    expect(result).toHaveLength(2501);
    expect(result.at(-1).id).toBe(2500);
    expect(ranges).toEqual([[0, 999], [1000, 1999], [2000, 2999]]);
  });

  it('throws on a failed page', async () => {
    const error = new Error('page failed');
    const buildQuery = () => ({ range: async () => ({ data: null, error }) });
    await expect(fetchAllPaged(buildQuery)).rejects.toBe(error);
  });
});

describe('fetchPagedProgressively', () => {
  it('emits page callbacks in order before resolving the complete array', async () => {
    const rows = Array.from({ length: 2001 }, (_, id) => ({ id }));
    const events = [];
    const onPage = vi.fn((_page, info) => events.push(`page:${info.offset}`));
    const buildQuery = () => ({
      range(from, to) {
        events.push(`request:${from}`);
        return Promise.resolve({ data: rows.slice(from, to + 1), error: null });
      },
    });

    const all = await fetchPagedProgressively(buildQuery, { batch: 1000, onPage });

    expect(all).toHaveLength(2001);
    expect(events.slice(0, 3)).toEqual(['request:0', 'page:0', 'request:1000']);
    expect(onPage.mock.calls[2][1].done).toBe(true);
  });

  it('reports a later page error and rejects so completeness is never implied', async () => {
    const error = new Error('later page failed');
    const onPage = vi.fn();
    const onError = vi.fn();
    const buildQuery = () => ({
      range: async from => from === 0
        ? { data: [{ id: 1 }], error: null }
        : { data: null, error },
    });

    await expect(fetchPagedProgressively(buildQuery, { batch: 1, onPage, onError })).rejects.toBe(error);
    expect(onError).toHaveBeenCalledWith(error);
    expect(onPage).toHaveBeenCalledTimes(1);
  });
});
