import { GastosView } from '@modules/gastos/gastos'
import { mainLayout } from 'layouts/mainLayout'
import { DEFAULT_TITLE } from 'lib/utils/constants'
import { paths } from 'lib/utils/paths'

const Page = () => <GastosView />
Page.getLayout = mainLayout(`${DEFAULT_TITLE} | ${paths.gastos.lista.title}`)

export default Page

export { default as getServerSideProps } from 'lib/serverFunctions/getServerAuth'
