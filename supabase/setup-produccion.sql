-- ============================================================
--  Campo Management — Setup COMPLETO (proyecto nuevo / producción)
--  Ejecutar UNA VEZ en un proyecto Supabase NUEVO:
--    Supabase → SQL Editor → New query → pegar TODO → Run
--    (Si sale el aviso de RLS, elegí "Run without RLS": este script maneja la RLS.)
--
--  Deja listo: todas las tablas, seguridad RLS multi-tenant, trigger de cuenta
--  automática, y tu alta como Admin + Super-admin.
--
--  ⚠️ Cambiá el email del final si usás otro para loguearte con Google/Facebook.
-- ============================================================

create extension if not exists "pgcrypto";

-- ===== Tablas de plataforma / cuentas =======================================
create table if not exists cuentas (
  id         uuid primary key default gen_random_uuid(),
  nombre     text not null,
  contacto   text default '',
  telefono   text default '',
  created_at timestamptz default now(),
  deleted_at timestamptz
);

create table if not exists campos (
  id         uuid primary key default gen_random_uuid(),
  cuenta_id  uuid not null references cuentas(id) on delete cascade,
  nombre     text not null,
  ubicacion  text default '',
  hectareas  numeric default 0,
  created_at timestamptz default now(),
  deleted_at timestamptz
);

create table if not exists miembros (
  id           uuid primary key default gen_random_uuid(),
  cuenta_id    uuid not null references cuentas(id) on delete cascade,
  email        text not null,
  user_sub     text,
  nombre       text default '',
  rol          text not null default 'lector',
  acceso_todos boolean default true,
  created_at   timestamptz default now(),
  unique (cuenta_id, email)
);

create table if not exists miembro_campos (
  miembro_id uuid references miembros(id) on delete cascade,
  campo_id   uuid references campos(id)   on delete cascade,
  primary key (miembro_id, campo_id)
);

create table if not exists plataforma_admins (
  email      text primary key,
  user_sub   text,
  created_at timestamptz default now()
);

-- ===== Catálogos (nivel cuenta) =============================================
create table if not exists veterinarios (
  id uuid primary key default gen_random_uuid(),
  cuenta_id uuid references cuentas(id) on delete cascade,
  nombre text not null, matricula text default '', telefono text default '', email text default '',
  created_at timestamptz default now(), deleted_at timestamptz
);

create table if not exists duenos (
  id uuid primary key default gen_random_uuid(),
  cuenta_id uuid references cuentas(id) on delete cascade,
  nombre text not null, alias text default '', telefono text default '', email text default '', documento text default '',
  created_at timestamptz default now(), deleted_at timestamptz
);

create table if not exists tipos_vacuna (
  id uuid primary key default gen_random_uuid(),
  cuenta_id uuid references cuentas(id) on delete cascade,
  nombre text not null, enfermedad text default '', periodicidad_dias integer not null default 180,
  dosis text default '', via text default 'Subcutánea', obligatoria boolean default false,
  created_at timestamptz default now(), deleted_at timestamptz
);

create table if not exists categorias_gasto (
  id uuid primary key default gen_random_uuid(),
  cuenta_id uuid references cuentas(id) on delete cascade,
  nombre text not null, area text not null default 'campo',
  created_at timestamptz default now(), deleted_at timestamptz
);

-- Precio del kilo por CAMPO (cada establecimiento el suyo).
create table if not exists precios_por_kg (
  cuenta_id uuid references cuentas(id) on delete cascade,
  campo_id  uuid references campos(id) on delete cascade,
  categoria text,
  precio_kg numeric not null default 0,
  primary key (campo_id, categoria)
);

-- ===== Configuración / físico ================================================
create table if not exists potreros (
  id uuid primary key default gen_random_uuid(),
  cuenta_id uuid references cuentas(id) on delete cascade,
  campo_id  uuid references campos(id) on delete set null,
  nombre text not null, ubicacion text default '', hectareas numeric default 0, capacidad integer default 0,
  created_at timestamptz default now(), deleted_at timestamptz
);

-- ===== Ganadería =============================================================
create table if not exists animales (
  id uuid primary key default gen_random_uuid(),
  cuenta_id uuid references cuentas(id) on delete cascade,
  campo_id  uuid references campos(id) on delete set null,
  caravana text, nombre text, categoria text not null, raza text not null, sexo text not null,
  fecha_nacimiento date, peso_kg numeric default 0, color text default '', potrero text default '',
  dueno text default '', estado text not null default 'Activo', fecha_ingreso date, observaciones text,
  created_at timestamptz default now(), deleted_at timestamptz,
  unique (cuenta_id, caravana)   -- caravana única POR CUENTA (varias cuentas pueden repetir número)
);

