import { setRequestLocale } from 'next-intl/server'
import { ProductsClient } from './products-client'
import type { Locale } from '@/i18n/config'

interface ProductsPageProps {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function ProductsPage({ params, searchParams }: ProductsPageProps) {
  const { locale } = await params
  const search = await searchParams
  setRequestLocale(locale)
  
  return <ProductsClient searchParams={search} />
}
