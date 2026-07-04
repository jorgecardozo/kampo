-- ============================================================
--  Campo Management — Fix multi-cliente (asignación de cuenta automática)
--  Ejecutar en: Supabase → SQL Editor → Run
--
--  Reemplaza el "valor por defecto fijo" (que apuntaba siempre a una cuenta)
--  por un TRIGGER que asigna la cuenta según el usuario logueado (o su campo).
--  Así cada cliente escribe en SU cuenta, siempre. No requiere cambios en la app.
-- ============================================================

-- 1) Sacar los defaults fijos de cuenta_id / campo_id -------------------------
do $$
declare t text;
begin
  foreach t in array array[
    'campos','miembros','potreros','veterinarios','duenos','tipos_vacuna',
    'categorias_gasto','precios_por_kg','ventas','venta_animales','campanias',
    'animales','vacunaciones','gastos'
  ]
  loop
    execute format('alter table %I alter column cuenta_id drop default;', t);
  end loop;

  foreach t in array array['potreros','ventas','campanias','animales','vacunaciones','gastos','precios_por_kg']
  loop
    execute format('alter table %I alter column campo_id drop default;', t);
  end loop;
end $$;

-- 2) Función "sello inteligente": setea cuenta_id según quién está logueado ---
--    - Si la fila tiene campo_id → toma la cuenta de ese campo.
--    - Si no → toma la cuenta del usuario logueado (por su email en miembros).
create or replace function public.set_tenant() returns trigger
  language plpgsql security definer set search_path = public as
$$
declare
  v_campo  uuid;
  v_cuenta uuid;
begin
  if NEW.cuenta_id is null then
    v_campo := nullif(to_jsonb(NEW) ->> 'campo_id', '')::uuid;
    if v_campo is not null then
      select cuenta_id into v_cuenta from campos where id = v_campo;
    end if;
    if v_cuenta is null then
      select cuenta_id into v_cuenta
      from miembros
      where lower(email) = public.auth_email()
      order by created_at
      limit 1;
    end if;
    NEW.cuenta_id := v_cuenta;
  end if;
  return NEW;
end
$$;

-- 3) Aplicar el trigger BEFORE INSERT en todas las tablas ---------------------
do $$
declare t text;
begin
  foreach t in array array[
    'campos','miembros','potreros','veterinarios','duenos','tipos_vacuna',
    'categorias_gasto','precios_por_kg','ventas','venta_animales','campanias',
    'animales','vacunaciones','gastos'
  ]
  loop
    execute format('drop trigger if exists trg_set_tenant on %I;', t);
    execute format('create trigger trg_set_tenant before insert on %I for each row execute function public.set_tenant();', t);
  end loop;
end $$;
