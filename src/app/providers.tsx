"use client";

import { ToastContainer, Bounce } from "react-toastify";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import { ModalProvider } from "components/Modal";
import { Bootstrap } from "components/Bootstap";
import { ReactQueryProvider } from "lib/queryClient";
import { ListModeProvider } from "@features/shared/hooks/useListMode";
import { CampoProvider } from "@shared/context/CampoProvider";
import { PermisosProvider } from "@shared/context/PermisosProvider";
import { AppProvider } from "store";

// Árbol de providers (antes en pages/_app.jsx), ahora en el root layout de App Router.
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <UserProvider>
      <ReactQueryProvider>
        <AppProvider session={null}>
          <ModalProvider>
            <Bootstrap>
              {/* Props explícitas: react-toastify v9 define `transition` (y otros)
                  vía defaultProps, que ya no se aplican en React moderno → el toast
                  renderizaba `createElement(undefined)` y tiraba React #130 en prod.
                  Pasando `transition={Bounce}` (y el resto) se evita el crash. */}
              <ToastContainer
                position="top-right"
                autoClose={5000}
                pauseOnHover
                pauseOnFocusLoss
                closeOnClick
                draggable
                theme="light"
                transition={Bounce}
              />
              <PermisosProvider>
                <CampoProvider>
                  <ListModeProvider>{children}</ListModeProvider>
                </CampoProvider>
              </PermisosProvider>
            </Bootstrap>
          </ModalProvider>
        </AppProvider>
      </ReactQueryProvider>
    </UserProvider>
  );
}
