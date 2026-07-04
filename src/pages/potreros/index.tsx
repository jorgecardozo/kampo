import { PotrerosView } from '@modules/configuracion/potreros'
import { mainLayout } from 'layouts/mainLayout'
import { DEFAULT_TITLE } from 'lib/utils/constants'
import { paths } from 'lib/utils/paths'

const Page = () => <PotrerosView />
Page.getLayout = mainLayout(`${DEFAULT_TITLE} | ${paths.potreros.title}`)

export default Page

export { default as getServerSideProps } from 'lib/serverFunctions/getServerAuth'
