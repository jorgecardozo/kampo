# Campo Management — Frontend

Gestión de **Ganadería** y **Gastos del Campo**. Next.js 13 (pages router) + TypeScript + TailwindCSS + shadcn/ui + React Query.

Derivado de `stock-management-front`, reestructurado a **screaming architecture (por módulos)** y con **datos mock** (sin backend todavía).

## Scripts

```bash
pnpm install
pnpm dev      # desarrollo
pnpm build    # build de producción
pnpm start    # servir build
```

> Se usa **pnpm** (ver `.npmrc`). No usar npm.

## Arquitectura

La estructura "grita" el dominio: las features viven en `src/modules/<dominio>/<feature>`, y la infraestructura reutilizable en `src/shared`. `src/pages` queda como routing fino de Next.js (requisito del framework): cada página solo monta el layout + la vista del módulo.

```
src/
  pages/                      # routing (Next.js). Wrappers finos → vistas de módulos
    ganaderia/{dashboard,animales,vacunaciones,calendario,veterinarios,tipos-vacuna}
    gastos/{index,dashboard,categorias}
    potreros/ , dashboard/ , (auth, perfil, users, roles, ...)
  modules/                    # ← screaming architecture
    shared/                   # utilidades y UI transversal a módulos
      lib/format.ts           # formatos, fechas, mockDelay, nextId
      ui/                     # PageHeader, StatCard, FormModal, primitives, ...
    ganaderia/
      shared/                 # types, constants, mock-db (fuente única del dominio)
      animales/               # api + hook + components + index (por feature)
      vacunaciones/           # calcula próxima dosis automáticamente
      veterinarios/
      tipos-vacuna/
      calendario-sanitario/   # deriva próximas/vencidas de vacunaciones
      dashboard/
    gastos/
      shared/                 # types, constants, mock-db
      gastos/ , categorias/ , dashboard/
    configuracion/
      potreros/
  shared/                     # infraestructura heredada y reutilizable
    components/  layout/  lib/  store/  hooks/  config/  assets/  models/
```

### Convención por feature

Cada feature es autocontenida:

```
<feature>/
  <feature>.api.ts     # servicio mock (lee/escribe el mock-db del dominio)
  use<Feature>.ts      # hooks de React Query (useQuery / useMutation)
  components/           # vista(s) + formularios
  index.ts             # API pública del módulo (lo que consumen las pages)
```

Los **dashboards** agregan métricas desde el mismo `mock-db` del dominio, por lo que reflejan en vivo las altas hechas desde los formularios.

### Alias de imports (`tsconfig.json`)

- `@modules/*` → `src/modules/*`
- `@shared/*` → `src/shared/*`
- `@/*` → `src/@/*` (componentes shadcn)
- `components/*`, `lib/*`, `store/*`, `hooks/*`, `layouts/*`, etc. → mapeados a `src/shared/*` (compatibilidad con el código heredado)

## Dominios y entidades

**Ganadería:** `Animal`, `TipoVacuna`, `Vacunación` (con próxima fecha calculada), `Veterinario`, `Potrero`.
**Gastos del Campo:** `Gasto`, `CategoríaGasto` (+ proveedores, medios de pago, campos).

## Estado actual / pendientes

- **Mock-first**: la capa de backend (`pages/api`) se eliminó; los datos viven en memoria (`mock-db.ts`). Reiniciar el server resetea los datos.
- **Auth**: `getServerAuth` está en modo *pass-through* para poder navegar sin backend. El login (Amplify) queda como UI; reactivar el gate al conectar backend.
- Para conectar un backend real: reemplazar los `*.api.ts` de cada feature por llamadas HTTP (manteniendo la misma firma) — las vistas y hooks no cambian.
