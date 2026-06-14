# Mobil1 POSM Tracker

Aplikasi web full-stack untuk tracking pemasangan POSM (Point of Sale Materials) Mobil1 oleh Field MD.

**Stack:**
- Frontend: React 18 + Vite 5 + Tailwind CSS
- Database: PostgreSQL via Supabase
- Auth: Supabase Auth (email/password)
- Photo Storage: **Supabase Storage** (bucket `visit-photos`, publik)
- Backend Logic: Supabase Edge Functions (Deno) — `admin-create-md`, `webauthn`

> **Catatan storage:** versi awal app ini sempat dirancang memakai Backblaze B2 + Cloudflare CDN.
> Implementasi sekarang **sepenuhnya memakai Supabase Storage** (lihat `src/lib/storage.js`).
> Folder `supabase/functions/get-upload-url` adalah peninggalan rancangan B2 dan **tidak dipakai lagi**.

---

## 🚀 Quick Start (Mock Mode — tanpa setup backend)

Cara tercepat untuk lihat app dulu, tanpa setup database:

```bash
npm install
npm run dev
```

Browser akan buka di `http://localhost:5173`. App jalan dengan **mock data** in-memory (foto disimpan di IndexedDB browser).

**Demo credentials:**
- MD: `budi@mobil1.id` / `mobil1`
- MD: `andi@mobil1.id` / `mobil1`
- Admin: `admin@mobil1.id` / `mobil1`

⚠️ Data hanya tersimpan di browser ini. Untuk persistent storage multi-device, lanjut ke setup full stack di bawah.

---

## 🏗️ Full Stack Setup (Production)

Cukup **3 langkah**: setup Supabase (database + storage), konfigurasi frontend, deploy.

### Step 1: Setup Supabase (database + storage)

