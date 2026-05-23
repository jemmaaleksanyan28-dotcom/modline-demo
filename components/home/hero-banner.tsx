'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { Locale } from '@/i18n/config'

const slides = [
  {
    id: 1,
    image: '/uploads/banners/hero-main.webp',
    title: { fa: 'استایل شیک، آماده ارسال', en: 'Curated style, ready to ship' },
    subtitle: { fa: 'فروشگاه فارسی سریع با عکس‌های واقعی و ذخیره‌شده روی سرور', en: 'Fast Persian-first store with real local images' },
    cta: { fa: 'مشاهده محصولات', en: 'Shop Products' },
    href: '/products',
    theme: 'dark'
  },
  {
    id: 2,
    image: '/uploads/banners/hero-modest-style.webp',
    title: { fa: 'کالکشن پوشیده و روزمره', en: 'Modest everyday collection' },
    subtitle: { fa: 'تصاویر کم‌ریسک برای بازار ایران، بدون وابستگی به لینک خارجی', en: 'Local, market-safe visuals without external image links' },
    cta: { fa: 'کالکشن زنانه', en: 'Women Collection' },
    href: '/products?gender=women',
    theme: 'dark'
  },
  {
    id: 3,
    image: '/uploads/banners/hero-flatlay.webp',
    title: { fa: 'محصول‌محور و سریع', en: 'Product-first and fast' },
    subtitle: { fa: 'Hero، بنر و محصول با WebP محلی برای سرعت بهتر داخل ایران', en: 'Local WebP hero, banners and products for better speed' },
    cta: { fa: 'جدیدترین‌ها', en: 'New Arrivals' },
    href: '/products?new=true',
    theme: 'dark'
  }
]

export function HeroBanner() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const params = useParams()
  const locale = params.locale as Locale

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const slide = slides[currentSlide]
  const isLight = slide.theme === 'light'

  return (
    <section className="relative h-[60vh] md:h-[80vh] overflow-hidden">
      {slides.map((s, index) => (
        <div
          key={s.id}
          className={cn(
            'absolute inset-0 transition-opacity duration-700',
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          )}
        >
          <Image
            src={s.image}
            alt={s.title[locale]}
            fill
            className="object-cover"
            priority={index === 0}
          />
          <div className={cn(
            'absolute inset-0',
            s.theme === 'dark' ? 'bg-gradient-to-l from-black/65 via-black/35 to-black/10' : 'bg-white/30'
          )} />
        </div>
      ))}

      <div className="relative h-full container mx-auto px-4 flex items-center">
        <div className={cn(
          'max-w-xl',
          locale === 'fa' ? 'text-right' : 'text-left'
        )}>
          <h1 className={cn(
            'text-4xl md:text-6xl font-bold mb-4 animate-in fade-in slide-in-from-bottom-4 duration-500',
            isLight ? 'text-foreground' : 'text-white'
          )}>
            {slide.title[locale]}
          </h1>
          <p className={cn(
            'text-xl md:text-2xl mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100',
            isLight ? 'text-foreground/80' : 'text-white/90'
          )}>
            {slide.subtitle[locale]}
          </p>
          <Button
            asChild
            size="lg"
            className={cn(
              'animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200',
              isLight 
                ? 'bg-foreground text-background hover:bg-foreground/90' 
                : 'bg-white text-foreground hover:bg-white/90'
            )}
          >
            <Link href={`/${locale}${slide.href}`}>
              {slide.cta[locale]}
            </Link>
          </Button>
        </div>
      </div>

      {/* Navigation Arrows */}
      <Button
        variant="ghost"
        size="icon"
        onClick={prevSlide}
        className="absolute start-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-white/80 hover:bg-white text-foreground"
      >
        {locale === 'fa' ? <ChevronRight className="h-6 w-6" /> : <ChevronLeft className="h-6 w-6" />}
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={nextSlide}
        className="absolute end-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-white/80 hover:bg-white text-foreground"
      >
        {locale === 'fa' ? <ChevronLeft className="h-6 w-6" /> : <ChevronRight className="h-6 w-6" />}
      </Button>

      {/* Dots */}
      <div className="absolute bottom-6 start-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={cn(
              'h-2 rounded-full transition-all',
              index === currentSlide ? 'w-8 bg-white' : 'w-2 bg-white/50 hover:bg-white/70'
            )}
          />
        ))}
      </div>
    </section>
  )
}
