import { SuperAdminView } from '@modules/superadmin'
import { mainLayout } from 'layouts/mainLayout'
import { DEFAULT_TITLE } from 'lib/utils/constants'
import { paths } from 'lib/utils/paths'

const Page = () => <SuperAdminView />
Page.getLayout = mainLayout(`${DEFAULT_TITLE} | ${paths.superadmin.title}`)

export default Page

export { default as getServerSideProps } from 'lib/serverFunctions/getServerAuth'
