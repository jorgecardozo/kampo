# Deploy a producción (Vercel + subdominio de jcsolutions.dev)

App siempre online, sin depender de tu Mac. Backend = Supabase (ya always-on).
Dominio sugerido: **campo.jcsolutions.dev** (o app.jcsolutions.dev).

## 1. Subir el código a GitHub
El repo ya es git. Creá un repo en GitHub (privado) y subilo:
```
git add -A
git commit -m "Deploy inicial"
git branch -M main
git remote add origin git@github.com:<tu-usuario>/campo-management.git
git push -u origin main
```
> ⚠️ Verificá que `.env.local` está en `.gitignore` (lo está) — NUNCA subir secrets.

## 2. Importar en Vercel
1. Entrá a https://vercel.com → "Add New… → Project" → importá el repo.
2. Framework: **Next.js** (lo detecta solo). Package manager: **pnpm** (por el `pnpm-lock`).
3. Antes de deployar, cargá las **Environment Variables** (paso 3).

## 3. Environment Variables en Vercel (Production)
Copiá los valores desde tu `.env.local`. Las claves:

| Variable | Valor |
|---|---|
| `AUTH0_SECRET` | (el de .env.local, o `openssl rand -hex 32`) |
| `AUTH0_BASE_URL` | `https://campo.jcsolutions.dev`  ← **la URL de producción** |
| `AUTH0_ISSUER_BASE_URL` | (el de .env.local) |
| `AUTH0_CLIENT_ID` | (el de .env.local) |
| `AUTH0_CLIENT_SECRET` | (el de .env.local) |
| `NEXT_PUBLIC_SUPABASE_URL` | (el de .env.local) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | (el de .env.local) |
| `SUPABASE_JWT_SECRET` | (el de .env.local — server only) |

## 4. Dominio en Vercel + Cloudflare
1. En Vercel → Project → **Settings → Domains** → agregá `campo.jcsolutions.dev`.
2. Vercel te da un target (ej: `cname.vercel-dns.com`).
3. En **Cloudflare** (donde está jcsolutions.dev) → DNS → agregá un registro:
   - Tipo: **CNAME** · Nombre: `campo` · Destino: `cname.vercel-dns.com`
   - **Proxy status: DNS only** (nube gris, NO naranja) → evita conflictos con Vercel.
4. Esperá que Vercel valide el dominio (unos minutos) y emita el SSL.

## 5. Auth0 — habilitar la URL de producción
En Auth0 → Applications → tu app → **Settings**, agregá (además de las de localhost):
- **Allowed Callback URLs:** `https://campo.jcsolutions.dev/api/auth/callback`
- **Allowed Logout URLs:** `https://campo.jcsolutions.dev`
- **Allowed Web Origins:** `https://campo.jcsolutions.dev`

Guardá. (Si no, el login falla con "callback mismatch".)

## 6. Deploy y probar
- Vercel deploya solo en cada `git push` a `main`.
- Entrá a `https://campo.jcsolutions.dev`, logueate con Google, y verificá que ves tus datos.
- Probá `/api/supabase-token` (Network) → 200.

## Notas
- Supabase no cambia: mismas tablas, RLS, keys. Solo asegurate de tener las env en Vercel.
- Deploy automático: cada push a `main` = nueva versión online.
- Para dominio raíz (`jcsolutions.dev`) o `www`, la config es igual pero con A/CNAME según indique Vercel.
