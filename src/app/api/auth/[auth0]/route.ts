// Rutas de Auth0 en App Router: /api/auth/{login,logout,callback,me}
import { handleAuth } from "@auth0/nextjs-auth0";

export const GET = handleAuth();
