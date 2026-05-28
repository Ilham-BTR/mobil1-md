# Mobil1 POSM Tracker

Aplikasi web full-stack untuk tracking pemasangan POSM (Point of Sale Materials) Mobil1 oleh Field MD.

**Stack:**
- Frontend: React 18 + Vite 5 + Tailwind CSS
- Database: PostgreSQL via Supabase
- Auth: Supabase Auth (email/password)
- Backend Logic: Supabase Edge Functions (Deno + TypeScript)
- Photo Storage: Backblaze B2 ($6/TB) + Cloudflare CDN (free egress)

---

## 🚀 Quick Start (Mock Mode — tanpa setup backend)

Cara tercepat untuk lihat app dulu, tanpa setup database:

```bash
npm install
npm run dev
```

Browser akan buka di `http://localhost:5173`. App jalan dengan **mock data** in-memory.

**Demo credentials:**
- MD: `budi@mobil1.id` / `mobil1`
- MD: `andi@mobil1.id` / `mobil1`
- Admin: `admin@mobil1.id` / `mobil1`

⚠️ Data akan hilang saat browser di-refresh. Untuk persistent storage, lanjut ke setup full stack di bawah.

---

## 🏗️ Full Stack Setup (Production)

### Step 1: Setup Supabase (15 menit)

