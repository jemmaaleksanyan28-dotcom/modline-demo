import { NextRequest, NextResponse } from 'next/server'
import createIntlMiddleware from 'next-intl/middleware'
import { jwtVerify } from 'jose'
import { locales, defaultLocale } from './i18n/config'

const rawJwtSecret = process.env.JWT_SECRET

const JWT_SECRET = new TextEncoder().encode(
  rawJwtSecret || 'modline-vercel-demo-secret-change-before-production'
)

const COOKIE_NAME = 'auth-token'

const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always'
})

// Routes that require authentication
const protectedRoutes = ['/profile', '/checkout']

// Routes that require admin role
const adminRoutes = ['/admin']

// Routes that should redirect to home if already authenticated
const authRoutes = ['/auth/login', '/auth/register']

async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload as { userId: string; email: string; role: 'admin' | 'user' }
  } catch {
    return null
  }
}

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Skip API routes
  if (pathname.startsWith('/api')) {
    return NextResponse.next()
  }

  // Get the locale from the URL
  const locale = locales.find(l => pathname.startsWith(`/${l}`)) || defaultLocale
  const pathWithoutLocale = pathname.replace(new RegExp(`^/${locale}`), '') || '/'

  // Get auth token
  const token = request.cookies.get(COOKIE_NAME)?.value
  const user = token ? await verifyToken(token) : null

  // Check if route is protected
  const isProtectedRoute = protectedRoutes.some(route => pathWithoutLocale.startsWith(route))
  const isAdminRoute = adminRoutes.some(route => pathWithoutLocale.startsWith(route))
  const isAuthRoute = authRoutes.some(route => pathWithoutLocale.startsWith(route))

  // Redirect to login if accessing protected route without auth
  if (isProtectedRoute && !user) {
    const loginUrl = new URL(`/${locale}/auth/login`, request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Redirect to home if accessing admin route without admin role
  if (isAdminRoute) {
    if (!user) {
      const loginUrl = new URL(`/${locale}/auth/login`, request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
    if (user.role !== 'admin') {
      return NextResponse.redirect(new URL(`/${locale}`, request.url))
    }
  }

  // Redirect to home if accessing auth routes while authenticated
  if (isAuthRoute && user) {
    return NextResponse.redirect(new URL(`/${locale}`, request.url))
  }

  // Apply internationalization middleware
  return intlMiddleware(request)
}

export const config = {
  matcher: ['/', '/(fa|en)/:path*']
}
