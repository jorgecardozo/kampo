// Libraries
import { ToastContainer } from 'react-toastify'
import { UserProvider } from '@auth0/nextjs-auth0/client'

//Components
import { ModalProvider } from 'components/Modal'
import { Bootstrap } from 'components/Bootstap'
import { ReactQueryProvider } from 'lib/queryClient'
import { ListModeProvider } from '@modules/shared/hooks/useListMode'
import { CampoProvider } from '@shared/context/CampoProvider'
import { PermisosProvider } from '@shared/context/PermisosProvider'

// Store
import { AppProvider } from 'store'

// Styles
import 'assets/styles/global.css'
import 'react-toastify/dist/ReactToastify.css'

const App = ({ Component, pageProps }) => {
  // Layout persistente: si la página define getLayout, el layout (sidebar/navbar)
  // se monta una sola vez y solo cambia el contenido al navegar (sin re-animar).
  const getLayout = Component.getLayout || ((page) => page)

  return (
    <UserProvider>
      <ReactQueryProvider>
        <AppProvider session={pageProps.session}>
          <ModalProvider>
            <Bootstrap>
              <ToastContainer />
              <PermisosProvider>
                <CampoProvider>
                  <ListModeProvider>{getLayout(<Component {...pageProps} />)}</ListModeProvider>
                </CampoProvider>
              </PermisosProvider>
            </Bootstrap>
          </ModalProvider>
        </AppProvider>
      </ReactQueryProvider>
    </UserProvider>
  )
}

export default App
