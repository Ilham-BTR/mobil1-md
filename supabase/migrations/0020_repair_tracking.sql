-- ============================================================
-- Migration 0020 — Perbaikan tracking migrasi (insiden reset 31/08/2026).
-- Tabel inti pernah di-drop lalu di-rebuild dari 0001, tapi tracking
-- (baseline) menandai 0006-0019 "sudah diterapkan" padahal tidak.
-- Hapus tanda palsu HANYA jika rebuild terdeteksi (kolom sub_type belum ada),
-- supaya file ini no-op di DB yang sehat.
-- ============================================================
do $$
begin
  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'visits' and column_name = 'sub_type'
  ) then
    delete from migrations.applied
    where name in (
      '0006_status_two_level.sql', '0007_webauthn.sql', '0008_attendance.sql',
      '0009_super_admin_md_password.sql', '0010_tl_role.sql',
      '0011_account_visibility.sql', '0012_visit_photos_gimmick_planogram.sql',
      '0013_super_admin_only_delete.sql', '0014_tl_multi_region.sql',
      '0015_laporan_views.sql', '0016_spanduk_poster_putih.sql',
      '0017_visit_list_lean.sql', '0018_egress_log.sql',
      '0019_unique_visit_per_day.sql'
    );
    raise notice 'REPAIR: tanda palsu 0006-0019 dihapus, migrasi akan dijalankan ulang.';
  else
    raise notice 'DB sehat (sub_type ada) — repair dilewati.';
  end if;
end $$;
