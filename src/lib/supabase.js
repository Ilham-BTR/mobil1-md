// src/lib/supabase.js
import { createClient } from '@supabase/supabase-js';
import { countCall, attachEgressMeter } from './egressMeter';

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Mock mode kalau .env belum diset — biar app tetap jalan dengan demo data
export const MOCK_MODE = !url || !anonKey || url.includes('your-project');

export const supabase = MOCK_MODE
  ? null
  : createClient(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
      global: {
        // Hitung tiap panggilan nyata per-endpoint (tracking egress) lalu
        // teruskan ke fetch asli — zero perubahan perilaku request.
        fetch: (input, init) => {
          countCall(typeof input === 'string' ? input : input?.url || '');
          return fetch(input, init);
        },
      },
    });

if (!MOCK_MODE) attachEgressMeter(supabase);

if (MOCK_MODE) {
  console.warn(
    '🟡 Supabase mock mode — app pakai data dummy.\n' +
    'Set VITE_SUPABASE_URL & VITE_SUPABASE_ANON_KEY di .env.local untuk mode produksi.'
  );
}
