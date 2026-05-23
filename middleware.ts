import createMiddleware from 'next-intl/middleware'
import { defaultLocale, locales } from './i18n/config'

export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always',
  localeDetection: false,
})

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
}
