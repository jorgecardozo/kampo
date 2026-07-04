import { UsuariosView } from '@modules/configuracion/usuarios'
import { mainLayout } from 'layouts/mainLayout'
import { DEFAULT_TITLE } from 'lib/utils/constants'
import { paths } from 'lib/utils/paths'

const Page = () => <UsuariosView />
Page.getLayout = mainLayout(`${DEFAULT_TITLE} | ${paths.usuariosCampo.title}`)

export default Page

export { default as getServerSideProps } from 'lib/serverFunctions/getServerAuth'
