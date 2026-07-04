import { PreciosView } from '@modules/ganaderia/precios'
import { mainLayout } from 'layouts/mainLayout'
import { DEFAULT_TITLE } from 'lib/utils/constants'
import { paths } from 'lib/utils/paths'

const Page = () => <PreciosView />
Page.getLayout = mainLayout(`${DEFAULT_TITLE} | ${paths.ganaderia.precios.title}`)

export default Page

export { default as getServerSideProps } from 'lib/serverFunctions/getServerAuth'
