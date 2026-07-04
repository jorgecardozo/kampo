-- ============================================================
--  Campo Management — Soft delete (borrado lógico)
--  Ejecutar en: Supabase → SQL Editor → New query → Run
--
--  Agrega `deleted_at` a las tablas. NULL = activo; con fecha = archivado.
--  Las listas filtran `deleted_at is null`; la Papelera muestra los archivados.
--  Nada se borra físicamente (las relaciones se mantienen intactas) salvo el
--  "Eliminar definitivo" desde la Papelera.
-- ============================================================

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
