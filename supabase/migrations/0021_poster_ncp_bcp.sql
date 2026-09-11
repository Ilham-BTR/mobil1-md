-- ============================================================
-- Migration 0021 — 2 kolom foto baru: Poster NCP & Poster Brand Campaign & Product
-- Opsional (seperti poster putih). View yang menghitung jumlah foto ikut dibuat ulang.
-- ============================================================
alter table visits add column if not exists photo_poster_ncp text;
alter table visits add column if not exists photo_poster_bcp text;

-- visit_details pakai v.* -> DROP+CREATE supaya 2 kolom baru ikut.
drop view if exists visit_details;
create view visit_details as
select v.*, p.full_name as md_name, p.email as md_email,
  b.code as bengkel_code, b.name as bengkel_name,
  k.name as kota_name, r.name as region_name, d.name as distributor_name
from visits v
join profiles p on p.id = v.md_id
join bengkels b on b.id = v.bengkel_id
join kotas k on k.id = b.kota_id
join regions r on r.id = k.region_id
left join distributors d on d.id = v.distributor_id;

-- visit_list: photo_count jadi menghitung 13 jenis foto.
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
    (v.photo_poster_after     is not null)::int + (v.photo_poster_ncp     is not null)::int +
    (v.photo_poster_bcp       is not null)::int + (v.photo_delivery_gimmick is not null)::int +
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

-- laporan_visit (Excel): jumlah_foto juga 13 jenis.
drop view if exists laporan_visit;
create view laporan_visit as
select
  to_char(v.visit_date, 'DD/MM/YYYY')        as tanggal,
  to_char(v.created_at at time zone 'Asia/Jakarta', 'DD/MM/YYYY HH24:MI') as waktu_submit,
  p.full_name                                as md,
  r.name                                     as region,
  k.name                                     as kota,
  b.code                                     as bengkel_kode,
  b.name                                     as bengkel_nama,
  b.address                                  as bengkel_alamat,
  d.name                                     as distributor,
  v.status                                   as status,
  v.sub_type                                 as sub_tipe,
  v.pic_name                                 as pic,
  v.pic_phone                                as no_telpon,
  v.remarks                                  as catatan,
  (
    (v.photo_tampak_depan     is not null)::int + (v.photo_in             is not null)::int +
    (v.photo_out              is not null)::int + (v.photo_spanduk_before is not null)::int +
    (v.photo_spanduk_putih    is not null)::int + (v.photo_spanduk_after  is not null)::int +
    (v.photo_poster_before    is not null)::int + (v.photo_poster_putih   is not null)::int +
    (v.photo_poster_after     is not null)::int + (v.photo_poster_ncp     is not null)::int +
    (v.photo_poster_bcp       is not null)::int + (v.photo_delivery_gimmick is not null)::int +
    (v.photo_deploy_planogram is not null)::int
  )                                          as jumlah_foto,
  v.visit_lat                                as gps_lat,
  v.visit_lng                                as gps_lng,
  b.lat                                      as bengkel_lat,
  b.lng                                      as bengkel_lng,
  case
    when v.visit_lat is not null and v.visit_lng is not null and b.lat is not null and b.lng is not null then
      round((6371000 * acos(greatest(-1, least(1,
        cos(radians(v.visit_lat)) * cos(radians(b.lat)) * cos(radians(b.lng) - radians(v.visit_lng))
        + sin(radians(v.visit_lat)) * sin(radians(b.lat))
      ))))::numeric)
  end                                        as jarak_ke_bengkel_m,
  v.id                                       as visit_id
from visits v
join profiles p        on p.id = v.md_id
join bengkels b        on b.id = v.bengkel_id
join kotas k           on k.id = b.kota_id
join regions r         on r.id = k.region_id
left join distributors d on d.id = v.distributor_id;
