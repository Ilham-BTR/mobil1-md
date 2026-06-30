# Backup Otomatis Database Supabase

Backup mingguan schema `public` (semua data app: profiles, regions, kotas, bengkels,
visits, attendances, tl_regions, distributors) ke file `.dump` di komputermu —
**gratis**, menutup kelemahan utama Supabase Free (tidak ada backup otomatis).

`pg_dump` dijalankan lewat **Docker** (image `postgres:17`), jadi **tidak perlu install
PostgreSQL** di Windows dan versinya dijamin cocok dengan Supabase (PG17).

> **Cakupan:** schema `public` = seluruh data bisnis. Akun login (`auth.users`) tidak
> ikut (schema bawaan Supabase, restore-nya berisiko), tapi tetap bisa dibuat ulang
> dari tabel `profiles` (menyimpan email + login_password). Untuk pemulihan data
> lapangan, dump `public` ini sudah cukup.

## Syarat
- **Docker Desktop** terinstall & **JALAN** saat backup dieksekusi.
  (Setel Docker Desktop: Settings → General → ✅ *Start Docker Desktop when you log in*.)
- Koneksi internet.

## Setup (sekali)

1. **Isi konfigurasi:**
   ```powershell
   cd ops\backup
   Copy-Item supabase-backup.config.example.ps1 supabase-backup.config.ps1
   ```
   Buka `supabase-backup.config.ps1`, isi `$DbUrl` dengan **Session pooler** string dari
   Supabase Dashboard → Project Settings → Database → Connection string → tab **Session pooler**
   (port **5432**), ganti `<PASSWORD>` dengan Database Password project.
   File ini **sudah di-gitignore** — aman, tidak akan ke-commit.

   > (Opsional) Set `$BackupDir` ke folder yang disinkron Google Drive/OneDrive
   > supaya backup otomatis punya salinan **off-site**.

2. **Tes manual** (pastikan Docker Desktop jalan):
   ```powershell
   powershell -ExecutionPolicy Bypass -File .\supabase-backup.ps1
   ```
   Pertama kali akan menarik image `postgres:17` (~sekali, lalu ke-cache).
   Berhasil → muncul file di `ops\backup\dumps\supabase_public_<tanggal>.dump`
   dan baris `OK: ...` di layar + `backup.log`.

3. **Aktifkan jadwal mingguan** (Senin 02:00):
   ```powershell
   powershell -ExecutionPolicy Bypass -File .\register-task.ps1
   ```
   Ubah hari/jam? Edit baris `New-ScheduledTaskTrigger` di `register-task.ps1`,
   lalu jalankan lagi (pakai `-Force`, jadi menimpa task lama).

## Memulihkan (restore) dari backup

Restore ke project Supabase (atau Postgres mana pun), via Docker juga:

```powershell
# Ganti <DbUrl> dengan connection string tujuan, dan <file.dump> nama backupnya.
docker run --rm -v "${PWD}\dumps:/backup" postgres:17 `
  pg_restore --clean --if-exists --no-owner --no-privileges `
  -d "<DbUrl>" "/backup/<file.dump>"
```

> `--clean --if-exists` = hapus objek lama sebelum buat ulang (restore ke DB yang
> sudah ada isinya). Untuk DB kosong, flag itu boleh dibuang.

## Cek & perawatan
- **Log:** `ops\backup\backup.log` (tiap run dicatat: OK / GAGAL + ukuran).
- **Hasil:** `ops\backup\dumps\` — otomatis menyimpan `$KeepLast` file terbaru (default 12).
- **Lihat status task:** `Get-ScheduledTask -TaskName "Supabase Backup Mobil1"`
- **Jalankan task sekarang:** `Start-ScheduledTask -TaskName "Supabase Backup Mobil1"`
- **Hapus jadwal:** `Unregister-ScheduledTask -TaskName "Supabase Backup Mobil1" -Confirm:$false`

## Catatan
- File `supabase-backup.config.ps1` (berisi password) dan folder `dumps/` + `backup.log`
  **tidak** ikut ke Git (lihat `.gitignore`). Yang di-repo cuma script + contoh config.
- Kalau lupa Database Password: Supabase Dashboard → Settings → Database →
  **Reset database password** (lalu update `$DbUrl`).
