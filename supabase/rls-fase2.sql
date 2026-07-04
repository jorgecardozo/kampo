-- ============================================================
--  Campo Management — RLS Fase 2 (seguridad real multi-tenant)
--  Ejecutar SOLO después de verificar que el token de Auth0 llega a Supabase.
--  Cada usuario ve/edita solo su CUENTA, según su ROL. Reemplaza dev_all.
--  Si algo sale mal y te quedás afuera → correr supabase/rls-rollback.sql.
-- ============================================================

-- ----- Funciones de ayuda (security definer para no chocar con la RLS) -------
create or replace function public.auth_email() returns text
  language sql stable security definer set search_path = public as
$$ select lower(auth.jwt() ->> 'email') $$;

create or replace function public.es_superadmin() returns boolean
  language sql stable security definer set search_path = public as
$$ select exists (select 1 from plataforma_admins where lower(email) = public.auth_email()) $$;

create or replace function public.puede_ver_cuenta(cid uuid) returns boolean
  language sql stable security definer set search_path = public as
$$ select public.es_superadmin() or exists (
     select 1 from miembros m where m.cuenta_id = cid and lower(m.email) = public.auth_email()) $$;

create or replace function public.puede_editar_cuenta(cid uuid) returns boolean
  language sql stable security definer set search_path = public as
$$ select public.es_superadmin() or exists (
     select 1 from miembros m where m.cuenta_id = cid and lower(m.email) = public.auth_email()
       and m.rol in ('admin','encargado','editor')) $$;

create or replace function public.puede_gestionar_cuenta(cid uuid) returns boolean
  language sql stable security definer set search_path = public as
$$ select public.es_superadmin() or exists (
     select 1 from miembros m where m.cuenta_id = cid and lower(m.email) = public.auth_email()
       and m.rol = 'admin') $$;

-- ----- Tablas de datos (scope por cuenta; escritura por rol) ------------------
do $$
declare t text;
begin
  foreach t in array array[
    'campos','potreros','veterinarios','duenos','tipos_vacuna','categorias_gasto',
    'precios_por_kg','ventas','venta_animales','campanias','animales','vacunaciones','gastos'
  ]
  loop
    execute format('alter table %I enable row level security;', t);
    execute format('drop policy if exists "dev_all" on %I;', t);
    execute format('drop policy if exists "%s_sel" on %I;', t, t);
    execute format('drop policy if exists "%s_ins" on %I;', t, t);
    execute format('drop policy if exists "%s_upd" on %I;', t, t);
    execute format('drop policy if exists "%s_del" on %I;', t, t);
    execute format('create policy "%s_sel" on %I for select to authenticated using (public.puede_ver_cuenta(cuenta_id));', t, t);
    execute format('create policy "%s_ins" on %I for insert to authenticated with check (public.puede_editar_cuenta(cuenta_id));', t, t);
    execute format('create policy "%s_upd" on %I for update to authenticated using (public.puede_editar_cuenta(cuenta_id)) with check (public.puede_editar_cuenta(cuenta_id));', t, t);
    execute format('create policy "%s_del" on %I for delete to authenticated using (public.puede_editar_cuenta(cuenta_id));', t, t);
  end loop;
end $$;

-- ----- Cuentas: ver la propia; crear/editar solo super-admin -----------------
alter table cuentas enable row level security;
drop policy if exists "dev_all" on cuentas;
drop policy if exists "cuentas_sel" on cuentas;
drop policy if exists "cuentas_mod" on cuentas;
create policy "cuentas_sel" on cuentas for select to authenticated using (public.puede_ver_cuenta(id));
create policy "cuentas_mod" on cuentas for all to authenticated using (public.es_superadmin()) with check (public.es_superadmin());

-- ----- Miembros: ver los de tu cuenta; gestionarlos solo Admin/super-admin ---
alter table miembros enable row level security;
drop policy if exists "dev_all" on miembros;
drop policy if exists "miembros_sel" on miembros;
drop policy if exists "miembros_mod" on miembros;
create policy "miembros_sel" on miembros for select to authenticated using (public.puede_ver_cuenta(cuenta_id));
create policy "miembros_mod" on miembros for all to authenticated
  using (public.puede_gestionar_cuenta(cuenta_id)) with check (public.puede_gestionar_cuenta(cuenta_id));

-- ----- miembro_campos: gestionado por el Admin de la cuenta del miembro ------
alter table miembro_campos enable row level security;
drop policy if exists "dev_all" on miembro_campos;
drop policy if exists "miembro_campos_sel" on miembro_campos;
drop policy if exists "miembro_campos_mod" on miembro_campos;
create policy "miembro_campos_sel" on miembro_campos for select to authenticated
  using (exists (select 1 from miembros m where m.id = miembro_id and public.puede_ver_cuenta(m.cuenta_id)));
create policy "miembro_campos_mod" on miembro_campos for all to authenticated
  using (exists (select 1 from miembros m where m.id = miembro_id and public.puede_gestionar_cuenta(m.cuenta_id)))
  with check (exists (select 1 from miembros m where m.id = miembro_id and public.puede_gestionar_cuenta(m.cuenta_id)));

-- ----- Plataforma admins: cada uno ve su fila; gestiona solo super-admin -----
alter table plataforma_admins enable row level security;
drop policy if exists "dev_all" on plataforma_admins;
drop policy if exists "pa_sel" on plataforma_admins;
drop policy if exists "pa_mod" on plataforma_admins;
create policy "pa_sel" on plataforma_admins for select to authenticated
  using (public.es_superadmin() or lower(email) = public.auth_email());
create policy "pa_mod" on plataforma_admins for all to authenticated
  using (public.es_superadmin()) with check (public.es_superadmin());
