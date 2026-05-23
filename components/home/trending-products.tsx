'use client'

import { useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { ArrowRight, ArrowLeft } from 'lucide-react'
import { ProductCard } from '@/components/products/product-card'
import { products } from '@/lib/data/products'
import type { Locale } from '@/i18n/config'

export function TrendingProducts() {
  const params = useParams()
  const locale = params.locale as Locale
  const t = useTranslations('home')
  const tCommon = useTranslations('common')

  const trendingProducts = products
    .sort((a, b) => b.reviewCount - a.reviewCount)
    .slice(0, 8)

  const Arrow = locale === 'fa' ? ArrowLeft : ArrowRight

  return (
    <section className="py-12 md:py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold">{t('trending')}</h2>
          <Link 
            href={`/${locale}/products?sort=popular`}
            className="flex items-center gap-2 text-sm font-medium hover:underline"
          >
            {tCommon('viewAll')}
            <Arrow className="h-4 w-4" />
          </Link>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {trendingProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}
