"use client";

import { Suspense } from "react";
import Layout from "layouts/MainFull/components/Layout";

// Layout de las páginas autenticadas: sidebar + navbar (reemplaza el patrón
// getLayout = mainLayout de Pages Router). El Suspense da el límite que
// necesita useSearchParams() en las vistas con deep-links (?ver=, ?editar=).
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <Layout withPadding>
      <Suspense fallback={null}>{children}</Suspense>
    </Layout>
  );
}
