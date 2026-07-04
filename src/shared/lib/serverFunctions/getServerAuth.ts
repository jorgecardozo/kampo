import { getSession } from '@auth0/nextjs-auth0'
import { paths } from 'lib/utils/paths'

// Auth0 se considera configurado cuando están las env mínimas.
const auth0Configured = !!(
  process.env.AUTH0_SECRET &&
  process.env.AUTH0_ISSUER_BASE_URL &&
  process.env.AUTH0_CLIENT_ID &&
  process.env.AUTH0_CLIENT_SECRET
)

export default async function getServerSideProps(ctx: any) {
  const { resolvedUrl } = ctx

  if (resolvedUrl === '/') {
    return { redirect: { permanent: false, destination: paths.dashboard.path } }
  }

  // Hasta tener Auth0 configurado, dejamos pasar (mock-first).
  if (!auth0Configured) {
    return { props: {} }
  }

  const session = await getSession(ctx.req, ctx.res)
  if (!session) {
    return { redirect: { permanent: false, destination: paths.signin.root } }
  }

  return { props: { user: session.user } }
}
