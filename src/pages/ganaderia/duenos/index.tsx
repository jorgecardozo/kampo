import { DuenosView } from '@modules/ganaderia/duenos'
import { mainLayout } from 'layouts/mainLayout'
import { DEFAULT_TITLE } from 'lib/utils/constants'
import { paths } from 'lib/utils/paths'

const Page = () => <DuenosView />
Page.getLayout = mainLayout(`${DEFAULT_TITLE} | ${paths.ganaderia.duenos.title}`)

export default Page

export { default as getServerSideProps } from 'lib/serverFunctions/getServerAuth'
