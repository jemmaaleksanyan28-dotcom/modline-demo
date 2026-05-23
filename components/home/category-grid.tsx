'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { ArrowRight, ArrowLeft } from 'lucide-react'
import type { Locale } from '@/i18n/config'

export function CategoryGrid() {
  const params = useParams()
  const locale = params.locale as Locale
  const t = useTranslations('nav')

  const categoryCards = [
    {
      id: 'women',
      image: '/images/fashion/category-1.webp',
      label: t('women'),
      href: '/products?gender=women'
    },
    {
      id: 'men',
      image: '/images/fashion/category-2.webp',
      label: t('men'),
      href: '/products?gender=men'
    },
    {
      id: 'kids',
      image: '/images/fashion/category-3.webp',
      label: t('kids'),
      href: '/products?gender=kids'
    },
    {
      id: 'sale',
      image: '/images/fashion/category-4.webp',
      label: t('sale'),
      href: '/products?sale=true',
      accent: true
    }
  ]

  const Arrow = locale === 'fa' ? ArrowLeft : ArrowRight

  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {categoryCards.map((category) => (
            <Link
              key={category.id}
              href={`/${locale}${category.href}`}
              className="group relative aspect-[3/4] overflow-hidden rounded-lg"
            >
              <Image
                src={category.image}
                alt={category.label}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4 md:p-6">
                <h3 className={`text-xl md:text-2xl font-bold text-white mb-2 ${category.accent ? 'text-red-400' : ''}`}>
                  {category.label}
                </h3>
                <div className="flex items-center gap-2 text-white/80 text-sm group-hover:text-white transition-colors">
                  <span>{locale === 'fa' ? 'مشاهده' : 'Shop Now'}</span>
                  <Arrow className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
