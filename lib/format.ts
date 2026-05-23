import type { Locale } from '@/i18n/config'

export function normalizeLocale(locale: Locale | string | undefined): Locale {
  return locale === 'en' ? 'en' : 'fa'
}
import type { LocalizedString } from './types'

export function formatPrice(price: number, locale: Locale | string | undefined = 'fa'): string {
  const safeLocale = normalizeLocale(locale)
  const formatted = new Intl.NumberFormat(safeLocale === 'fa' ? 'fa-IR' : 'en-US').format(price)
  return safeLocale === 'fa' ? `${formatted} تومان` : `${formatted} Toman`
}

export function formatPriceShort(price: number, locale: Locale | string | undefined = 'fa'): string {
  const safeLocale = normalizeLocale(locale)
  return new Intl.NumberFormat(safeLocale === 'fa' ? 'fa-IR' : 'en-US').format(price)
}

export function getLocalizedString(str: LocalizedString, locale: Locale | string | undefined): string {
  const safeLocale = normalizeLocale(locale)
  return str[safeLocale] || str.en || str.fa
}

export function calculateDiscount(originalPrice: number, salePrice: number): number {
  return Math.round(((originalPrice - salePrice) / originalPrice) * 100)
}

export function formatDate(dateString: string, locale: Locale | string | undefined = 'fa'): string {
  const safeLocale = normalizeLocale(locale)
  const date = new Date(dateString)
  return new Intl.DateTimeFormat(safeLocale === 'fa' ? 'fa-IR' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date)
}
