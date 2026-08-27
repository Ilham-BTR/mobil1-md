-- ============================================================
-- Migration 0018 — Tracking egress live (hitung panggilan nyata per-endpoint)
-- Client menghitung panggilan PostgREST per endpoint, flush batch saat tab
-- disembunyikan via RPC log_egress (upsert per hari+user+endpoint).
-- Analisis: node ops/egress/measure.mjs --live (kalikan calls x ukuran terukur).
-- ============================================================
create table if not exists egress_log (
  day        date        not null,
  client_id  uuid        not null,
  endpoint   text        not null,
  calls      integer     not null default 0,
  updated_at timestamptz not null default now(),
  primary key (day, client_id, endpoint)
);

alter table egress_log enable row level security;

-- Baca: admin saja (dashboard/analisis). Tulis: HANYA lewat RPC (security definer).
drop policy if exists egress_admin_select on egress_log;
create policy egress_admin_select on egress_log for select using (is_admin());

create or replace function log_egress(p_rows jsonb)
returns void language plpgsql security definer as $$
declare r jsonb;
begin
  if auth.uid() is null then return; end if;
  for r in select * from jsonb_array_elements(p_rows) loop
    insert into egress_log(day, client_id, endpoint, calls)
    values (current_date, auth.uid(), left(r->>'endpoint', 120), coalesce((r->>'calls')::int, 0))
    on conflict (day, client_id, endpoint)
    do update set calls = egress_log.calls + excluded.calls, updated_at = now();
  end loop;
end $$;

grant execute on function log_egress(jsonb) to authenticated;
