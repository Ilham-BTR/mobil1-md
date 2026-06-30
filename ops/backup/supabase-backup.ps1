# ============================================================
# Backup database Supabase (schema `public`) -> file .dump lokal
# pg_dump versi 17 dijalankan via Docker (image postgres:17),
# jadi TIDAK perlu install PostgreSQL client di Windows.
#
# Jalankan manual:  powershell -ExecutionPolicy Bypass -File .\supabase-backup.ps1
# Jadwal otomatis:  lihat register-task.ps1 / README.md
# Syarat: Docker Desktop harus JALAN saat script ini dieksekusi.
# ============================================================
$ErrorActionPreference = "Stop"

$Root = Split-Path -Parent $MyInvocation.MyCommand.Path
$Cfg  = Join-Path $Root "supabase-backup.config.ps1"

if (-not (Test-Path $Cfg)) {
  Write-Error "Config belum ada. Copy 'supabase-backup.config.example.ps1' -> 'supabase-backup.config.ps1' lalu isi `$DbUrl."
  exit 1
}
. $Cfg

if ([string]::IsNullOrWhiteSpace($DbUrl) -or $DbUrl -match "GANTI_PASSWORD") {
  Write-Error "`$DbUrl belum diisi di supabase-backup.config.ps1."
  exit 1
}
if (-not $KeepLast) { $KeepLast = 12 }

# Folder output: pakai $BackupDir kalau diisi (mis. folder Google Drive/OneDrive
# yang disinkron -> salinan off-site otomatis), kalau kosong pakai .\dumps
$DumpDir = if ($BackupDir) { $BackupDir } else { Join-Path $Root "dumps" }
if (-not (Test-Path $DumpDir)) { New-Item -ItemType Directory -Path $DumpDir -Force | Out-Null }

$LogFile = Join-Path $Root "backup.log"
function Log($msg) {
  $line = "[{0}] {1}" -f (Get-Date -Format "yyyy-MM-dd HH:mm:ss"), $msg
  Add-Content -Path $LogFile -Value $line -Encoding utf8
  Write-Host $line
}

# Pastikan Docker engine hidup
docker info *> $null
if ($LASTEXITCODE -ne 0) {
  Log "GAGAL: Docker engine tidak jalan. Nyalakan Docker Desktop dulu."
  exit 1
}

$ts   = Get-Date -Format "yyyy-MM-dd_HHmmss"
$name = "supabase_public_$ts.dump"
Log "Mulai backup -> $name"

# pg_dump menulis LANGSUNG ke folder yang di-mount (-f), bukan lewat stdout
# PowerShell, supaya file biner .dump tidak korup karena encoding.
docker run --rm -v "${DumpDir}:/backup" postgres:17 `
  pg_dump "$DbUrl" -Fc -n public --no-owner --no-privileges -f "/backup/$name"

if ($LASTEXITCODE -ne 0) {
  Log "GAGAL: pg_dump exit code $LASTEXITCODE. Backup lama TIDAK dihapus."
  exit 1
}

$file = Join-Path $DumpDir $name
if (-not (Test-Path $file)) {
  Log "GAGAL: file backup tidak terbentuk. Backup lama TIDAK dihapus."
  exit 1
}
$size = (Get-Item $file).Length
if ($size -lt 1024) {
  Log "GAGAL: file backup terlalu kecil ($size byte) — kemungkinan error. Backup lama TIDAK dihapus."
  exit 1
}
Log ("OK: {0} ({1:N2} MB)" -f $name, ($size / 1MB))

# Rotasi: simpan $KeepLast file terbaru, sisanya dihapus.
$all = Get-ChildItem $DumpDir -Filter "supabase_public_*.dump" | Sort-Object LastWriteTime -Descending
if ($all.Count -gt $KeepLast) {
  $all | Select-Object -Skip $KeepLast | ForEach-Object {
    Remove-Item $_.FullName -Force
    Log "Hapus backup lama: $($_.Name)"
  }
}
Log "Selesai. File backup tersimpan: $([Math]::Min($all.Count, $KeepLast)) (maks $KeepLast)."
