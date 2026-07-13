"use client";

import { Suspense } from "react";
import Layout from "@widgets/MainFull/components/Layout";
import { AuthGuard } from "@shared/ui/AuthGuard";

// Layout de las páginas autenticadas: sidebar + navbar (reemplaza el patrón
// getLayout = mainLayout de Pages Router). El Suspense da el límite que
// necesita useSearchParams() en las vistas con deep-links (?ver=, ?editar=).
// AuthGuard: en producción, sin sesión Auth0 → redirige a /api/auth/login.
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <Layout withPadding>
        <Suspense fallback={null}>{children}</Suspense>
      </Layout>
    </AuthGuard>
  );
}
