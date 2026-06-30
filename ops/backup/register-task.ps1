# ============================================================
# Daftarkan backup MINGGUAN ke Windows Task Scheduler.
# Jalankan SEKALI (klik kanan -> Run with PowerShell, atau):
#   powershell -ExecutionPolicy Bypass -File .\register-task.ps1
# Default: tiap Senin 02:00. Docker Desktop harus jalan saat itu
# (set Docker Desktop agar "Start when you log in").
# ============================================================
$Root   = Split-Path -Parent $MyInvocation.MyCommand.Path
$Script = Join-Path $Root "supabase-backup.ps1"

$action  = New-ScheduledTaskAction -Execute "powershell.exe" `
  -Argument "-NoProfile -ExecutionPolicy Bypass -File `"$Script`""
$trigger = New-ScheduledTaskTrigger -Weekly -DaysOfWeek Monday -At 2:00am
$settings = New-ScheduledTaskSettingsSet -StartWhenAvailable -RunOnlyIfNetworkAvailable

Register-ScheduledTask -TaskName "Supabase Backup Mobil1" `
  -Action $action -Trigger $trigger -Settings $settings -Force `
  -Description "Backup mingguan schema public DB Supabase Mobil1 ke folder lokal (pg_dump via Docker)."

Write-Host "OK. Task 'Supabase Backup Mobil1' terdaftar -> tiap Senin 02:00."
Write-Host "Cek di Task Scheduler, atau jalankan manual: Start-ScheduledTask -TaskName 'Supabase Backup Mobil1'"
