-- ============================================================
--  Campo Management — Datos extra de cuenta + suspensión real
--  Ejecutar en: Supabase → SQL Editor → Run
-- ============================================================

-- Datos de contacto del cliente (para el panel de super-admin).
alter table cuentas add column if not exists contacto text default '';
alter table cuentas add column if not exists telefono text default '';

-- Que "suspender" una cuenta (deleted_at) bloquee de verdad a sus miembros.
-- El super-admin sigue viendo/gestionando todo (es_superadmin corta antes).
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
