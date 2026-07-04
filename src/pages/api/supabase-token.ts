import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from '@auth0/nextjs-auth0'
import jwt from 'jsonwebtoken'

// Emite un JWT válido para Supabase (firmado con el JWT Secret del proyecto)
// a partir de la sesión de Auth0. El token lleva el email del usuario; las
// políticas RLS lo usan para mostrar solo su cuenta.
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await getSession(req, res)
    const email = session?.user?.email as string | undefined
    if (!session || !email) return res.status(401).json({ error: 'no session' })

    const secret = process.env.SUPABASE_JWT_SECRET
    if (!secret) return res.status(500).json({ error: 'missing SUPABASE_JWT_SECRET' })

    const now = Math.floor(Date.now() / 1000)
    const exp = now + 60 * 60 // 1 hora
    const token = jwt.sign(
      {
        role: 'authenticated',
        aud: 'authenticated',
        sub: session.user.sub,
        email: email.toLowerCase(),
        iat: now,
        exp,
      },
      secret
    )
    // Sin cache en el navegador: el token es sensible y de corta duración.
    res.setHeader('Cache-Control', 'no-store')
    return res.status(200).json({ token, exp })
  } catch (e) {
    return res.status(500).json({ error: 'token error' })
  }
}
