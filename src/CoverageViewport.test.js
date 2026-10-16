import { afterEach, describe, expect, it, vi } from 'vitest';
import { createElement } from 'react';
import { act, create } from 'react-test-renderer';

const mock = vi.hoisted(() => ({ map: null, events: null }));
vi.mock('react-leaflet', () => ({ useMap: () => mock.map, useMapEvents: events => { mock.events = events; } }));

import CoverageViewport from './CoverageViewport.jsx';

describe('CoverageViewport', () => {
  const rafOriginal = globalThis.requestAnimationFrame;
  const cancelOriginal = globalThis.cancelAnimationFrame;
  let callback;

  afterEach(() => {
    globalThis.requestAnimationFrame = rafOriginal;
    globalThis.cancelAnimationFrame = cancelOriginal;
    callback = null;
  });

  it('reports initial bounds and updates after movement and zoom', () => {
    let bounds = { id: 'initial' };
    let zoom = 5;
    mock.map = { getBounds: vi.fn(() => bounds), getZoom: vi.fn(() => zoom) };
    const onChange = vi.fn();
    globalThis.requestAnimationFrame = vi.fn(fn => { callback = fn; return 1; });
    globalThis.cancelAnimationFrame = vi.fn();

    let renderer;
    act(() => { renderer = create(createElement(CoverageViewport, { onChange })); });
    act(() => callback());
    expect(onChange).toHaveBeenLastCalledWith(bounds, 5);

    bounds = { id: 'moved' };
    zoom = 9;
    act(() => { mock.events.moveend(); callback(); });
    expect(onChange).toHaveBeenLastCalledWith(bounds, 9);
    renderer.unmount();
  });
});
