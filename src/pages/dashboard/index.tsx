import { GeneralDashboardView } from '@modules/finanzas/dashboard'
import { mainLayout } from 'layouts/mainLayout'
import { DEFAULT_TITLE } from 'lib/utils/constants'
import { paths } from 'lib/utils/paths'

const Page = () => <GeneralDashboardView />
Page.getLayout = mainLayout(`${DEFAULT_TITLE} | ${paths.dashboard.title}`)

export default Page

export { default as getServerSideProps } from 'lib/serverFunctions/getServerAuth'
