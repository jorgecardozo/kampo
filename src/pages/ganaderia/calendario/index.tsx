import { CalendarioSanitarioView } from '@modules/ganaderia/calendario-sanitario'
import { mainLayout } from 'layouts/mainLayout'
import { DEFAULT_TITLE } from 'lib/utils/constants'
import { paths } from 'lib/utils/paths'

const Page = () => <CalendarioSanitarioView />
Page.getLayout = mainLayout(`${DEFAULT_TITLE} | ${paths.ganaderia.calendario.title}`)

export default Page

export { default as getServerSideProps } from 'lib/serverFunctions/getServerAuth'
