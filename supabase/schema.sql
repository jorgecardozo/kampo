-- ============================================================
--  Campo Management — Esquema PostgreSQL (Supabase)
--  Ejecutar en: Supabase → SQL Editor → New query → Run
-- ============================================================

-- Extensión para gen_random_uuid()
create extension if not exists "pgcrypto";

-- ----- Configuración / catálogos --------------------------------------------

create table if not exists potreros (
  id          uuid primary key default gen_random_uuid(),
  nombre      text not null,
  ubicacion   text default '',
  hectareas   numeric default 0,
  capacidad   integer default 0,
  created_at  timestamptz default now()
);

create table if not exists veterinarios (
  id          uuid primary key default gen_random_uuid(),
  nombre      text not null,
  matricula   text not null,
  telefono    text default '',
  email       text default '',
  created_at  timestamptz default now()
);

create table if not exists duenos (
  id          uuid primary key default gen_random_uuid(),
  nombre      text not null,
  alias       text default '',
  telefono    text default '',
  email       text default '',
  documento   text default '',
  created_at  timestamptz default now()
);

create table if not exists tipos_vacuna (
  id                uuid primary key default gen_random_uuid(),
  nombre            text not null,
  enfermedad        text default '',
  periodicidad_dias integer not null default 180,
  dosis             text default '',
  via               text default 'Subcutánea',
  obligatoria       boolean default false,
  created_at        timestamptz default now()
);

create table if not exists categorias_gasto (
  id          uuid primary key default gen_random_uuid(),
  nombre      text not null,
  area        text not null default 'campo',  -- 'campo' | 'ganaderia'
  created_at  timestamptz default now()
);

-- Precio del kilo vivo por categoría de animal.
create table if not exists precios_por_kg (
  categoria   text primary key,               -- Ternero/a, Vaquillona, ...
  precio_kg   numeric not null default 0
);

-- Ingresos / ventas (campo o ganadería).
create table if not exists ventas (
  id          uuid primary key default gen_random_uuid(),
  fecha       date not null,
  area        text not null default 'ganaderia', -- 'campo' | 'ganaderia'
  concepto    text not null,
  monto       numeric not null default 0,
  detalle     text default '',
  created_at  timestamptz default now()
);

-- ----- Ganadería -------------------------------------------------------------

create table if not exists animales (
  id               uuid primary key default gen_random_uuid(),
  caravana         text unique,   -- opcional (los animales igual tienen su id propio)
  nombre           text,
  categoria        text not null,
  raza             text not null,
  sexo             text not null,
  fecha_nacimiento date,
  peso_kg          numeric default 0,
  color            text default '',
  potrero          text default '',
  dueno            text default '',
  estado           text not null default 'Activo',
  fecha_ingreso    date,
  observaciones    text,
  created_at       timestamptz default now()
);

-- Campaña de vacunación (lote): agrupa varias aplicaciones.
create table if not exists campanias (
  id               uuid primary key default gen_random_uuid(),
  fecha_aplicacion date not null,
  proxima_fecha    date,
  tipo_vacuna_id   uuid references tipos_vacuna(id) on delete restrict,
  veterinario_id   uuid references veterinarios(id) on delete set null,
  lote_producto    text default '',
  costo            numeric default 0,
  observaciones    text,
  created_at       timestamptz default now()
);

create table if not exists vacunaciones (
  id               uuid primary key default gen_random_uuid(),
  animal_id        uuid not null references animales(id) on delete cascade,
  tipo_vacuna_id   uuid not null references tipos_vacuna(id) on delete restrict,
  veterinario_id   uuid references veterinarios(id) on delete set null,
  campania_id      uuid references campanias(id) on delete set null,
  fecha_aplicacion date not null,
  proxima_fecha    date,
  lote_producto    text default '',
  dosis            text default '',
  costo            numeric default 0,
  observaciones    text,
  created_at       timestamptz default now()
);

-- Animales vendidos en cada venta (peso × precio/kg = subtotal).
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

-- ----- Gastos del campo ------------------------------------------------------

create table if not exists gastos (
  id            uuid primary key default gen_random_uuid(),
  fecha         date not null,
  categoria_id  uuid not null references categorias_gasto(id) on delete restrict,
  area          text not null default 'campo',  -- copiada de la categoría
  descripcion   text not null,
  monto         numeric not null default 0,
  proveedor     text default '',
  medio_pago    text default '',
  campo         text default '',
  responsable   text default '',
  created_at    timestamptz default now()
);

-- ----- Índices útiles --------------------------------------------------------

create index if not exists idx_vacunaciones_animal      on vacunaciones(animal_id);
create index if not exists idx_vacunaciones_proxima     on vacunaciones(proxima_fecha);
create index if not exists idx_gastos_categoria         on gastos(categoria_id);
create index if not exists idx_gastos_fecha             on gastos(fecha);
create index if not exists idx_animales_estado          on animales(estado);

-- ----- Row Level Security ----------------------------------------------------
-- Habilitamos RLS y permitimos todo a usuarios autenticados (MVP).
-- Más adelante se pueden afinar políticas por usuario/rol.

do $$
declare t text;
begin
  foreach t in array array[
    'potreros','veterinarios','duenos','tipos_vacuna','categorias_gasto',
    'precios_por_kg','ventas','venta_animales','campanias','animales','vacunaciones','gastos'
  ]
  loop
    execute format('alter table %I enable row level security;', t);
    execute format('drop policy if exists "auth_all" on %I;', t);
    execute format($f$
      create policy "auth_all" on %I
        for all
        to authenticated
        using (true)
        with check (true);
    $f$, t);
  end loop;
end $$;