1. **Daftar gratis di [supabase.com](https://supabase.com)** → New Project
   - Region: **Southeast Asia (Singapore)** untuk latency terbaik
   - Database password: simpan baik-baik
   - Tunggu ~2 menit project siap

2. **Jalankan schema database:**
   - Dashboard → SQL Editor → New Query
   - Copy seluruh isi `supabase/migrations/0001_schema.sql`
   - Paste → klik Run
   - Cek di Table Editor: harus ada tabel `profiles`, `regions`, `kotas`, `distributors`, `bengkels`, `visits`

3. **Buat user pertama:**
   - Authentication → Users → Add User → Create new user
   - Email: `admin@mobil1.id`, password bebas (min 6 karakter)
   - Setelah dibuat, buka Table Editor → `profiles` → edit row admin tadi
   - Set `role` = `admin`

4. **Ambil API credentials:**
   - Settings → API
   - Copy `Project URL` dan `anon public key`

### Step 2: Setup Backblaze B2 (10 menit)

1. **Daftar di [backblaze.com](https://backblaze.com)** → pilih "B2 Cloud Storage" (tanpa kartu kredit, 10GB free)

2. **Buat bucket:**
   - Buckets → Create a Bucket
   - Name: `mobil1-posm-photos` (harus unique global, tambah suffix kalau bentrok)
   - Files: **Public**
   - Encryption: Enable
   - Object Lock: Disable
   - Catat **bucket region & endpoint URL** (mis. `s3.us-west-004.backblazeb2.com`)

3. **Buat Application Key:**
   - App Keys → Add a New Application Key
   - Name: `mobil1-uploader`
   - Allow access to: hanya bucket tadi
   - Type: Read and Write
   - **⚠️ Simpan `keyID` dan `applicationKey`** — `applicationKey` hanya muncul SEKALI

### Step 3: Setup Cloudflare CDN untuk Free Egress (10 menit)

Tanpa step ini, egress B2 dikenakan $0.01/GB. Dengan Cloudflare, **gratis selamanya** via Bandwidth Alliance.

1. **Daftar [cloudflare.com](https://cloudflare.com)** → tambahkan domain Anda (atau beli baru ~$10/tahun)
2. DNS → Add record:
   - Type: `CNAME`
   - Name: `cdn` (akan jadi `cdn.domain-anda.com`)
   - Target: `f004.backblazeb2.com` (sesuaikan dengan region B2 — angka `004` itu region code)
   - Proxy: **ON (orange cloud ☁️)** — INI WAJIB supaya gratis egress
3. (Opsional) Rules → Transform Rules → URL Rewrite untuk menyembunyikan path bucket:
   - From: `/file/mobil1-posm-photos/*`
   - To: `/*`
4. (Opsional) Caching → Cache Rules → cache image 1 tahun

Test: buka `https://cdn.domain-anda.com/visits/test.jpg` harus jalan.

### Step 4: Deploy Edge Function

1. **Install Supabase CLI:**
   ```bash
   npm install -g supabase
   ```

2. **Login & link project:**
   ```bash
   supabase login
   supabase link --project-ref <PROJECT_REF>
   ```
   `PROJECT_REF` ada di URL dashboard: `https://supabase.com/dashboard/project/<PROJECT_REF>`

3. **Set environment variables:**
   ```bash
   supabase secrets set B2_KEY_ID=<keyID-dari-step-2>
   supabase secrets set B2_APPLICATION_KEY=<applicationKey-dari-step-2>
   supabase secrets set B2_BUCKET_NAME=mobil1-posm-photos
   supabase secrets set B2_ENDPOINT=https://s3.us-west-004.backblazeb2.com
   supabase secrets set B2_REGION=us-west-004
   supabase secrets set CDN_BASE_URL=https://cdn.domain-anda.com
   ```

4. **Deploy:**
   ```bash
   supabase functions deploy get-upload-url
   ```

### Step 5: Konfigurasi Frontend

1. **Copy template environment:**
   ```bash
   cp .env.example .env.local
   ```

2. **Edit `.env.local`:**
   ```env
   VITE_SUPABASE_URL=https://<project-ref>.supabase.co
   VITE_SUPABASE_ANON_KEY=<anon-key-dari-step-1>
   VITE_CDN_BASE_URL=https://cdn.domain-anda.com
   ```

3. **Run:**
   ```bash
   npm run dev
   ```

Banner kuning "Mode Demo" harusnya hilang — tandanya sudah production mode.

### Step 6: Deploy Frontend ke Cloudflare Pages

1. Push code ke GitHub
2. Cloudflare Dashboard → Workers & Pages → Create → Pages → Connect to Git
3. Build settings:
   - Framework: Vite
   - Build command: `npm run build`
   - Output directory: `dist`
4. Environment variables → tambah `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_CDN_BASE_URL`
5. Deploy → app live di `<project>.pages.dev` (gratis, unlimited bandwidth)

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
│       ├── supabase.js        # Supabase client singleton
│       ├── api.js             # Data access layer (CRUD + auth)
│       └── storage.js         # B2 upload helper
│
└── supabase/
    ├── config.toml
    ├── migrations/
    │   ├── 0000_reset.sql     # ⚠️ destructive: drop everything
    │   └── 0001_schema.sql    # Tables, RLS, triggers, seed data
    └── functions/
        └── get-upload-url/
            └── index.ts       # Edge Function: generate presigned B2 URL
```

---

## 💰 Estimasi Biaya Bulanan

| Tahap | Setup | Biaya/bulan |
|-------|-------|-------------|
| Demo / Dev | Mock mode, no backend | **Rp 0** |
| Start | Supabase Free + B2 Free (10GB) + Cloudflare Free | **Rp 0** |
| Growth (50-200 MD) | Supabase Pro ($25) + B2 ($6/TB) + Cloudflare | **~Rp 500k** |
| Scale (200+ MD) | Supabase Team + B2 + Cloudflare Pro | **~Rp 2 juta** |

---

## 🔐 Security Notes

- B2 application key **tidak pernah** kena client — hanya di Supabase Edge Function env vars
- Row Level Security aktif di semua tabel:
  - MD hanya bisa lihat visit miliknya sendiri
  - Admin/BP bisa lihat & kelola semua data
- Photo path di B2 include `userId` untuk audit trail
- Presigned URL expire dalam 15 menit
- Domain Cloudflare bisa diset Hotlink Protection biar URL foto tidak bisa di-leech

---

## 🧪 Testing

```bash
# Run dev server
npm run dev

# Build production bundle
npm run build

# Preview production build locally
npm run preview

# Test edge function locally
supabase functions serve get-upload-url --env-file .env.local
```

---

## ❓ Troubleshooting

**Banner "Mode Demo" tidak hilang setelah set .env.local**
→ Restart dev server (`Ctrl+C` lalu `npm run dev`). Vite hanya baca env saat startup.

**Login gagal: "Invalid email or password"**
→ Pastikan user sudah dibuat di Supabase Authentication AND profile row sudah ada (dibuat otomatis oleh trigger `handle_new_user`).

**Upload foto gagal: "Failed to get upload URL"**
→ Cek logs Edge Function di Supabase Dashboard → Edge Functions → get-upload-url → Logs. Biasanya env var belum di-set atau B2 key salah.

**Upload OK tapi foto tidak muncul**
→ CDN belum ter-setup. Cek: buka `https://cdn.domain-anda.com/<path>` langsung di browser. Kalau 404, masalah di Cloudflare DNS/Transform Rules.

**RLS error: "new row violates row-level security policy"**
→ Kemungkinan profile user belum dibuat. Cek table `profiles` apakah row untuk user tsb ada.
