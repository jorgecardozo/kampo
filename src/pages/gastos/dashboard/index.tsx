import { GastosDashboardView } from '@modules/gastos/dashboard'
import { mainLayout } from 'layouts/mainLayout'
import { DEFAULT_TITLE } from 'lib/utils/constants'
import { paths } from 'lib/utils/paths'

const Page = () => <GastosDashboardView />
Page.getLayout = mainLayout(`${DEFAULT_TITLE} | ${paths.gastos.dashboard.title}`)

export default Page

export { default as getServerSideProps } from 'lib/serverFunctions/getServerAuth'
