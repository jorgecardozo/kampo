-- ============================================================
--  Campo Management — Venta de ganado (animales por venta)
--  Ejecutar en: Supabase → SQL Editor → New query → Run
--
--  Guarda qué animales se vendieron en cada venta, con su peso y precio/kg.
--  Al vender, el animal pasa a estado 'Vendido' (lo hace la app).
-- ============================================================

create table if not exists venta_animales (
  id          uuid primary key default gen_random_uuid(),
  venta_id    uuid not null references ventas(id)   on delete cascade,
  animal_id   uuid not null references animales(id) on delete restrict,
  peso_kg     numeric default 0,
  precio_kg   numeric default 0,
  subtotal    numeric default 0,
  created_at  timestamptz default now()
);

create index if not exists idx_venta_animales_venta  on venta_animales(venta_id);
create index if not exists idx_venta_animales_animal on venta_animales(animal_id);

-- RLS para desarrollo (acceso a la anon key; la app igual está detrás de Auth0).
alter table venta_animales enable row level security;
drop policy if exists "dev_all" on venta_animales;
create policy "dev_all" on venta_animales for all to anon, authenticated using (true) with check (true);
