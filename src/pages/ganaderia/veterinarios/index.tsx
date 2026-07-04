import { VeterinariosView } from '@modules/ganaderia/veterinarios'
import { mainLayout } from 'layouts/mainLayout'
import { DEFAULT_TITLE } from 'lib/utils/constants'
import { paths } from 'lib/utils/paths'

const Page = () => <VeterinariosView />
Page.getLayout = mainLayout(`${DEFAULT_TITLE} | ${paths.ganaderia.veterinarios.title}`)

export default Page

export { default as getServerSideProps } from 'lib/serverFunctions/getServerAuth'
