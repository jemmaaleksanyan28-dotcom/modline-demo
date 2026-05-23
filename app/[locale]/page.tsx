import { setRequestLocale } from 'next-intl/server'
import { HeroBanner } from '@/components/home/hero-banner'
import { CategoryGrid } from '@/components/home/category-grid'
import { TrendingProducts } from '@/components/home/trending-products'
import { PromoBanner } from '@/components/home/promo-banner'
import { NewArrivals } from '@/components/home/new-arrivals'
import type { Locale } from '@/i18n/config'

interface HomePageProps {
  params: Promise<{ locale: string }>
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params
  setRequestLocale(locale)
  
  return (
    <div>
      <HeroBanner />
      <CategoryGrid />
      <TrendingProducts />
      <PromoBanner />
      <NewArrivals />
    </div>
  )
}
