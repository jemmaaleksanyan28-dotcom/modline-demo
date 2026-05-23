'use client'

import { useState, useEffect, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Search, X } from 'lucide-react'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useProductStore } from '@/lib/stores/product-store'
import { formatPrice, getLocalizedString } from '@/lib/format'
import type { Locale } from '@/i18n/config'
import type { Product } from '@/lib/types'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'

interface SearchDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const t = useTranslations('common')
  const params = useParams()
  const router = useRouter()
  const locale = params.locale as Locale
  
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Product[]>([])
  const products = useProductStore((state) => state.products)
  const setProducts = useProductStore((state) => state.setProducts)

  useEffect(() => {
    let alive = true
    fetch('/api/products')
      .then((response) => response.ok ? response.json() : null)
      .then((data) => {
        if (alive && data?.products) setProducts(data.products)
      })
      .catch(() => undefined)
    return () => { alive = false }
  }, [setProducts])

  useEffect(() => {
    if (query.length >= 2) {
      const searchLower = query.toLowerCase()
      const searchResults = products.filter((product) =>
        product.name[locale].toLowerCase().includes(searchLower) ||
        product.description[locale].toLowerCase().includes(searchLower) ||
        product.brand.toLowerCase().includes(searchLower) ||
        product.tags.some((tag) => tag.toLowerCase().includes(searchLower))
      )
      setResults(searchResults.slice(0, 6))
    } else {
      setResults([])
    }
  }, [query, locale, products])

  const handleSelect = (productId: string) => {
    onOpenChange(false)
    setQuery('')
    router.push(`/${locale}/products/${productId}`)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      onOpenChange(false)
      router.push(`/${locale}/products?search=${encodeURIComponent(query)}`)
      setQuery('')
    }
  }

  const popularProducts = useMemo(() => products.slice(0, 4), [products])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 gap-0">
        <VisuallyHidden>
          <DialogTitle>{t('search')}</DialogTitle>
        </VisuallyHidden>
        <form onSubmit={handleSearch} className="border-b p-4">
          <div className="flex items-center gap-3">
            <Search className="h-5 w-5 text-muted-foreground shrink-0" />
            <Input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="border-0 p-0 h-auto text-lg focus-visible:ring-0 placeholder:text-muted-foreground"
              autoFocus
            />
            {query && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="shrink-0"
                onClick={() => setQuery('')}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </form>

        <div className="max-h-[60vh] overflow-y-auto p-4">
          {results.length > 0 ? (
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground">
                {locale === 'fa' ? 'نتایج جستجو' : 'Search Results'}
              </h3>
              <div className="grid gap-2">
                {results.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => handleSelect(product.id)}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent text-start w-full transition-colors"
                  >
                    <div className="relative h-16 w-12 rounded overflow-hidden bg-muted shrink-0">
                      <Image
                        src={product.images[0]}
                        alt={getLocalizedString(product.name, locale)}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">
                        {getLocalizedString(product.name, locale)}
                      </p>
                      <p className="text-sm text-muted-foreground">{product.brand}</p>
                    </div>
                    <div className="text-end shrink-0">
                      <p className="font-semibold">{formatPrice(product.price, locale)}</p>
                      {product.originalPrice && (
                        <p className="text-sm text-muted-foreground line-through">
                          {formatPrice(product.originalPrice, locale)}
                        </p>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : query.length >= 2 ? (
            <div className="text-center py-8 text-muted-foreground">
              {t('noResults')}
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground">
                {locale === 'fa' ? 'محصولات محبوب' : 'Popular Products'}
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {popularProducts.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => handleSelect(product.id)}
                    className="text-start group"
                  >
                    <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-muted mb-2">
                      <Image
                        src={product.images[0]}
                        alt={getLocalizedString(product.name, locale)}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <p className="text-sm font-medium truncate">
                      {getLocalizedString(product.name, locale)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formatPrice(product.price, locale)}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
