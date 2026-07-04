// Utils
import { paths } from 'lib/utils/paths'

export default async function getServerSideProps() {
  return {
    redirect: {
      destination: paths.dashboard.path,
      permanent: false,
    },
  }
}
