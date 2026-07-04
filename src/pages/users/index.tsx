import UsersView from 'views/Users'
import { mainLayout } from 'layouts/mainLayout'
import { DEFAULT_TITLE } from 'lib/utils/constants'
import { paths } from 'lib/utils/paths'

const Page = () => <UsersView />
Page.getLayout = mainLayout(`${DEFAULT_TITLE} | ${paths.users.title}`)

export default Page

export { default as getServerSideProps } from 'lib/serverFunctions/getServerAuth'
