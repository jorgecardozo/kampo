-- ============================================================
--  Campo Management — Migración pendiente (TODO junto)
--  Ejecutar UNA VEZ en: Supabase → SQL Editor → New query → Run
--  Incluye:
--   1) Papelera: columna deleted_at en todas las tablas
--   2) Caravana opcional (los animales igual tienen su id propio)
--   3) Venta de ganado: tabla venta_animales
--  Es idempotente: se puede correr varias veces sin romper nada.
-- ============================================================

-- 1) Papelera / soft delete ---------------------------------------------------
do $$
declare t text;
begin
  foreach t in array array[
    'potreros','veterinarios','duenos','tipos_vacuna','categorias_gasto',
    'ventas','campanias','animales','vacunaciones','gastos'
  ]
  loop
    execute format('alter table %I add column if not exists deleted_at timestamptz;', t);
    execute format('create index if not exists idx_%s_deleted_at on %I(deleted_at);', t, t);
  end loop;
end $$;

-- 2) Caravana opcional --------------------------------------------------------
alter table animales alter column caravana drop not null;

-- 3) Venta de ganado (animales por venta) -------------------------------------
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

alter table venta_animales enable row level security;
drop policy if exists "dev_all" on venta_animales;
create policy "dev_all" on venta_animales for all to anon, authenticated using (true) with check (true);
