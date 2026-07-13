import { getSession } from "@auth0/nextjs-auth0";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

// Emite un JWT válido para Supabase a partir de la sesión de Auth0 (App Router).
//
// Importante: llamamos `getSession(req, res)` con req/res EXPLÍCITOS. La forma
// sin argumentos usa `next/headers` -> `cookies()`, que en Next 15/16 es async;
// como @auth0/nextjs-auth0 v3 lo lee de forma síncrona, tiraba error y esta ruta
// devolvía 500 (sin sesión -> sin token -> RLS bloqueaba todo -> "no hay datos").
// Pasando el `req` (NextRequest) usa el path basado en request, que sí funciona.
export async function GET(req: NextRequest) {
  try {
    const res = new NextResponse();
    const session = await getSession(req, res);
    const email = session?.user?.email as string | undefined;
    if (!session || !email) return NextResponse.json({ error: "no session" }, { status: 401 });

    const secret = process.env.SUPABASE_JWT_SECRET;
    if (!secret) return NextResponse.json({ error: "missing SUPABASE_JWT_SECRET" }, { status: 500 });

    const now = Math.floor(Date.now() / 1000);
    const exp = now + 60 * 60; // 1 hora
    const token = jwt.sign(
      {
        role: "authenticated",
        aud: "authenticated",
        sub: session.user.sub,
        email: email.toLowerCase(),
        iat: now,
        exp,
      },
      secret,
    );
    return NextResponse.json({ token, exp }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "token error" }, { status: 500 });
  }
}
