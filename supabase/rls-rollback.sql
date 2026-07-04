-- ============================================================
--  Campo Management — Rollback RLS (volver a acceso abierto dev)
--  Usar SOLO si la Fase 2 te dejó afuera. Reabre todo a anon/authenticated.
--  (Vuelve al estado inseguro de desarrollo; después reintentás la Fase 2.)
-- ============================================================
do $$
declare t text;
begin
  foreach t in array array[
    'cuentas','campos','miembros','miembro_campos','plataforma_admins',
    'potreros','veterinarios','duenos','tipos_vacuna','categorias_gasto',
    'precios_por_kg','ventas','venta_animales','campanias','animales','vacunaciones','gastos'
  ]
  loop
    -- borrar políticas específicas de la Fase 2
    execute format('drop policy if exists "%s_sel" on %I;', t, t);
    execute format('drop policy if exists "%s_ins" on %I;', t, t);
    execute format('drop policy if exists "%s_upd" on %I;', t, t);
    execute format('drop policy if exists "%s_del" on %I;', t, t);
    execute format('drop policy if exists "%s_mod" on %I;', t, t);
    execute format('drop policy if exists "cuentas_mod" on %I;', t);
    execute format('drop policy if exists "miembros_mod" on %I;', t);
    execute format('drop policy if exists "pa_sel" on %I;', t);
    execute format('drop policy if exists "pa_mod" on %I;', t);
    -- reabrir
    execute format('drop policy if exists "dev_all" on %I;', t);
    execute format('create policy "dev_all" on %I for all to anon, authenticated using (true) with check (true);', t);
  end loop;
end $$;
