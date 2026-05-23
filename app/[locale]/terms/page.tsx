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
      <h1 className="text-3xl font-bold mb-4">{isFa ? 'قوانین و مقررات' : 'Terms and Conditions'}</h1>
      <p className="text-muted-foreground leading-8">{isFa ? 'ثبت سفارش به معنی پذیرش قیمت، وضعیت موجودی، قوانین ارسال و شرایط مرجوعی فروشگاه است. متن نهایی حقوقی باید پیش از لانچ رسمی تکمیل شود.' : 'Placing an order means accepting store pricing, stock status, shipping rules, and returns conditions. Final legal text should be completed before public launch.'}</p>
    </main>
  )
}
