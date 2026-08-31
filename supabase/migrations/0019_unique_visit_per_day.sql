-- 0019: 1 MD maksimal 1 visit per bengkel per hari (auto-migration).
-- Catatan: kalau sudah ada data duplikat lama, CREATE UNIQUE INDEX gagal.
-- Cek dulu (jalankan manual di SQL Editor sebelum migrasi ini):
--   select md_id, bengkel_id, visit_date, count(*)
--   from visits group by 1,2,3 having count(*) > 1;

create unique index if not exists visits_md_bengkel_date_uidx
  on visits(md_id, bengkel_id, visit_date);
