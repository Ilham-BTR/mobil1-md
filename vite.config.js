import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import basicSsl from '@vitejs/plugin-basic-ssl';

// ID build unik per deploy — dipakai deteksi "bundle baru" (auto-reload client
// lama supaya perilaku boros egress versi lama mati begitu versi baru rilis).
const BUILD_ID = Date.now().toString(36);

export default defineConfig({
  plugins: [
    react(),
    basicSsl(),  // self-signed HTTPS cert — biar GPS jalan di HP (geolocation butuh secure context)
    {
      // Tulis dist/version.json berisi BUILD_ID yang sama dengan __BUILD_ID__
      name: 'emit-version-json',
      apply: 'build',
      generateBundle() {
        this.emitFile({ type: 'asset', fileName: 'version.json', source: JSON.stringify({ build: BUILD_ID }) });
      },
    },
  ],
  define: {
    __BUILD_ID__: JSON.stringify(BUILD_ID),
  },
  server: {
    port: 5173,
    open: true,
    host: true  // expose ke network — bisa diakses dari HP di WiFi yang sama
  }
});
