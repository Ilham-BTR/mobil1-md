import React, { useEffect, useRef } from 'react';
import { useMap, useMapEvents } from 'react-leaflet';

export default function CoverageViewport({ onChange }) {
  const map = useMap();
  const frameRef = useRef(null);
  const callbackRef = useRef(onChange);
  callbackRef.current = onChange;
  const scheduleUpdate = () => {
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(() => callbackRef.current(map.getBounds(), map.getZoom()));
  };

  useMapEvents({ moveend: scheduleUpdate, zoomend: scheduleUpdate });
  useEffect(() => {
    scheduleUpdate();
    return () => { if (frameRef.current) cancelAnimationFrame(frameRef.current); };
  }, [map]);

  return null;
}
