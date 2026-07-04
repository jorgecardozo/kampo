import PerfilView from 'views/Perfil'
import { mainLayout } from 'layouts/mainLayout'
import { DEFAULT_TITLE } from 'lib/utils/constants'
import { paths } from 'lib/utils/paths'

const Page = () => <PerfilView />
Page.getLayout = mainLayout(`${DEFAULT_TITLE} | ${paths.perfil.title}`)

export default Page

export { default as getServerSideProps } from 'lib/serverFunctions/getServerAuth'
