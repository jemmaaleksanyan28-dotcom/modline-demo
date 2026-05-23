import { setRequestLocale } from 'next-intl/server'
import { catalogStore } from '@/lib/server/catalog-store'
import { ProductDetailClient } from './product-detail-client'

export const dynamic = 'force-dynamic'

interface ProductPageProps {
  params: Promise<{ locale: string; id: string }>
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { locale, id } = await params
  setRequestLocale(locale)

  const initialProduct = catalogStore.get(id)
  return (
    <ProductDetailClient
      productId={id}
      initialProduct={initialProduct}
    />
  )
}
