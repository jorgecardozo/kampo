"use client";

import { useEffect, useState } from "react";

// En producción exigimos sesión Auth0. En dev dejamos pasar (modo mock-first,
// para no tener que loguearse cada vez que se desarrolla).
const REQUIRE_AUTH = process.env.NODE_ENV === "production";

/**
 * Protege las páginas de la app: si no hay sesión Auth0 (GET /api/auth/me → 204),
 * redirige a /api/auth/login volviendo a la página actual. Evita el estado
 * confuso donde la UI mock-first mostraba el dashboard "vacío" sin avisar que
 * faltaba iniciar sesión (sin sesión → sin token Supabase → RLS bloquea los datos).
 */
export function AuthGuard({ children }: { children: React.ReactNode }) {
  // En dev pasa directo; en prod esperamos a confirmar la sesión antes de pintar.
  const [ready, setReady] = useState(!REQUIRE_AUTH);

  useEffect(() => {
    if (!REQUIRE_AUTH) return;
    let cancelled = false;
    fetch("/api/auth/me", { credentials: "include" })
      .then((r) => {
        if (cancelled) return;
        if (r.status === 200) {
          setReady(true);
        } else {
          const returnTo = window.location.pathname + window.location.search;
          window.location.href = `/api/auth/login?returnTo=${encodeURIComponent(returnTo)}`;
        }
      })
      .catch(() => {
        // Si /me falla (red, etc.) no bloqueamos la app para no dejarla inaccesible.
        if (!cancelled) setReady(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!ready) return null;
  return <>{children}</>;
}
