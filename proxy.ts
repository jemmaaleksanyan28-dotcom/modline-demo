import createMiddleware from 'next-intl/middleware'
import { defaultLocale, locales } from './i18n/config'

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always',
  localeDetection: false,
})

export function proxy(request: Request) {
  return intlMiddleware(request)
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
}
