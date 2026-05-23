'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Heart, Minus, Plus, Star, Truck, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ProductCard } from '@/components/products/product-card'
import { useCartStore } from '@/lib/stores/cart-store'
import { useProductStore } from '@/lib/stores/product-store'
import { useWishlistStore } from '@/lib/stores/wishlist-store'
import { formatPrice, getLocalizedString, calculateDiscount } from '@/lib/format'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import type { Product } from '@/lib/types'
import type { Locale } from '@/i18n/config'

interface ProductDetailClientProps {
  productId: string
  initialProduct: Product | null
}

export function ProductDetailClient({ productId, initialProduct }: ProductDetailClientProps) {
  const params = useParams()
  const locale = params.locale as Locale
  const t = useTranslations('product')
  const storedProduct = useProductStore((state) => state.getProductById(productId))
  const setProducts = useProductStore((state) => state.setProducts)
  const product = storedProduct || initialProduct
  const dynamicRelatedProducts = useProductStore((state) => state.products)
  const finalRelatedProducts = useMemo(() => {
    if (!product) return []
    return dynamicRelatedProducts
      .filter((item) => item.id !== product.id && (item.category === product.category || item.gender === product.gender))
      .slice(0, 4)
  }, [dynamicRelatedProducts, product])

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

  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [selectedColor, setSelectedColor] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const { addItem, setIsOpen } = useCartStore()
  const { hasItem, toggleItem } = useWishlistStore()

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-3">{locale === 'fa' ? 'محصول پیدا نشد' : 'Product not found'}</h1>
        <p className="text-muted-foreground mb-6">{locale === 'fa' ? 'این محصول حذف شده یا هنوز در کاتالوگ ثبت نشده است.' : 'This product was removed or is not available in the catalog.'}</p>
        <Button asChild>
          <Link href={`/${locale}/products`}>{locale === 'fa' ? 'بازگشت به محصولات' : 'Back to products'}</Link>
        </Button>
      </div>
    )
  }

  const activeColor = selectedColor || product.colors[0]?.hex || null
  const isWishlisted = hasItem(product.id)

  const discount = product.originalPrice 
    ? calculateDiscount(product.originalPrice, product.price) 
    : 0

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error(t('selectSize'))
      return
    }
    if (!activeColor) {
      toast.error(t('selectColor'))
      return
    }
    
    const colorName = product.colors.find(c => c.hex === activeColor)?.name[locale] || activeColor
    addItem(product, selectedSize, colorName, quantity)
    toast.success(t('addedToCart'))
    setIsOpen(true)
  }

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % product.images.length)
  }

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + product.images.length) % product.images.length)
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <nav className="text-sm text-muted-foreground mb-6">
        <Link href={`/${locale}`} className="hover:text-foreground">
          {locale === 'fa' ? 'خانه' : 'Home'}
        </Link>
        <span className="mx-2">/</span>
        <Link href={`/${locale}/products`} className="hover:text-foreground">
          {locale === 'fa' ? 'محصولات' : 'Products'}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{getLocalizedString(product.name, locale)}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-muted">
            <Image
              src={product.images[selectedImage]}
              alt={getLocalizedString(product.name, locale)}
              fill
              className="object-cover"
              priority
            />
            
            {/* Badges */}
            <div className="absolute top-4 start-4 flex flex-col gap-2">
              {product.isNew && (
                <Badge className="bg-foreground text-background">
                  {locale === 'fa' ? 'جدید' : 'NEW'}
                </Badge>
              )}
              {product.isSale && discount > 0 && (
                <Badge className="bg-red-500 text-white">
                  {locale === 'fa' ? `${discount}% تخفیف` : `${discount}% OFF`}
                </Badge>
              )}
            </div>

            {/* Navigation Arrows */}
            {product.images.length > 1 && (
              <>
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute start-2 top-1/2 -translate-y-1/2 rounded-full"
                  onClick={prevImage}
                >
                  {locale === 'fa' ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute end-2 top-1/2 -translate-y-1/2 rounded-full"
                  onClick={nextImage}
                >
                  {locale === 'fa' ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
                </Button>
              </>
            )}
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={cn(
                    'relative w-20 h-24 shrink-0 rounded-md overflow-hidden border-2 transition-all',
                    selectedImage === index ? 'border-foreground' : 'border-transparent hover:border-muted-foreground'
                  )}
                >
                  <Image
                    src={image}
                    alt={`${getLocalizedString(product.name, locale)} ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <p className="text-sm text-muted-foreground mb-1">{product.brand}</p>
            <h1 className="text-2xl md:text-3xl font-bold mb-3">
              {getLocalizedString(product.name, locale)}
            </h1>
            
            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={cn(
                      'h-4 w-4',
                      star <= Math.round(product.rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-muted-foreground'
                    )}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                ({product.reviewCount} {locale === 'fa' ? 'نظر' : 'reviews'})
              </span>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="text-2xl font-bold">{formatPrice(product.price, locale)}</span>
            {product.originalPrice && (
              <span className="text-lg text-muted-foreground line-through">
                {formatPrice(product.originalPrice, locale)}
              </span>
            )}
          </div>

          <Separator />

          {/* Color Selection */}
          <div>
            <p className="text-sm font-medium mb-3">
              {t('color')}: {product.colors.find(c => c.hex === activeColor)?.name[locale]}
            </p>
            <div className="flex gap-2">
              {product.colors.map((color) => (
                <button
                  key={color.hex}
                  onClick={() => setSelectedColor(color.hex)}
                  className={cn(
                    'w-10 h-10 rounded-full border-2 transition-all',
                    activeColor === color.hex
                      ? 'ring-2 ring-foreground ring-offset-2'
                      : 'hover:scale-110'
                  )}
                  style={{ backgroundColor: color.hex }}
                  title={getLocalizedString(color.name, locale)}
                />
              ))}
            </div>
          </div>

          {/* Size Selection */}
          <div>
            <p className="text-sm font-medium mb-3">{t('size')}</p>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={cn(
                    'px-4 py-2 text-sm border rounded-md transition-colors',
                    selectedSize === size
                      ? 'bg-foreground text-background border-foreground'
                      : 'hover:border-foreground'
                  )}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div>
            <p className="text-sm font-medium mb-3">{t('quantity')}</p>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-12 text-center font-medium">{quantity}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(quantity + 1)}
                disabled={quantity >= product.stockCount}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Stock Status */}
          <div>
            {product.inStock ? (
              product.stockCount <= 5 ? (
                <p className="text-sm text-orange-500">{t('lowStock')} - {product.stockCount} {locale === 'fa' ? 'عدد' : 'left'}</p>
              ) : (
                <p className="text-sm text-green-600">{t('inStock')}</p>
              )
            ) : (
              <p className="text-sm text-red-500">{t('outOfStock')}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button 
              size="lg" 
              className="flex-1"
              onClick={handleAddToCart}
              disabled={!product.inStock}
            >
              {t('addToCart')}
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => toggleItem(product.id)}
            >
              <Heart className={cn('h-5 w-5', isWishlisted && 'fill-red-500 text-red-500')} />
            </Button>
          </div>

          {/* Benefits */}
          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="flex items-center gap-3 text-sm">
              <Truck className="h-5 w-5 text-muted-foreground" />
              <span>{t('freeDelivery')}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <RotateCcw className="h-5 w-5 text-muted-foreground" />
              <span>{t('freeReturns')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className="mt-12">
        <Tabs defaultValue="description" className="w-full">
          <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
            <TabsTrigger 
              value="description"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent px-6 py-3"
            >
              {t('description')}
            </TabsTrigger>
            <TabsTrigger 
              value="details"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent px-6 py-3"
            >
              {t('details')}
            </TabsTrigger>
            <TabsTrigger 
              value="reviews"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent px-6 py-3"
            >
              {t('reviews')} ({product.reviewCount})
            </TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="pt-6">
            <p className="text-muted-foreground leading-relaxed max-w-3xl">
              {getLocalizedString(product.description, locale)}
            </p>
          </TabsContent>
          <TabsContent value="details" className="pt-6">
            <dl className="grid grid-cols-2 gap-4 max-w-lg">
              <dt className="text-muted-foreground">{locale === 'fa' ? 'برند' : 'Brand'}</dt>
              <dd>{product.brand}</dd>
              <dt className="text-muted-foreground">{locale === 'fa' ? 'دسته‌بندی' : 'Category'}</dt>
              <dd className="capitalize">{product.category}</dd>
              <dt className="text-muted-foreground">{locale === 'fa' ? 'سایزهای موجود' : 'Available Sizes'}</dt>
              <dd>{product.sizes.join(', ')}</dd>
            </dl>
          </TabsContent>
          <TabsContent value="reviews" className="pt-6">
            <p className="text-muted-foreground">
              {locale === 'fa' ? 'نظرات به زودی...' : 'Reviews coming soon...'}
            </p>
          </TabsContent>
        </Tabs>
      </div>

      {/* Related Products */}
      {finalRelatedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">{t('youMayAlsoLike')}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {finalRelatedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