create table if not exists campanias (
  id uuid primary key default gen_random_uuid(),
  cuenta_id uuid references cuentas(id) on delete cascade,
  campo_id  uuid references campos(id) on delete set null,
  fecha_aplicacion date not null, proxima_fecha date,
  tipo_vacuna_id uuid references tipos_vacuna(id) on delete restrict,
  veterinario_id uuid references veterinarios(id) on delete set null,
  lote_producto text default '', costo numeric default 0, observaciones text,
  created_at timestamptz default now(), deleted_at timestamptz
);

create table if not exists vacunaciones (
  id uuid primary key default gen_random_uuid(),
  cuenta_id uuid references cuentas(id) on delete cascade,
  campo_id  uuid references campos(id) on delete set null,
  animal_id uuid not null references animales(id) on delete cascade,
  tipo_vacuna_id uuid not null references tipos_vacuna(id) on delete restrict,
  veterinario_id uuid references veterinarios(id) on delete set null,
  campania_id uuid references campanias(id) on delete set null,
  fecha_aplicacion date not null, proxima_fecha date, lote_producto text default '', dosis text default '',
  costo numeric default 0, observaciones text,
  created_at timestamptz default now(), deleted_at timestamptz
);

-- ===== Finanzas / gastos =====================================================
create table if not exists ventas (
  id uuid primary key default gen_random_uuid(),
  cuenta_id uuid references cuentas(id) on delete cascade,
  campo_id  uuid references campos(id) on delete set null,
  fecha date not null, area text not null default 'ganaderia', concepto text not null,
  monto numeric not null default 0, detalle text default '',
  created_at timestamptz default now(), deleted_at timestamptz
);

create table if not exists venta_animales (
  id uuid primary key default gen_random_uuid(),
  cuenta_id uuid references cuentas(id) on delete cascade,
  venta_id  uuid not null references ventas(id)   on delete cascade,
  animal_id uuid not null references animales(id) on delete restrict,
  peso_kg numeric default 0, precio_kg numeric default 0, subtotal numeric default 0,
  created_at timestamptz default now()
);

create table if not exists gastos (
  id uuid primary key default gen_random_uuid(),
  cuenta_id uuid references cuentas(id) on delete cascade,
  campo_id  uuid references campos(id) on delete set null,
  fecha date not null, categoria_id uuid not null references categorias_gasto(id) on delete restrict,
  area text not null default 'campo', descripcion text not null, monto numeric not null default 0,
  proveedor text default '', medio_pago text default '', campo text default '', responsable text default '',
  created_at timestamptz default now(), deleted_at timestamptz
);

-- ===== Índices ===============================================================
do $$
declare t text;
begin
  foreach t in array array[
    'campos','miembros','potreros','veterinarios','duenos','tipos_vacuna','categorias_gasto',
    'precios_por_kg','ventas','venta_animales','campanias','animales','vacunaciones','gastos'
  ]
  loop
    execute format('create index if not exists idx_%s_cuenta on %I(cuenta_id);', t, t);
  end loop;
  foreach t in array array['potreros','ventas','campanias','animales','vacunaciones','gastos','precios_por_kg']
  loop
    execute format('create index if not exists idx_%s_campo on %I(campo_id);', t, t);
  end loop;
end $$;

-- ===== Funciones de seguridad ===============================================
create or replace function public.auth_email() returns text
  language sql stable security definer set search_path = public as
$$ select lower(auth.jwt() ->> 'email') $$;

create or replace function public.es_superadmin() returns boolean
  language sql stable security definer set search_path = public as
$$ select exists (select 1 from plataforma_admins where lower(email) = public.auth_email()) $$;

create or replace function public.puede_ver_cuenta(cid uuid) returns boolean
  language sql stable security definer set search_path = public as
$$ select public.es_superadmin() or exists (
     select 1 from miembros m join cuentas c on c.id = m.cuenta_id
     where m.cuenta_id = cid and lower(m.email) = public.auth_email() and c.deleted_at is null) $$;

create or replace function public.puede_editar_cuenta(cid uuid) returns boolean
  language sql stable security definer set search_path = public as
$$ select public.es_superadmin() or exists (
     select 1 from miembros m join cuentas c on c.id = m.cuenta_id
     where m.cuenta_id = cid and lower(m.email) = public.auth_email() and c.deleted_at is null
       and m.rol in ('admin','encargado','editor')) $$;

create or replace function public.puede_gestionar_cuenta(cid uuid) returns boolean
  language sql stable security definer set search_path = public as
