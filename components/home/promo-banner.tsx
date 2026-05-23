'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import type { Locale } from '@/i18n/config'

export function PromoBanner() {
  const params = useParams()
  const locale = params.locale as Locale
  const t = useTranslations('home')

  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Women Promo */}
          <Link href={`/${locale}/products?gender=women&sale=true`} className="group relative overflow-hidden rounded-lg aspect-[4/3]">
            <Image
              src="/uploads/banners/collection-women.webp"
              alt="Women Sale"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-6">
              <p className="text-sm uppercase tracking-wider mb-2">{t('saleSection')}</p>
              <h3 className="text-3xl md:text-4xl font-bold mb-2">
                {t('upTo')} 50% {t('discountOff')}
              </h3>
              <p className="text-lg mb-4">{locale === 'fa' ? 'زنانه' : 'Women'}</p>
              <Button variant="secondary" size="lg">
                {t('shopWomen')}
              </Button>
            </div>
          </Link>

          {/* Men Promo */}
          <Link href={`/${locale}/products?gender=men&sale=true`} className="group relative overflow-hidden rounded-lg aspect-[4/3]">
            <Image
              src="/uploads/banners/collection-men.webp"
              alt="Men Sale"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-6">
              <p className="text-sm uppercase tracking-wider mb-2">{t('saleSection')}</p>
              <h3 className="text-3xl md:text-4xl font-bold mb-2">
                {t('upTo')} 40% {t('discountOff')}
              </h3>
              <p className="text-lg mb-4">{locale === 'fa' ? 'مردانه' : 'Men'}</p>
              <Button variant="secondary" size="lg">
                {t('shopMen')}
              </Button>
            </div>
          </Link>
        </div>
      </div>
    </section>
  )
}
