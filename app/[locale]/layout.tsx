import type { Metadata, Viewport } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import localFont from 'next/font/local'
import { locales, localeDirection, type Locale } from '@/i18n/config'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { CartSheet } from '@/components/cart/cart-sheet'
import { Toaster } from 'sonner'
import { AuthProvider } from '@/components/providers/auth-provider'
import '../globals.css'

const vazirmatn = localFont({
  src: [
    {
      path: '../../public/fonts/Vazirmatn-Regular.woff2',
      weight: '400',
      style: 'normal'
    },
    {
      path: '../../public/fonts/Vazirmatn-Medium.woff2',
      weight: '500',
      style: 'normal'
    },
    {
      path: '../../public/fonts/Vazirmatn-Bold.woff2',
      weight: '700',
      style: 'normal'
    }
  ],
  variable: '--font-vazirmatn',
  display: 'swap'
})

export const metadata: Metadata = {
  title: {
    default: 'مدلاین | خرید آنلاین لباس و مد',
    template: '%s | مدلاین'
  },
  description: 'بزرگترین فروشگاه آنلاین مد و پوشاک با جدیدترین محصولات زنانه، مردانه و بچگانه'
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#2d2d2d'
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

interface LocaleLayoutProps {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params
  
  if (!locales.includes(locale as Locale)) {
    notFound()
  }
  
  setRequestLocale(locale)
  const messages = await getMessages()
  const direction = localeDirection[locale as Locale]

  return (
    <html lang={locale} dir={direction} className="bg-background">
      <body className={`${vazirmatn.variable} font-vazirmatn antialiased min-h-screen flex flex-col`}>
        <NextIntlClientProvider messages={messages}>
          <AuthProvider>
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
            <CartSheet />
            <Toaster 
              position={direction === 'rtl' ? 'top-left' : 'top-right'}
              richColors
              closeButton
            />
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
