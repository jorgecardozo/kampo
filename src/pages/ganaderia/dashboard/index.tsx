import { GanaderiaDashboardView } from '@modules/ganaderia/dashboard'
import { mainLayout } from 'layouts/mainLayout'
import { DEFAULT_TITLE } from 'lib/utils/constants'
import { paths } from 'lib/utils/paths'

const Page = () => <GanaderiaDashboardView />
Page.getLayout = mainLayout(`${DEFAULT_TITLE} | ${paths.ganaderia.dashboard.title}`)

export default Page

export { default as getServerSideProps } from 'lib/serverFunctions/getServerAuth'
