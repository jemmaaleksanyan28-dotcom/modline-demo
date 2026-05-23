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
      <h1 className="text-3xl font-bold mb-4">{isFa ? 'درباره مدلاین' : 'About Modline'}</h1>
      <p className="text-muted-foreground leading-8">{isFa ? 'مدلاین یک فروشگاه آنلاین مد فارسی‌محور است که برای اجرا در زیرساخت ایران آماده شده است. تمرکز ما روی سرعت، تجربه خرید ساده، پرداخت ایرانی و مدیریت عملیاتی سفارش‌هاست.' : 'Modline is a Persian-first online fashion storefront designed for fast local deployment, Iranian payment flow, and practical order management.'}</p>
    </main>
  )
}
