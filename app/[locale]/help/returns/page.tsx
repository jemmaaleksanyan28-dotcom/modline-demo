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
      <h1 className="text-3xl font-bold mb-4">{isFa ? 'مرجوعی کالا' : 'Returns'}</h1>
      <p className="text-muted-foreground leading-8">{isFa ? 'شرایط مرجوعی باید مطابق سیاست فروشگاه شما نهایی شود. در نسخه عملیاتی، سفارش‌های مرجوعی باید به پنل ادمین و وضعیت سفارش وصل شوند.' : 'Return conditions should be finalized according to your store policy. In production, return requests should connect to admin order status workflows.'}</p>
    </main>
  )
}
