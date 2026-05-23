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
      <h1 className="text-3xl font-bold mb-4">{isFa ? 'ارسال سفارش' : 'Shipping'}</h1>
      <p className="text-muted-foreground leading-8">{isFa ? 'ارسال سفارش‌ها بر اساس آدرس مشتری، مبلغ خرید و تنظیمات فروشگاه انجام می‌شود. ارسال رایگان برای خریدهای بالای ۵۰۰ هزار تومان فعال است.' : 'Orders are shipped based on customer address, cart total, and store settings. Free shipping is enabled for orders over 500,000 Toman.'}</p>
    </main>
  )
}
