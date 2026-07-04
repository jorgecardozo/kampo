// Libraries
import Head from 'next/head'

// Interfaces
import { LayoutProps } from './types'

// Utils
import { DEFAULT_TITLE } from 'lib/utils/constants'
import Layout from './components/Layout'

const MainFull = ({ component: Component, pageTitle, children }: LayoutProps) => {
  const title = pageTitle || DEFAULT_TITLE

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>

      <Layout withPadding={true}>
        {children ?? (Component ? <Component /> : null)}
      </Layout>
    </>
  )
}

export default MainFull
