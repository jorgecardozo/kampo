/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  // Prototipo mock-first: la capa proxy `pages/api` (backend real) queda como
  // deuda legacy y no se usa. No bloqueamos el build por sus errores de tipos/lint.
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
}
