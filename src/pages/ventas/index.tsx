import { VentasView } from '@modules/finanzas/ventas'
import { mainLayout } from 'layouts/mainLayout'
import { DEFAULT_TITLE } from 'lib/utils/constants'
import { paths } from 'lib/utils/paths'

const Page = () => <VentasView />
Page.getLayout = mainLayout(`${DEFAULT_TITLE} | ${paths.ventas.title}`)

export default Page

export { default as getServerSideProps } from 'lib/serverFunctions/getServerAuth'
