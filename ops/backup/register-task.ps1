# ============================================================
# Daftarkan backup HARIAN ke Windows Task Scheduler.
# Menjalankan: node ops\backup\backup.mjs  (tiap hari 23:00 / 11 malam).
# Jalankan SEKALI:
#   powershell -ExecutionPolicy Bypass -File .\register-task.ps1
# ============================================================
$Root   = Split-Path -Parent $MyInvocation.MyCommand.Path
$Script = Join-Path $Root "backup.mjs"

# Cari node.exe (Task Scheduler butuh path absolut, bukan dari PATH sesi ini).
$node = (Get-Command node -ErrorAction SilentlyContinue).Source
if (-not $node) { Write-Error "node.exe tidak ketemu di PATH. Install Node / buka PowerShell baru."; exit 1 }

$action  = New-ScheduledTaskAction -Execute $node -Argument "`"$Script`"" -WorkingDirectory $Root
$trigger = New-ScheduledTaskTrigger -Daily -At 11:00pm
# StartWhenAvailable: kalau PC mati/tidur jam 23:00, backup dijalankan begitu PC nyala.
$settings = New-ScheduledTaskSettingsSet -StartWhenAvailable -RunOnlyIfNetworkAvailable

Register-ScheduledTask -TaskName "Supabase Backup Mobil1" `
  -Action $action -Trigger $trigger -Settings $settings -Force `
  -Description "Backup harian data Supabase Mobil1 (Node -> JSON) ke folder lokal, tiap 23:00."

Write-Host "OK. Task 'Supabase Backup Mobil1' terdaftar -> tiap hari 23:00."
Write-Host "Node: $node"
Write-Host "Jalankan sekarang: Start-ScheduledTask -TaskName 'Supabase Backup Mobil1'"
