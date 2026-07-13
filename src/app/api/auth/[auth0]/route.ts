// Rutas de Auth0 en App Router: /api/auth/{login,logout,callback,me}
//
// Next.js 15/16 hace que `ctx.params` sea asíncrono (un Promise), pero el handler
// de @auth0/nextjs-auth0 v3 lo lee de forma SÍNCRONA (`ctx.params.auth0`). Sin el
// `await`, la acción queda `undefined` y TODAS las rutas devuelven 404.
// Por eso resolvemos `params` acá y se lo pasamos ya resuelto al handler de Auth0.
import { handleAuth } from "@auth0/nextjs-auth0";

const auth = handleAuth();

export async function GET(
  req: Request,
  ctx: { params: Promise<{ auth0: string }> },
) {
  const params = await ctx.params;
  return auth(req, { params } as never);
}
