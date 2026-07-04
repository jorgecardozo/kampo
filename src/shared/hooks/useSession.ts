// Sesión: ahora la maneja Auth0 (login/logout en /api/auth/*).
// Este hook quedó como utilidad mínima para el logout y compatibilidad.
export const useSession = () => {
  const logout = () => {
    if (typeof window !== 'undefined') {
      window.location.href = '/api/auth/logout'
    }
  }

  // Stubs sin efecto (la expiración la maneja Auth0).
  const noop = async () => {}

  return {
    logout,
    hasJwt: () => undefined,
    isExpired: async () => false,
    refreshToken: noop,
    setSessionInterval: noop,
    checkSessionExpired: noop,
    clearIntervalSession: () => {},
  }
}
