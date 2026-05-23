'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useCartStore } from '@/lib/stores/cart-store'
import { formatPrice, getLocalizedString } from '@/lib/format'
import { localeDirection, type Locale } from '@/i18n/config'

export function CartSheet() {
  const t = useTranslations('cart')
  const tCommon = useTranslations('common')
  const params = useParams()
  const locale = params.locale as Locale
  const direction = localeDirection[locale]
  
  const { 
    items, 
    isOpen, 
    setIsOpen, 
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

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent side={direction === 'rtl' ? 'left' : 'right'} className="w-full sm:max-w-md flex flex-col p-0">
        <SheetHeader className="p-4 border-b">
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            {t('yourCart')} ({itemCount} {t('itemsInCart')})
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-lg font-medium mb-2">{t('emptyCart')}</p>
            <Button asChild onClick={() => setIsOpen(false)}>
              <Link href={`/${locale}/products`}>{t('continueShopping')}</Link>
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1">
              <div className="p-4 space-y-4">
                {items.map((item) => (
                  <div key={`${item.product.id}-${item.size}-${item.color}`} className="flex gap-3">
                    <div className="relative h-24 w-20 rounded-lg overflow-hidden bg-muted shrink-0">
                      <Image
                        src={item.product.images[0]}
                        alt={getLocalizedString(item.product.name, locale)}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm truncate">
                        {getLocalizedString(item.product.name, locale)}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {item.size} / {item.color}
                      </p>
                      <p className="font-semibold text-sm mt-1">
                        {formatPrice(item.product.price, locale)}
                      </p>
                      
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-1">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => updateQuantity(item.product.id, item.size, item.color, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center text-sm">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => updateQuantity(item.product.id, item.size, item.color, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-foreground hover:text-destructive"
                          onClick={() => removeItem(item.product.id, item.size, item.color)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="border-t p-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t('subtotal')}</span>
                <span>{formatPrice(subtotal, locale)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t('shipping')}</span>
                <span>{shipping === 0 ? tCommon('free') : formatPrice(shipping, locale)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>{t('total')}</span>
                <span>{formatPrice(total, locale)}</span>
              </div>

              <div className="grid gap-2 pt-2">
                <Button asChild size="lg" onClick={() => setIsOpen(false)}>
                  <Link href={`/${locale}/checkout`}>{t('checkout')}</Link>
                </Button>
                <Button variant="outline" asChild onClick={() => setIsOpen(false)}>
                  <Link href={`/${locale}/cart`}>{t('cart')}</Link>
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
