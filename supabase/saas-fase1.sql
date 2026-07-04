-- ============================================================
--  Campo Management — SaaS Fase 1: cimientos multi-tenant
--  Ejecutar en: Supabase → SQL Editor → New query → Run
--
--  Crea: cuentas, campos (establecimientos), miembros, miembro_campos,
--        plataforma_admins.
--  Agrega: cuenta_id a TODAS las tablas; campo_id a las "físicas".
--  Migra los datos actuales a una Cuenta + Campo por defecto (nada se pierde).
--  Es idempotente.
-- ============================================================

-- ----- Tablas nuevas ---------------------------------------------------------
create table if not exists cuentas (
  id          uuid primary key default gen_random_uuid(),
  nombre      text not null,
  created_at  timestamptz default now(),
  deleted_at  timestamptz
);

-- Campo = establecimiento físico (pertenece a una cuenta).
create table if not exists campos (
  id          uuid primary key default gen_random_uuid(),
  cuenta_id   uuid not null references cuentas(id) on delete cascade,
  nombre      text not null,
  ubicacion   text default '',
  hectareas   numeric default 0,
  created_at  timestamptz default now(),
  deleted_at  timestamptz
);
create index if not exists idx_campos_cuenta on campos(cuenta_id);

-- Miembros de una cuenta (usuario ↔ cuenta ↔ rol).
create table if not exists miembros (
  id            uuid primary key default gen_random_uuid(),
  cuenta_id     uuid not null references cuentas(id) on delete cascade,
  email         text not null,                 -- para invitar antes de que entre
  user_sub      text,                          -- Auth0 sub (se completa al primer login)
  nombre        text default '',
  rol           text not null default 'lector',-- 'admin' | 'editor' | 'lector'
  acceso_todos  boolean default true,          -- true = ve todos los campos de la cuenta
  created_at    timestamptz default now(),
  unique (cuenta_id, email)
);
create index if not exists idx_miembros_cuenta on miembros(cuenta_id);
create index if not exists idx_miembros_email  on miembros(email);

-- Si acceso_todos = false, a qué campos puntuales accede el miembro.
create table if not exists miembro_campos (
  miembro_id  uuid references miembros(id) on delete cascade,
  campo_id    uuid references campos(id)   on delete cascade,
  primary key (miembro_id, campo_id)
);

-- Dueños del SaaS (super-admin de la plataforma).
create table if not exists plataforma_admins (
  email     text primary key,
  user_sub  text,
  created_at timestamptz default now()
);

-- ----- Columnas cuenta_id (TODAS) y campo_id (físicas) -----------------------
do $$
declare t text;
begin
  foreach t in array array[
    'potreros','veterinarios','duenos','tipos_vacuna','categorias_gasto',
    'precios_por_kg','ventas','venta_animales','campanias','animales','vacunaciones','gastos'
  ]
  loop
    execute format('alter table %I add column if not exists cuenta_id uuid;', t);
    execute format('create index if not exists idx_%s_cuenta on %I(cuenta_id);', t, t);
  end loop;

  foreach t in array array['potreros','ventas','campanias','animales','vacunaciones','gastos','precios_por_kg']
  loop
    execute format('alter table %I add column if not exists campo_id uuid;', t);
    execute format('create index if not exists idx_%s_campo on %I(campo_id);', t, t);
  end loop;
end $$;

-- ----- Cuenta + Campo por defecto y backfill de los datos actuales -----------
do $$
declare c_id uuid; f_id uuid; t text;
begin
  select id into c_id from cuentas order by created_at limit 1;
  if c_id is null then
    insert into cuentas(nombre) values ('Mi cuenta') returning id into c_id;
  end if;

  select id into f_id from campos where cuenta_id = c_id order by created_at limit 1;
  if f_id is null then
    insert into campos(cuenta_id, nombre) values (c_id, 'Mi campo') returning id into f_id;
  end if;

  -- Default temporal (Fase 1, cuenta única): campos/miembros nuevos van a esta
  -- cuenta sin que el front tenga que mandarlo. En Fase 2 (auth) se quita.
  execute format('alter table campos alter column cuenta_id set default %L;', c_id);
  execute format('alter table miembros alter column cuenta_id set default %L;', c_id);

  foreach t in array array[
    'potreros','veterinarios','duenos','tipos_vacuna','categorias_gasto',
    'precios_por_kg','ventas','venta_animales','campanias','animales','vacunaciones','gastos'
  ]
  loop
    execute format('update %I set cuenta_id = %L where cuenta_id is null;', t, c_id);
    -- default temporal (Fase 1, cuenta única). En Fase 2 se quita.
    execute format('alter table %I alter column cuenta_id set default %L;', t, c_id);
  end loop;

  foreach t in array array['potreros','ventas','campanias','animales','vacunaciones','gastos','precios_por_kg']
  loop
    execute format('update %I set campo_id = %L where campo_id is null;', t, f_id);
    execute format('alter table %I alter column campo_id set default %L;', t, f_id);
  end loop;
end $$;

-- precios_por_kg: precio por kg POR CAMPO → la PK pasa a (campo_id, categoria).
alter table precios_por_kg drop constraint if exists precios_por_kg_pkey;
alter table precios_por_kg add primary key (campo_id, categoria);

-- ----- RLS de desarrollo en las tablas nuevas (candado real = Fase 2) --------
do $$
declare t text;
begin
  foreach t in array array['cuentas','campos','miembros','miembro_campos','plataforma_admins']
  loop
    execute format('alter table %I enable row level security;', t);
    execute format('drop policy if exists "dev_all" on %I;', t);
    execute format('create policy "dev_all" on %I for all to anon, authenticated using (true) with check (true);', t);
  end loop;
end $$;