1. **Daftar gratis di [supabase.com](https://supabase.com)** → New Project
   - Region: **Southeast Asia (Singapore)** untuk latency terbaik
   - Database password: simpan baik-baik
   - Tunggu ~2 menit project siap

2. **Jalankan schema database:**
   - Dashboard → SQL Editor → New Query
   - Copy seluruh isi `supabase/setup_fresh.sql` → paste → Run
   - Cek di Table Editor: harus ada tabel `profiles`, `regions`, `kotas`, `distributors`, `bengkels`, `visits`, `attendances`
   - (Migrasi individual ada di `supabase/migrations/` bila perlu ditelusuri per perubahan.)

3. **Setup bucket foto (Supabase Storage):**
   - SQL Editor → New Query
   - Copy seluruh isi `supabase/storage_setup.sql` → paste → Run
   - Ini membuat bucket publik `visit-photos` + policy: publik boleh baca, user login boleh upload.
   - Cek di Storage: bucket `visit-photos` muncul dan bertanda **Public**.

4. **Buat user pertama (admin):**
   - Authentication → Users → Add User → Create new user
   - Email: `admin@mobil1.id`, password bebas (min 6 karakter)
   - Profile row dibuat otomatis oleh trigger `handle_new_user`. Buka Table Editor → `profiles` → set `role` = `admin`.

5. **Ambil API credentials:**
   - Settings → API → copy `Project URL` dan `anon public key`

### Step 2: Konfigurasi Frontend

1. **Copy template environment:**
   ```bash
   cp .env.example .env.local
   ```

2. **Edit `.env.local`:**
   ```env
   VITE_SUPABASE_URL=https://<project-ref>.supabase.co
   VITE_SUPABASE_ANON_KEY=<anon-key-dari-step-1>
   ```

3. **Run:**
   ```bash
   npm run dev
   ```

Banner kuning "Mode Demo" harusnya hilang — tandanya sudah production mode.

### Step 3: Deploy Frontend (Cloudflare Pages / Vercel)

App ini static build (Vite), bisa di-deploy ke mana saja. Contoh Cloudflare Pages:

1. Push code ke GitHub
2. Cloudflare Dashboard → Workers & Pages → Create → Pages → Connect to Git
3. Build settings:
   - Framework: Vite
   - Build command: `npm run build`
   - Output directory: `dist`
4. Environment variables → tambah `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY`
5. Deploy → app live (gratis, unlimited bandwidth)

> (Repo juga punya `vercel.json` — deploy ke Vercel sama mudahnya: import repo, set 2 env var di atas.)

#### (Opsional) Deploy Edge Function

Fitur `admin-create-md` (admin bikin akun MD) dan `webauthn` (passkey, default disembunyikan) memakai Edge Function:

```bash
npm install -g supabase
supabase login
supabase link --project-ref <PROJECT_REF>
supabase functions deploy admin-create-md
supabase functions deploy webauthn
```

`PROJECT_REF` ada di URL dashboard: `https://supabase.com/dashboard/project/<PROJECT_REF>`.

---

## 📁 Struktur Project

```
mobil1-posm/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── .env.example
│
├── src/
│   ├── main.jsx
│   ├── App.jsx                # Semua UI components
│   ├── index.css
│   └── lib/
│       ├── supabase.js        # Supabase client singleton + MOCK_MODE
│       ├── api.js             # Data access layer (CRUD + auth)
│       ├── storage.js         # Upload foto → Supabase Storage (mock: IndexedDB)
│       ├── photoStore.js      # Helper IndexedDB untuk mock mode
│       └── seedData.js        # Seed bengkel untuk mock mode
│
└── supabase/
    ├── config.toml
    ├── setup_fresh.sql        # Schema lengkap (jalankan sekali di project baru)
    ├── storage_setup.sql      # Bucket `visit-photos` + policy
    ├── supabase_seed.sql      # Seed data opsional
    ├── migrations/            # Riwayat perubahan schema per langkah (0001..0008)
    └── functions/
        ├── admin-create-md/   # Edge Function: admin bikin akun MD
        ├── webauthn/          # Edge Function: passkey (default disembunyikan)
        └── get-upload-url/    # ⚠️ LEGACY (rancangan B2) — tidak dipakai
```

---

## 💰 Estimasi Biaya Bulanan

| Tahap | Setup | Biaya/bulan |
|-------|-------|-------------|
| Demo / Dev | Mock mode, no backend | **Rp 0** |
| Start | Supabase Free (DB 500MB + Storage 1GB) | **Rp 0** |
| Growth (50-200 MD) | Supabase Pro ($25, sudah termasuk 100GB storage + 250GB egress) | **~Rp 400k** |
| Scale (200+ MD) | Supabase Pro + tambahan storage/egress sesuai pemakaian | **menyesuaikan** |

> Foto ~1,4 MB/kunjungan (7 foto terkompres). 100GB ≈ ~70.000 kunjungan, jadi kuota Pro cukup untuk waktu lama.
> Bila volume foto menembus ratusan GB–TB, baru pertimbangkan storage eksternal murah (mis. Backblaze B2 + Cloudflare CDN untuk egress gratis).

---

## 🔐 Security Notes

- **Row Level Security aktif di semua tabel:**
  - MD hanya bisa lihat visit & absen miliknya sendiri
  - Admin/BP bisa lihat & kelola semua data
- Bucket `visit-photos` publik untuk **baca** (tampil foto), tapi **upload/update/delete** hanya untuk user login (policy di `storage_setup.sql`).
- Path foto memuat `visitId` / `mdId` untuk audit trail.
- `anon key` aman dipakai di client — keamanan ditegakkan oleh RLS, bukan dengan menyembunyikan key.

---

## 🧪 Testing

```bash
# Run dev server
npm run dev

# Build production bundle
npm run build

# Preview production build locally
npm run preview

# Test edge function locally (mis. admin-create-md)
supabase functions serve admin-create-md --env-file .env.local
```

---

## ❓ Troubleshooting

**Banner "Mode Demo" tidak hilang setelah set .env.local**
→ Restart dev server (`Ctrl+C` lalu `npm run dev`). Vite hanya baca env saat startup.

**Login gagal: "Invalid email or password"**
→ Pastikan user sudah dibuat di Supabase Authentication. Profile row dibuat otomatis oleh trigger `handle_new_user`.

**Upload foto gagal**
→ Pastikan `supabase/storage_setup.sql` sudah dijalankan (bucket `visit-photos` ada + policy upload). Cek juga user dalam keadaan login.

**Upload OK tapi foto tidak muncul**
→ Pastikan bucket `visit-photos` bertanda **Public** (policy `visit_photos_public_read`). Coba buka public URL foto langsung di browser.

**RLS error: "new row violates row-level security policy"**
→ Kemungkinan profile user belum dibuat. Cek table `profiles` apakah row untuk user tsb ada.
