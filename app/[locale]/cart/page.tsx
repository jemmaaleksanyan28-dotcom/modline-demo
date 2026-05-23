'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { useCartStore } from '@/lib/stores/cart-store'
import { formatPrice, getLocalizedString } from '@/lib/format'
import type { Locale } from '@/i18n/config'

export default function CartPage() {
  const t = useTranslations('cart')
  const tCommon = useTranslations('common')
  const params = useParams()
  const locale = params.locale as Locale
  
  const { 
    items, 
    removeItem, 
    updateQuantity, 
    getSubtotal, 
    getShipping, 
    getTotal,
    getItemCount
  } = useCartStore()

  const subtotal = getSubtotal()
  const shipping = getShipping()
  const total = getTotal()
  const itemCount = getItemCount()

  const Arrow = locale === 'fa' ? ArrowLeft : ArrowRight

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <ShoppingBag className="h-20 w-20 mx-auto text-muted-foreground mb-6" />
        <h1 className="text-2xl font-bold mb-4">{t('emptyCart')}</h1>
        <p className="text-muted-foreground mb-6">
          {locale === 'fa' ? 'سبد خرید شما خالی است. شروع به خرید کنید!' : 'Your cart is empty. Start shopping!'}
        </p>
        <Button asChild size="lg">
          <Link href={`/${locale}/products`}>
            {t('continueShopping')}
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl md:text-3xl font-bold mb-8">
        {t('yourCart')} ({itemCount} {t('itemsInCart')})
      </h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div 
              key={`${item.product.id}-${item.size}-${item.color}`}
              className="flex gap-4 p-4 bg-card rounded-lg border"
            >
              <Link 
                href={`/${locale}/products/${item.product.id}`}
                className="relative h-32 w-24 shrink-0 rounded-md overflow-hidden bg-muted"
              >
                <Image
                  src={item.product.images[0]}
                  alt={getLocalizedString(item.product.name, locale)}
                  fill
                  className="object-cover"
                />
              </Link>
              
              <div className="flex-1 min-w-0">
                <div className="flex justify-between gap-2">
                  <div>
                    <Link 
                      href={`/${locale}/products/${item.product.id}`}
                      className="font-medium hover:underline line-clamp-1"
                    >
                      {getLocalizedString(item.product.name, locale)}
                    </Link>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {item.product.brand}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {locale === 'fa' ? 'سایز' : 'Size'}: {item.size} | {locale === 'fa' ? 'رنگ' : 'Color'}: {item.color}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-destructive shrink-0"
                    onClick={() => removeItem(item.product.id, item.size, item.color)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => updateQuantity(item.product.id, item.size, item.color, item.quantity - 1)}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-10 text-center">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => updateQuantity(item.product.id, item.size, item.color, item.quantity + 1)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="text-end">
                    <p className="font-semibold">{formatPrice(item.product.price * item.quantity, locale)}</p>
                    {item.quantity > 1 && (
                      <p className="text-xs text-muted-foreground">
                        {formatPrice(item.product.price, locale)} x {item.quantity}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          <Button variant="outline" asChild className="mt-4">
            <Link href={`/${locale}/products`}>
              <Arrow className="h-4 w-4 me-2 rtl:rotate-180" />
              {t('continueShopping')}
            </Link>
          </Button>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-card rounded-lg border p-6 sticky top-24">
            <h2 className="text-lg font-semibold mb-4">
              {locale === 'fa' ? 'خلاصه سفارش' : 'Order Summary'}
            </h2>

            {/* Promo Code */}
            <div className="flex gap-2 mb-6">
              <Input 
                placeholder={t('promoCode')} 
                className="flex-1"
              />
              <Button variant="outline">{t('apply')}</Button>
            </div>

            <Separator className="mb-4" />

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t('subtotal')}</span>
                <span>{formatPrice(subtotal, locale)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t('shipping')}</span>
                <span>{shipping === 0 ? tCommon('free') : formatPrice(shipping, locale)}</span>
              </div>
              {shipping > 0 && (
                <p className="text-xs text-muted-foreground">
                  {locale === 'fa' 
                    ? `برای ارسال رایگان، ${formatPrice(500000 - subtotal, locale)} دیگر خرید کنید`
                    : `Add ${formatPrice(500000 - subtotal, locale)} for free shipping`
                  }
                </p>
              )}
            </div>

            <Separator className="my-4" />

            <div className="flex justify-between font-semibold text-lg mb-6">
              <span>{t('total')}</span>
              <span>{formatPrice(total, locale)}</span>
            </div>

            <Button asChild size="lg" className="w-full">
              <Link href={`/${locale}/checkout`}>{t('checkout')}</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
