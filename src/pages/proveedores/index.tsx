import ProveedoresView from 'views/Proveedores'
import { mainLayout } from 'layouts/mainLayout'
import { DEFAULT_TITLE } from 'lib/utils/constants'
import { paths } from 'lib/utils/paths'

const Page = () => <ProveedoresView />
Page.getLayout = mainLayout(`${DEFAULT_TITLE} | ${paths.proveedores.title}`)

export default Page

export { default as getServerSideProps } from 'lib/serverFunctions/getServerAuth'
