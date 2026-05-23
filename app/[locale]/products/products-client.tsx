'use client'

import { useEffect, useState, useMemo } from 'react'
import { useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Grid3x3, LayoutList, SlidersHorizontal, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ProductCard } from '@/components/products/product-card'
import { ProductFilters } from '@/components/products/product-filters'
import { categories } from '@/lib/data/products'
import { useProductStore } from '@/lib/stores/product-store'
import { cn } from '@/lib/utils'
import type { Locale } from '@/i18n/config'
import type { FilterState, Product } from '@/lib/types'

interface ProductsClientProps {
  searchParams: { [key: string]: string | string[] | undefined }
}

export function ProductsClient({ searchParams }: ProductsClientProps) {
  const params = useParams()
  const locale = params.locale as Locale
  const t = useTranslations('filters')
  const productCatalog = useProductStore((state) => state.products)
  const setProducts = useProductStore((state) => state.setProducts)
  const brands = useMemo(() => Array.from(new Set(productCatalog.map((product) => product.brand))), [productCatalog])

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

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false)
  const [filters, setFilters] = useState<FilterState>({
    categories: searchParams.category ? [searchParams.category as string] : [],
    brands: [],
    sizes: [],
    colors: [],
    priceRange: [0, 5000000],
    gender: (searchParams.gender as string) || null,
    sortBy: 'newest'
  })

  const filteredProducts = useMemo(() => {
    let result = [...productCatalog]

    // Filter by search
    if (searchParams.search) {
      const search = (searchParams.search as string).toLowerCase()
      result = result.filter(p => 
        p.name.fa.toLowerCase().includes(search) ||
        p.name.en.toLowerCase().includes(search) ||
        p.brand.toLowerCase().includes(search)
      )
    }

    // Filter by gender
    if (filters.gender) {
      result = result.filter(p => p.gender === filters.gender || p.gender === 'unisex')
    }

    // Filter by sale
    if (searchParams.sale === 'true') {
      result = result.filter(p => p.isSale)
    }

    // Filter by new
    if (searchParams.new === 'true') {
      result = result.filter(p => p.isNew)
    }

    // Filter by categories
    if (filters.categories.length > 0) {
      result = result.filter(p => 
        filters.categories.includes(p.category) || 
        filters.categories.includes(p.subcategory)
      )
    }

    // Filter by brands
    if (filters.brands.length > 0) {
      result = result.filter(p => filters.brands.includes(p.brand))
    }

    // Filter by sizes
    if (filters.sizes.length > 0) {
      result = result.filter(p => 
        p.sizes.some(s => filters.sizes.includes(s))
      )
    }

    // Filter by price range
    result = result.filter(p => 
      p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]
    )

    // Sort
    switch (filters.sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        result.sort((a, b) => b.price - a.price)
        break
      case 'popular':
        result.sort((a, b) => b.reviewCount - a.reviewCount)
        break
      case 'newest':
      default:
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    }

    return result
  }, [filters, searchParams, productCatalog])

  const activeFilterCount = 
    filters.categories.length + 
    filters.brands.length + 
    filters.sizes.length + 
    filters.colors.length +
    (filters.gender ? 1 : 0)

  const clearFilters = () => {
    setFilters({
      categories: [],
      brands: [],
      sizes: [],
      colors: [],
      priceRange: [0, 5000000],
      gender: null,
      sortBy: 'newest'
    })
  }

  const getPageTitle = () => {
    if (searchParams.search) {
      return locale === 'fa' 
        ? `نتایج جستجو برای "${searchParams.search}"` 
        : `Search results for "${searchParams.search}"`
    }
    if (searchParams.sale === 'true') {
      return locale === 'fa' ? 'حراج' : 'Sale'
    }
    if (searchParams.new === 'true') {
      return locale === 'fa' ? 'تازه‌رسیده‌ها' : 'New Arrivals'
    }
    if (filters.gender) {
      const genderNames: Record<string, { fa: string; en: string }> = {
        women: { fa: 'زنانه', en: 'Women' },
        men: { fa: 'مردانه', en: 'Men' },
        kids: { fa: 'بچگانه', en: 'Kids' }
      }
      return genderNames[filters.gender]?.[locale] || ''
    }
    return locale === 'fa' ? 'همه محصولات' : 'All Products'
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">{getPageTitle()}</h1>
        <p className="text-muted-foreground">
          {filteredProducts.length} {t('products')}
        </p>
      </div>

      <div className="flex gap-8">
        {/* Desktop Filters */}
        <aside className="hidden lg:block w-64 shrink-0">
          <ProductFilters 
            filters={filters} 
            onFiltersChange={setFilters}
            brands={brands}
            categories={categories}
          />
        </aside>

        {/* Main Content */}
        <div className="flex-1">
          {/* Toolbar */}
          <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b">
            <div className="flex items-center gap-2">
              {/* Mobile Filter Button */}
              <Sheet open={isMobileFiltersOpen} onOpenChange={setIsMobileFiltersOpen}>
                <SheetTrigger asChild className="lg:hidden">
                  <Button variant="outline" size="sm">
                    <SlidersHorizontal className="h-4 w-4 me-2" />
                    {t('filters')}
                    {activeFilterCount > 0 && (
                      <span className="ms-2 h-5 w-5 rounded-full bg-foreground text-background text-xs flex items-center justify-center">
                        {activeFilterCount}
                      </span>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side={locale === 'fa' ? 'right' : 'left'} className="w-80">
                  <SheetHeader>
                    <SheetTitle>{t('filters')}</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <ProductFilters 
                      filters={filters} 
                      onFiltersChange={setFilters}
                      brands={brands}
                      categories={categories}
                    />
                  </div>
                </SheetContent>
              </Sheet>

              {activeFilterCount > 0 && (
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  <X className="h-4 w-4 me-1" />
                  {t('clearAll')}
                </Button>
              )}
            </div>

            <div className="flex items-center gap-3">
              {/* Sort */}
              <Select
                value={filters.sortBy}
                onValueChange={(value) => setFilters(prev => ({ ...prev, sortBy: value as FilterState['sortBy'] }))}
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder={t('sortBy')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">{t('newest')}</SelectItem>
                  <SelectItem value="popular">{t('popular')}</SelectItem>
                  <SelectItem value="price-asc">{t('priceLowToHigh')}</SelectItem>
                  <SelectItem value="price-desc">{t('priceHighToLow')}</SelectItem>
                </SelectContent>
              </Select>

              {/* View Mode */}
              <div className="hidden sm:flex border rounded-lg">
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn('rounded-none rounded-s-lg', viewMode === 'grid' && 'bg-accent')}
                  onClick={() => setViewMode('grid')}
                >
                  <Grid3x3 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn('rounded-none rounded-e-lg', viewMode === 'list' && 'bg-accent')}
                  onClick={() => setViewMode('list')}
                >
                  <LayoutList className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          {filteredProducts.length > 0 ? (
            <div className={cn(
              'grid gap-4 md:gap-6',
              viewMode === 'grid' 
                ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4' 
                : 'grid-cols-1'
            )}>
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-lg text-muted-foreground mb-4">
                {locale === 'fa' ? 'محصولی یافت نشد' : 'No products found'}
              </p>
              <Button onClick={clearFilters}>{t('clearAll')}</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
