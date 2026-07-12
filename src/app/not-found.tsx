import Link from "next/link";
import { paths } from "lib/utils/paths";

// 404 global.
export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-main-50 px-6 text-center dark:bg-gray-900">
      <p className="text-6xl font-bold text-main-600">404</p>
      <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">Esta página no existe</h1>
      <p className="max-w-sm text-sm text-gray-500 dark:text-gray-400">
        Puede que el enlace esté roto o que la página se haya movido.
      </p>
      <Link
        href={paths.dashboard.path}
        className="mt-2 inline-block rounded-lg bg-main-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-main-700"
      >
        Ir al dashboard
      </Link>
    </div>
  );
}
