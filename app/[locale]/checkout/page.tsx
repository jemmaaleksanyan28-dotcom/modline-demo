'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ShoppingBag, CreditCard, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useCartStore } from '@/lib/stores/cart-store'
import { useAuthStore } from '@/lib/stores/auth-store'
import { useOrdersStore } from '@/lib/stores/orders-store'
import { formatPrice, getLocalizedString } from '@/lib/format'
import { toast } from 'sonner'
import type { Locale } from '@/i18n/config'

const checkoutSchema = z.object({
  firstName: z.string().min(2, 'نام الزامی است'),
  lastName: z.string().min(2, 'نام خانوادگی الزامی است'),
  email: z.string().email('ایمیل معتبر نیست'),
  phone: z.string().min(10, 'شماره تلفن معتبر نیست'),
  addressLine1: z.string().min(10, 'آدرس الزامی است'),
  addressLine2: z.string().optional(),
  city: z.string().min(2, 'شهر الزامی است'),
  state: z.string().min(2, 'استان الزامی است'),
  postalCode: z.string().min(5, 'کد پستی معتبر نیست'),
  country: z.string().min(2, 'کشور الزامی است')
})

type CheckoutForm = z.infer<typeof checkoutSchema>

export default function CheckoutPage() {
  const t = useTranslations('checkout')
  const tCommon = useTranslations('common')
  const params = useParams()
  const router = useRouter()
  const locale = params.locale as Locale
  
  const [isProcessing, setIsProcessing] = useState(false)
  
  const { items, getSubtotal, getShipping, getTotal, clearCart } = useCartStore()
  const { user } = useAuthStore()
  const { upsertOrder } = useOrdersStore()

  const subtotal = getSubtotal()
  const shipping = getShipping()
  const total = getTotal()

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: user?.phone || '',
      addressLine1: user?.addresses?.[0]?.addressLine1 || '',
      addressLine2: user?.addresses?.[0]?.addressLine2 || '',
      city: user?.addresses?.[0]?.city || '',
      state: user?.addresses?.[0]?.state || '',
      postalCode: user?.addresses?.[0]?.postalCode || '',
      country: user?.addresses?.[0]?.country || 'Iran'
    }
  })



  useEffect(() => {
    if (!user) return
    reset({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      phone: user.phone || '',
      addressLine1: user.addresses?.[0]?.addressLine1 || '',
      addressLine2: user.addresses?.[0]?.addressLine2 || '',
      city: user.addresses?.[0]?.city || '',
      state: user.addresses?.[0]?.state || '',
      postalCode: user.addresses?.[0]?.postalCode || '',
      country: user.addresses?.[0]?.country || 'Iran'
    })
  }, [user, reset])

  const onSubmit = async (data: CheckoutForm) => {
    if (items.length === 0) {
      toast.error(locale === 'fa' ? 'سبد خرید خالی است' : 'Cart is empty')
      return
    }

    setIsProcessing(true)

    try {
      const shippingAddress = {
        id: Date.now().toString(),
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        addressLine1: data.addressLine1,
        addressLine2: data.addressLine2,
        city: data.city,
        state: data.state,
        postalCode: data.postalCode,
        country: data.country,
        isDefault: false
      }

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          shippingAddress,
          shipping,
          discount: 0,
        })
      })
      const result = await response.json().catch(() => null)
      if (!response.ok || !result?.order) throw new Error(result?.error || 'order_failed')

      upsertOrder(result.order)
      clearCart()
      router.push(`/${locale}/checkout/success?orderId=${result.order.id}`)
      
    } catch (error) {
      toast.error(locale === 'fa' ? 'خطا در ثبت سفارش' : 'Error creating order')
    } finally {
      setIsProcessing(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <ShoppingBag className="h-20 w-20 mx-auto text-muted-foreground mb-6" />
        <h1 className="text-2xl font-bold mb-4">
          {locale === 'fa' ? 'سبد خرید خالی است' : 'Your cart is empty'}
        </h1>
        <Button asChild size="lg">
          <Link href={`/${locale}/products`}>
            {locale === 'fa' ? 'شروع خرید' : 'Start Shopping'}
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl md:text-3xl font-bold mb-8">{t('checkout')}</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Shipping Info */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('shippingInfo')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">{t('firstName')}</Label>
                    <Input
                      id="firstName"
                      {...register('firstName')}
                      className={errors.firstName ? 'border-destructive' : ''}
                    />
                    {errors.firstName && (
                      <p className="text-xs text-destructive">{errors.firstName.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">{t('lastName')}</Label>
                    <Input
                      id="lastName"
                      {...register('lastName')}
                      className={errors.lastName ? 'border-destructive' : ''}
                    />
                    {errors.lastName && (
                      <p className="text-xs text-destructive">{errors.lastName.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">{t('email')}</Label>
                    <Input
                      id="email"
                      type="email"
                      {...register('email')}
                      className={errors.email ? 'border-destructive' : ''}
                    />
                    {errors.email && (
                      <p className="text-xs text-destructive">{errors.email.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">{t('phone')}</Label>
                    <Input
                      id="phone"
                      type="tel"
                      {...register('phone')}
                      className={errors.phone ? 'border-destructive' : ''}
                    />
                    {errors.phone && (
                      <p className="text-xs text-destructive">{errors.phone.message}</p>
                    )}
                  </div>
                </div>

<div className="space-y-2">
                    <Label htmlFor="addressLine1">{t('address')}</Label>
                    <Input
                      id="addressLine1"
                      {...register('addressLine1')}
                      className={errors.addressLine1 ? 'border-destructive' : ''}
                    />
                    {errors.addressLine1 && (
                      <p className="text-xs text-destructive">{errors.addressLine1.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="addressLine2">{locale === 'fa' ? 'آدرس (خط ۲)' : 'Address Line 2'}</Label>
                    <Input
                      id="addressLine2"
                      {...register('addressLine2')}
                      placeholder={locale === 'fa' ? 'اختیاری' : 'Optional'}
                    />
                  </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">{t('city')}</Label>
                    <Input
                      id="city"
                      {...register('city')}
                      className={errors.city ? 'border-destructive' : ''}
                    />
                    {errors.city && (
                      <p className="text-xs text-destructive">{errors.city.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">{t('province')}</Label>
                    <Input
                      id="state"
                      {...register('state')}
                      className={errors.state ? 'border-destructive' : ''}
                    />
                    {errors.state && (
                      <p className="text-xs text-destructive">{errors.state.message}</p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="postalCode">{t('postalCode')}</Label>
                    <Input
                      id="postalCode"
                      {...register('postalCode')}
                      className={errors.postalCode ? 'border-destructive' : ''}
                    />
                    {errors.postalCode && (
                      <p className="text-xs text-destructive">{errors.postalCode.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">{locale === 'fa' ? 'کشور' : 'Country'}</Label>
                    <Input
                      id="country"
                      {...register('country')}
                      className={errors.country ? 'border-destructive' : ''}
                    />
                    {errors.country && (
                      <p className="text-xs text-destructive">{errors.country.message}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle>{t('paymentMethod')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 p-4 border rounded-lg bg-muted/50">
                  <CreditCard className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="font-medium">{locale === 'fa' ? 'ثبت سفارش آنلاین' : 'Online order registration'}</p>
                    <p className="text-sm text-muted-foreground">
                      {locale === 'fa' ? 'پرداخت پس از تأیید سفارش از طریق درگاه ایرانی' : 'Payment after order confirmation via local gateway'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>{t('orderSummary')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Items */}
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {items.map((item) => (
                    <div 
                      key={`${item.product.id}-${item.size}-${item.color}`}
                      className="flex gap-3"
                    >
                      <div className="relative h-16 w-12 rounded overflow-hidden bg-muted shrink-0">
                        <Image
                          src={item.product.images[0]}
                          alt={getLocalizedString(item.product.name, locale)}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {getLocalizedString(item.product.name, locale)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {item.size} / {item.color} x {item.quantity}
                        </p>
                      </div>
                      <p className="text-sm font-medium shrink-0">
                        {formatPrice(item.product.price * item.quantity, locale)}
                      </p>
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{locale === 'fa' ? 'جمع کل' : 'Subtotal'}</span>
                    <span>{formatPrice(subtotal, locale)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{locale === 'fa' ? 'ارسال' : 'Shipping'}</span>
                    <span>{shipping === 0 ? tCommon('free') : formatPrice(shipping, locale)}</span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between font-semibold text-lg">
                  <span>{locale === 'fa' ? 'مبلغ قابل پرداخت' : 'Total'}</span>
                  <span>{formatPrice(total, locale)}</span>
                </div>

                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-4 w-4 me-2 animate-spin" />
                      {t('processing')}
                    </>
                  ) : (
                    t('placeOrder')
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}
