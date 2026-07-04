-- ============================================================
--  Campo Management — Seed de permisos (ejecutar DESPUÉS de saas-fase1.sql)
--  Te da: Super-admin del SaaS + Admin de tu cuenta.
--  Cambiá el email si usás otro para loguearte con Google/Facebook.
-- ============================================================

-- 1) Super-admin de la plataforma (dueño del SaaS).
insert into plataforma_admins (email)
values ('jorgecardozosilvio@gmail.com')
on conflict (email) do nothing;

-- 2) Admin de la cuenta por defecto (la que creó saas-fase1.sql).
insert into miembros (cuenta_id, email, rol)
select id, 'jorgecardozosilvio@gmail.com', 'admin'
from cuentas
order by created_at
limit 1
on conflict (cuenta_id, email) do update set rol = 'admin';
