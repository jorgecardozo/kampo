import { AnimalesView } from '@modules/ganaderia/animales'
import { mainLayout } from 'layouts/mainLayout'
import { DEFAULT_TITLE } from 'lib/utils/constants'
import { paths } from 'lib/utils/paths'

const Page = () => <AnimalesView />
Page.getLayout = mainLayout(`${DEFAULT_TITLE} | ${paths.ganaderia.animales.title}`)

export default Page

export { default as getServerSideProps } from 'lib/serverFunctions/getServerAuth'
