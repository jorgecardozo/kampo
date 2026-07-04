import { CategoriasView } from '@modules/gastos/categorias'
import { mainLayout } from 'layouts/mainLayout'
import { DEFAULT_TITLE } from 'lib/utils/constants'
import { paths } from 'lib/utils/paths'

const Page = () => <CategoriasView />
Page.getLayout = mainLayout(`${DEFAULT_TITLE} | ${paths.gastos.categorias.title}`)

export default Page

export { default as getServerSideProps } from 'lib/serverFunctions/getServerAuth'
