'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useWishlistStore } from '@/lib/stores/wishlist-store'
import { formatPrice, getLocalizedString, calculateDiscount } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { Product } from '@/lib/types'
import type { Locale } from '@/i18n/config'

interface ProductCardProps {
  product: Product
  className?: string
}

export function ProductCard({ product, className }: ProductCardProps) {
  const params = useParams()
  const locale = params.locale as Locale
  const [isImageHovered, setIsImageHovered] = useState(false)
  
  const { hasItem, toggleItem } = useWishlistStore()
  const isWishlisted = hasItem(product.id)

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleItem(product.id)
  }

  const discount = product.originalPrice 
    ? calculateDiscount(product.originalPrice, product.price) 
    : 0

  return (
    <div className={cn('group', className)}>
      <Link href={`/${locale}/products/${product.id}`}>
        <div 
          className="relative aspect-[3/4] overflow-hidden rounded-lg bg-muted mb-3"
          onMouseEnter={() => setIsImageHovered(true)}
          onMouseLeave={() => setIsImageHovered(false)}
        >
          <Image
            src={isImageHovered && product.images[1] ? product.images[1] : product.images[0]}
            alt={getLocalizedString(product.name, locale)}
            fill
            className="object-cover transition-all duration-300"
          />
          
          {/* Badges */}
          <div className="absolute top-2 start-2 flex flex-col gap-1">
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

          {/* Wishlist Button */}
          <Button
            variant="secondary"
            size="icon"
            className={cn(
              'absolute top-2 end-2 h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity',
              isWishlisted && 'opacity-100'
            )}
            onClick={handleWishlistToggle}
          >
            <Heart className={cn('h-4 w-4', isWishlisted && 'fill-red-500 text-red-500')} />
          </Button>

          {/* Quick View Overlay */}
          <div className="absolute inset-x-0 bottom-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button className="w-full" size="sm">
              {locale === 'fa' ? 'مشاهده سریع' : 'Quick View'}
            </Button>
          </div>
        </div>

        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">{product.brand}</p>
          <h3 className="font-medium text-sm line-clamp-2 group-hover:underline">
            {getLocalizedString(product.name, locale)}
          </h3>
          <div className="flex items-center gap-2">
            <span className="font-semibold">{formatPrice(product.price, locale)}</span>
            {product.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(product.originalPrice, locale)}
              </span>
            )}
          </div>
          
          {/* Color Options Preview */}
          {product.colors.length > 1 && (
            <div className="flex gap-1 pt-1">
              {product.colors.slice(0, 4).map((color, i) => (
                <div
                  key={i}
                  className="h-4 w-4 rounded-full border border-border"
                  style={{ backgroundColor: color.hex }}
                  title={getLocalizedString(color.name, locale)}
                />
              ))}
              {product.colors.length > 4 && (
                <span className="text-xs text-muted-foreground">+{product.colors.length - 4}</span>
              )}
            </div>
          )}
        </div>
      </Link>
    </div>
  )
}
