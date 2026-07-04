-- ============================================================
--  Campo Management — Datos de ejemplo (seed)
--  Ejecutar DESPUÉS de schema.sql y rls-dev.sql
--  Supabase → SQL Editor → New query → Run
--  Es idempotente: se puede correr varias veces sin duplicar.
-- ============================================================

-- ----- Precios por kg (PK = categoria) --------------------------------------
insert into precios_por_kg (categoria, precio_kg) values
  ('Ternero/a',  2800),
  ('Vaquillona', 2600),
  ('Novillo',    2700),
  ('Vaca',       2200),
  ('Toro',       2400)
on conflict (categoria) do update set precio_kg = excluded.precio_kg;

-- ----- Dueños ---------------------------------------------------------------
insert into duenos (nombre, alias, telefono, email, documento) values
  ('Jorge Cardozo', 'Jorge',  '+595 981 111111', 'jorge@campo.com',  '1234567'),
  ('María López',   'Mari',   '+595 982 222222', 'maria@campo.com',  '7654321'),
  ('Estancia La Loma S.A.', 'La Loma', '+595 983 333333', 'laloma@campo.com', '80012345')
on conflict do nothing;

-- ----- Potreros -------------------------------------------------------------
insert into potreros (nombre, ubicacion, hectareas, capacidad) values
  ('Potrero Norte', 'Sector A', 45, 60),
  ('Potrero Sur',   'Sector B', 30, 40),
  ('Corral',        'Casco',     2, 20)
on conflict do nothing;

-- ----- Veterinarios ---------------------------------------------------------
insert into veterinarios (nombre, matricula, telefono, email) values
  ('Dr. Pedro Giménez', 'MV-1023', '+595 984 444444', 'pedro.vet@campo.com'),
  ('Dra. Ana Rojas',    'MV-2087', '+595 985 555555', 'ana.vet@campo.com')
on conflict do nothing;

-- ----- Tipos de vacuna ------------------------------------------------------
insert into tipos_vacuna (nombre, enfermedad, periodicidad_dias, dosis, via, obligatoria) values
  ('Aftosa',      'Fiebre aftosa',   180, '5 ml', 'Subcutánea',    true),
  ('Brucelosis',  'Brucelosis',      365, '2 ml', 'Subcutánea',    true),
  ('Carbunclo',   'Carbunclo',       365, '2 ml', 'Intramuscular', false)
on conflict do nothing;

-- ----- Categorías de gasto --------------------------------------------------
insert into categorias_gasto (nombre, area) values
  ('Alimentación',   'ganaderia'),
  ('Sanidad',        'ganaderia'),
  ('Combustible',    'campo'),
  ('Mantenimiento',  'campo'),
  ('Mano de obra',   'campo')
on conflict do nothing;

-- ----- Animales -------------------------------------------------------------
insert into animales (caravana, nombre, categoria, raza, sexo, fecha_nacimiento, peso_kg, color, potrero, dueno, estado, fecha_ingreso) values
  ('A-001', 'Lucero',  'Vaca',       'Brangus',  'Hembra', '2021-03-10', 420, 'Colorado', 'Potrero Norte', 'Jorge Cardozo', 'Activo', '2021-04-01'),
  ('A-002', 'Manchas', 'Vaca',       'Nelore',   'Hembra', '2020-06-22', 460, 'Blanco',   'Potrero Norte', 'María López',   'Activo', '2020-07-15'),
  ('A-003', 'Bravo',   'Toro',       'Brahman',  'Macho',  '2019-01-05', 720, 'Gris',     'Potrero Sur',   'Estancia La Loma S.A.', 'Activo', '2019-02-01'),
  ('A-004', null,      'Ternero/a',  'Brangus',  'Macho',  '2024-09-12',  95, 'Colorado', 'Potrero Norte', 'Jorge Cardozo', 'Activo', '2024-09-12'),
  ('A-005', null,      'Vaquillona', 'Angus',    'Hembra', '2023-02-18', 290, 'Negro',    'Potrero Sur',   'María López',   'Activo', '2023-03-01'),
  ('A-006', 'Tormenta','Novillo',    'Hereford', 'Macho',  '2022-11-30', 380, 'Colorado', 'Potrero Sur',   'Jorge Cardozo', 'Activo', '2022-12-10'),
  ('A-007', null,      'Ternero/a',  'Nelore',   'Hembra', '2024-12-01',  80, 'Blanco',   'Corral',        'María López',   'Activo', '2024-12-01'),
  ('A-008', 'Vieja',   'Vaca',       'Criollo',  'Hembra', '2017-05-20', 410, 'Bayo',     'Potrero Norte', 'Estancia La Loma S.A.', 'Vendido', '2017-06-01')
on conflict (caravana) do nothing;
