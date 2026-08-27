-- ============================================================
-- Migration 0017 — View visit_list (LEAN, penekan egress)
-- Daftar visit TANPA 11 kolom URL foto (dominasi ukuran baris):
--   terukur 27 Agu 2026: full 829KB gz / 7.4MB raw per load (4717 rows)
--   -> lean 597KB gz / 3.3MB raw (-28% gz, -55% raw).
-- photo_count menggantikan hitung-foto di client.
-- visit_details TETAP ADA untuk detail modal, edit, dan export
-- (ditarik hanya saat dibutuhkan, bukan tiap load daftar).
-- ============================================================
drop view if exists visit_list;
create view visit_list as
select
  v.id, v.md_id, v.bengkel_id, v.distributor_id, v.visit_date,
  v.pic_name, v.pic_phone, v.status, v.sub_type, v.remarks,
  v.visit_lat, v.visit_lng, v.created_at, v.updated_at,
  (
    (v.photo_tampak_depan     is not null)::int + (v.photo_in             is not null)::int +
    (v.photo_out              is not null)::int + (v.photo_spanduk_before is not null)::int +
    (v.photo_spanduk_putih    is not null)::int + (v.photo_spanduk_after  is not null)::int +
    (v.photo_poster_before    is not null)::int + (v.photo_poster_putih   is not null)::int +
    (v.photo_poster_after     is not null)::int + (v.photo_delivery_gimmick is not null)::int +
    (v.photo_deploy_planogram is not null)::int
  ) as photo_count,
  p.full_name as md_name, p.email as md_email,
  b.code as bengkel_code, b.name as bengkel_name,
  k.name as kota_name, r.name as region_name, d.name as distributor_name
from visits v
join profiles p        on p.id = v.md_id
join bengkels b        on b.id = v.bengkel_id
join kotas k           on k.id = b.kota_id
join regions r         on r.id = k.region_id
left join distributors d on d.id = v.distributor_id;
