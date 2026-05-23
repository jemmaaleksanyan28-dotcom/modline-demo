import { setRequestLocale } from 'next-intl/server'

interface PageProps {
  params: Promise<{ locale: string }>
}

export default async function Page({ params }: PageProps) {
  const { locale } = await params
  setRequestLocale(locale)
  const isFa = locale === 'fa'

  return (
    <main className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-3xl font-bold mb-4">{isFa ? 'سوالات متداول' : 'FAQ'}</h1>
      <p className="text-muted-foreground leading-8">{isFa ? 'پرسش‌های پرتکرار درباره خرید، پرداخت، ارسال و مرجوعی در این بخش قرار می‌گیرد. این صفحه برای جلوگیری از لینک بن‌بست آماده شده است.' : 'Common questions about shopping, payment, shipping, and returns will be shown here. This page prevents dead-end footer links.'}</p>
    </main>
  )
}
