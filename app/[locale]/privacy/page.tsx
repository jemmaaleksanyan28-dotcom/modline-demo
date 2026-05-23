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
      <h1 className="text-3xl font-bold mb-4">{isFa ? 'حریم خصوصی' : 'Privacy Policy'}</h1>
      <p className="text-muted-foreground leading-8">{isFa ? 'اطلاعات حساب، آدرس و سفارش فقط برای پردازش خرید، پشتیبانی و ارسال استفاده می‌شود. در نسخه production باید سیاست حریم خصوصی نهایی با قوانین کسب‌وکار شما تکمیل شود.' : 'Account, address, and order data are used only for checkout, support, and shipping. In production, finalize this policy according to your business rules.'}</p>
    </main>
  )
}
