-- ============================================================
-- Migration 0012 — Tambah foto Delivery Gimmick & Deploy Planogram
-- ============================================================
alter table visits add column if not exists photo_delivery_gimmick text;
alter table visits add column if not exists photo_deploy_planogram text;
