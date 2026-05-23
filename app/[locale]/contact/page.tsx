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
      <h1 className="text-3xl font-bold mb-4">{isFa ? 'تماس با ما' : 'Contact us'}</h1>
      <p className="text-muted-foreground leading-8">{isFa ? 'برای پشتیبانی سفارش، همکاری یا سوالات فروش می‌توانید از طریق ایمیل info@modline.local یا تلفن فروشگاه در تنظیمات ادمین اقدام کنید.' : 'For order support, partnerships, or sales questions, contact info@modline.local or the store phone configured in admin settings.'}</p>
    </main>
  )
}
