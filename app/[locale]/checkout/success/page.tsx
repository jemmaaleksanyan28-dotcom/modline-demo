'use client'

import { Suspense } from 'react'
import Link from 'next/link'
import { useParams, useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { CheckCircle, Package, ArrowRight, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import type { Locale } from '@/i18n/config'

function CheckoutSuccessContent() {
  const t = useTranslations('checkout')
  const params = useParams()
  const searchParams = useSearchParams()
  const locale = params.locale as Locale
  
  const orderId = searchParams.get('orderId')
  const Arrow = locale === 'fa' ? ArrowLeft : ArrowRight

  return (
    <div className="container mx-auto px-4 py-16">
      <Card className="max-w-lg mx-auto">
        <CardContent className="pt-12 pb-8 text-center">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          
          <h1 className="text-2xl font-bold mb-2">{t('thankYou')}</h1>
          <p className="text-muted-foreground mb-6">
            {locale === 'fa' 
              ? 'سفارش شما با موفقیت ثبت و پرداخت شد' 
              : 'Your order has been successfully placed and paid'
            }
          </p>

          {orderId && (
            <div className="bg-muted rounded-lg p-4 mb-6">
              <p className="text-sm text-muted-foreground mb-1">{t('orderNumber')}</p>
              <p className="font-mono font-semibold text-lg">{orderId}</p>
            </div>
          )}

          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-8">
            <Package className="h-4 w-4" />
            <span>
              {locale === 'fa' 
                ? 'سفارش شما در حال پردازش است' 
                : 'Your order is being processed'
              }
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button asChild variant="outline" className="flex-1">
              <Link href={`/${locale}/profile/orders`}>
                {locale === 'fa' ? 'مشاهده سفارشات' : 'View Orders'}
              </Link>
            </Button>
            <Button asChild className="flex-1">
              <Link href={`/${locale}/products`}>
                {locale === 'fa' ? 'ادامه خرید' : 'Continue Shopping'}
                <Arrow className="h-4 w-4 ms-2" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-16 text-center">در حال بارگذاری نتیجه سفارش...</div>}>
      <CheckoutSuccessContent />
    </Suspense>
  )
}
