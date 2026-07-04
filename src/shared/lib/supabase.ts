import { createClient } from '@supabase/supabase-js'

// Cliente Supabase (REST autogenerada sobre Postgres).
// Usa la anon key pública como apikey, y adjunta un token de Supabase firmado
// con la identidad de Auth0 (ruta /api/supabase-token) para que la RLS
// identifique al usuario y le muestre solo su cuenta.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabaseConfigured = !!(url && anonKey)

// Cache del token en memoria (se renueva antes de expirar).
let _token: string | null = null
let _exp = 0
let _inflight: Promise<string | null> | null = null

const fetchToken = async (): Promise<string | null> => {
  try {
    const r = await fetch('/api/supabase-token')
    if (!r.ok) return null
    const { token, exp } = await r.json()
    _token = token
    _exp = exp
    return token
  } catch {
    return null
  } finally {
    _inflight = null
  }
}

const getAccessToken = async (): Promise<string | null> => {
  if (typeof window === 'undefined') return null // SSR: sin token (queries del server no usadas)
  const now = Math.floor(Date.now() / 1000)
  if (_token && _exp - 60 > now) return _token
  if (!_inflight) _inflight = fetchToken()
  return _inflight
}

export const supabase = createClient(url ?? 'http://localhost', anonKey ?? 'anon', {
  auth: { persistSession: false },
  accessToken: getAccessToken,
})