$$ select public.es_superadmin() or exists (
     select 1 from miembros m join cuentas c on c.id = m.cuenta_id
     where m.cuenta_id = cid and lower(m.email) = public.auth_email() and c.deleted_at is null
       and m.rol = 'admin') $$;

-- ===== Trigger de cuenta automática (sello inteligente) =====================
create or replace function public.set_tenant() returns trigger
  language plpgsql security definer set search_path = public as
$$
declare v_campo uuid; v_cuenta uuid;
begin
  if NEW.cuenta_id is null then
    v_campo := nullif(to_jsonb(NEW) ->> 'campo_id', '')::uuid;
    if v_campo is not null then
      select cuenta_id into v_cuenta from campos where id = v_campo;
    end if;
    if v_cuenta is null then
      select cuenta_id into v_cuenta from miembros
      where lower(email) = public.auth_email() order by created_at limit 1;
    end if;
    NEW.cuenta_id := v_cuenta;
  end if;
  return NEW;
end
$$;

do $$
declare t text;
begin
  foreach t in array array[
    'campos','miembros','potreros','veterinarios','duenos','tipos_vacuna','categorias_gasto',
    'precios_por_kg','ventas','venta_animales','campanias','animales','vacunaciones','gastos'
  ]
  loop
    execute format('drop trigger if exists trg_set_tenant on %I;', t);
    execute format('create trigger trg_set_tenant before insert on %I for each row execute function public.set_tenant();', t);
  end loop;
end $$;

-- ===== RLS: cada uno ve/edita solo su cuenta, según su rol ===================
do $$
declare t text;
begin
  foreach t in array array[
    'campos','potreros','veterinarios','duenos','tipos_vacuna','categorias_gasto',
    'precios_por_kg','ventas','venta_animales','campanias','animales','vacunaciones','gastos'
  ]
  loop
    execute format('alter table %I enable row level security;', t);
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

alter table cuentas enable row level security;
drop policy if exists "cuentas_sel" on cuentas;
drop policy if exists "cuentas_mod" on cuentas;
create policy "cuentas_sel" on cuentas for select to authenticated using (public.puede_ver_cuenta(id));
create policy "cuentas_mod" on cuentas for all to authenticated using (public.es_superadmin()) with check (public.es_superadmin());

alter table miembros enable row level security;
drop policy if exists "miembros_sel" on miembros;
drop policy if exists "miembros_mod" on miembros;
create policy "miembros_sel" on miembros for select to authenticated using (public.puede_ver_cuenta(cuenta_id));
create policy "miembros_mod" on miembros for all to authenticated
  using (public.puede_gestionar_cuenta(cuenta_id)) with check (public.puede_gestionar_cuenta(cuenta_id));

alter table miembro_campos enable row level security;
drop policy if exists "miembro_campos_sel" on miembro_campos;
drop policy if exists "miembro_campos_mod" on miembro_campos;
create policy "miembro_campos_sel" on miembro_campos for select to authenticated
  using (exists (select 1 from miembros m where m.id = miembro_id and public.puede_ver_cuenta(m.cuenta_id)));
create policy "miembro_campos_mod" on miembro_campos for all to authenticated
  using (exists (select 1 from miembros m where m.id = miembro_id and public.puede_gestionar_cuenta(m.cuenta_id)))
  with check (exists (select 1 from miembros m where m.id = miembro_id and public.puede_gestionar_cuenta(m.cuenta_id)));

alter table plataforma_admins enable row level security;
drop policy if exists "pa_sel" on plataforma_admins;
drop policy if exists "pa_mod" on plataforma_admins;
create policy "pa_sel" on plataforma_admins for select to authenticated
  using (public.es_superadmin() or lower(email) = public.auth_email());
create policy "pa_mod" on plataforma_admins for all to authenticated
  using (public.es_superadmin()) with check (public.es_superadmin());

-- ===== Alta inicial: tu cuenta + Admin + Super-admin ========================
-- ⚠️ Cambiá el email si usás otro para loguearte.
do $$
declare c uuid; mail text := 'jorgecardozosilvio@gmail.com';
begin
  select id into c from cuentas order by created_at limit 1;
  if c is null then
    insert into cuentas (nombre) values ('Mi cuenta') returning id into c;
    insert into campos (cuenta_id, nombre) values (c, 'Mi campo');
  end if;
  insert into miembros (cuenta_id, email, rol) values (c, mail, 'admin')
    on conflict (cuenta_id, email) do update set rol = 'admin';
  insert into plataforma_admins (email) values (mail) on conflict (email) do nothing;
end $$;
