import Head from 'next/head'
import { LogIn, UserPlus } from 'lucide-react'
import { DEFAULT_TITLE } from 'lib/utils/constants'

// Pantalla de ingreso. Los botones redirigen al Universal Login de Auth0
// (Google, Facebook, email/password, registro), manejado por /api/auth/*.
const SignIn = () => (
  <>
    <Head>
      <title>{`${DEFAULT_TITLE} | Ingresar`}</title>
    </Head>
    <div className="min-h-screen flex items-center justify-center bg-main-50 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-8 shadow-lg">
        <div className="mb-6 flex flex-col items-center text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-main-600 text-2xl font-bold text-white shadow-md">
            C
          </span>
          <h1 className="mt-3 text-2xl font-bold tracking-tight text-gray-800 dark:text-white">
            CAMPO <span className="text-main-600">Management</span>
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Gestión de ganadería y gastos del campo
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <a
            href="/api/auth/login"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-main-600 px-4 py-3 text-sm font-semibold text-white hover:bg-main-700"
          >
            <LogIn size={18} /> Ingresar
          </a>
          <a
            href="/api/auth/login?screen_hint=signup"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <UserPlus size={18} /> Crear cuenta
          </a>
        </div>

        <p className="mt-6 text-center text-xs text-gray-400">
          Ingreso seguro con Google, Facebook o email.
        </p>
      </div>
    </div>
  </>
)

export default SignIn
