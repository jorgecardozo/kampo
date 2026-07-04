import NotificationsView from 'views/Notifications'
import { mainLayout } from 'layouts/mainLayout'
import { DEFAULT_TITLE } from 'lib/utils/constants'
import { paths } from 'lib/utils/paths'

const Page = () => <NotificationsView />
Page.getLayout = mainLayout(`${DEFAULT_TITLE} | ${paths.notifications.title}`)

export default Page

export { default as getServerSideProps } from 'lib/serverFunctions/getServerAuth'
