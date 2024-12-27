import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  const { data: { session } } = await supabase.auth.getSession()

  // URLs que requieren autenticación (ahora todo bajo /dashboard)
  const isProtectedUrl = req.nextUrl.pathname.startsWith('/dashboard')

  // URLs de autenticación
  const authUrls = ['/auth/login', '/auth/register', '/auth/onboarding']
  const isAuthUrl = authUrls.some(url => 
    req.nextUrl.pathname === url
  )

  // Si el usuario está autenticado y trata de acceder a una página de auth
  if (session && isAuthUrl) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  // Si el usuario no está autenticado y trata de acceder a una página protegida
  if (!session && isProtectedUrl) {
    return NextResponse.redirect(new URL('/auth/login', req.url))
  }

  return res
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}