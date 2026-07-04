-- ============================================================
--  Campo Management — RLS para DESARROLLO
--  Ejecutar en: Supabase → SQL Editor → New query → Run
--
--  Abre lectura/escritura al rol `anon` (la anon key del front).
--  La app igual está protegida por el login de Auth0, así que en la
--  práctica solo entran usuarios logueados. Más adelante se reemplaza
--  por políticas reales (Auth0 ↔ Supabase) — ver supabase/schema.sql.
-- ============================================================

do $$
declare t text;
begin
  foreach t in array array[
    'potreros','veterinarios','duenos','tipos_vacuna','categorias_gasto',
    'precios_por_kg','ventas','campanias','animales','vacunaciones','gastos'
  ]
  loop
    execute format('alter table %I enable row level security;', t);
    execute format('drop policy if exists "auth_all" on %I;', t);
    execute format('drop policy if exists "dev_all" on %I;', t);
    execute format($f$
      create policy "dev_all" on %I
        for all
        to anon, authenticated
        using (true)
        with check (true);
    $f$, t);
  end loop;
end $$;
