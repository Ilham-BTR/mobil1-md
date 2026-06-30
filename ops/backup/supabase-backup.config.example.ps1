# ============================================================
# Copy file ini jadi  supabase-backup.config.ps1  (tanpa .example) lalu isi.
# File asli (tanpa .example) SUDAH di-gitignore — JANGAN commit yang berisi password.
# ============================================================

# Connection string SESSION POOLER. Ambil dari:
#   Supabase Dashboard -> Project Settings -> Database
#   -> "Connection string" -> tab "Session pooler"
# Bentuknya (PORT 5432, bukan 6543):
#   postgresql://postgres.<project-ref>:<PASSWORD>@aws-0-<region>.pooler.supabase.com:5432/postgres
# Ganti <PASSWORD> dengan Database Password project (yang diset saat buat project;
# bisa di-reset di Settings -> Database -> "Reset database password" kalau lupa).
$DbUrl = "postgresql://postgres.mybrstcvmobourhzkrlp:GANTI_PASSWORD@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres"

# Berapa banyak file backup terakhir yang disimpan (sisanya dihapus otomatis).
# 12 = ~3 bulan kalau backup mingguan.
$KeepLast = 12

# (Opsional) Simpan backup ke folder lain — mis. folder yang disinkron ke
# Google Drive / OneDrive supaya ada salinan OFF-SITE otomatis.
# Kosongkan ("") = simpan di subfolder .\dumps di samping script ini.
$BackupDir = ""
