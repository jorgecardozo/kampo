-- ============================================================
--  Campo Management — Migración: papelera + caravana opcional
--  Ejecutar en: Supabase → SQL Editor → New query → Run
--  Resuelve:
--   1) "column ... deleted_at does not exist" (agrega la columna a todas las tablas)
--   2) Hace la caravana OPCIONAL (los animales igual tienen su id propio)
--  Es idempotente: se puede correr varias veces sin problema.
-- ============================================================

-- 1) Columna deleted_at (soft delete / papelera) en todas las tablas.
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

-- 2) Caravana opcional: se quita el NOT NULL (el unique se mantiene, y en
--    Postgres varios NULL no rompen el unique).
alter table animales alter column caravana drop not null;
