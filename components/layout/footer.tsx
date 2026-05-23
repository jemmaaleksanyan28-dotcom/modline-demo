'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Instagram, Twitter, Facebook, Youtube, Send } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { Locale } from '@/i18n/config'

export function Footer() {
  const t = useTranslations('footer')
  const tNav = useTranslations('nav')
  const params = useParams()
  const locale = params.locale as Locale

  const currentYear = new Date().getFullYear()
  const [newsletterEmail, setNewsletterEmail] = useState('')

  const handleNewsletter = () => {
    if (!newsletterEmail.includes('@')) {
      toast.error(locale === 'fa' ? 'ایمیل معتبر وارد کنید' : 'Enter a valid email')
      return
    }
    toast.success(locale === 'fa' ? 'ایمیل شما ثبت شد' : 'Email saved')
    setNewsletterEmail('')
  }

  return (
    <footer className="bg-[#2d2d2d] text-white">
      {/* Newsletter Section */}
      <div className="border-b border-white/10">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold mb-1">{t('newsletter')}</h3>
              <p className="text-white/70 text-sm">{t('newsletterText')}</p>
            </div>
            <div className="flex w-full md:w-auto gap-2">
              <Input
                type="email"
                placeholder={locale === 'fa' ? 'ایمیل خود را وارد کنید' : 'Enter your email'}
                value={newsletterEmail}
                onChange={(event) => setNewsletterEmail(event.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50 w-full md:w-64"
              />
              <Button type="button" onClick={handleNewsletter} className="bg-white text-[#2d2d2d] hover:bg-white/90">
                <Send className="h-4 w-4 me-2" />
                {t('subscribe')}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Shop Links */}
          <div>
            <h4 className="font-semibold mb-4">{locale === 'fa' ? 'فروشگاه' : 'Shop'}</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li>
                <Link href={`/${locale}/products?gender=women`} className="hover:text-white transition-colors">
                  {tNav('women')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/products?gender=men`} className="hover:text-white transition-colors">
                  {tNav('men')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/products?gender=kids`} className="hover:text-white transition-colors">
                  {tNav('kids')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/products?sale=true`} className="hover:text-white transition-colors text-red-400">
                  {tNav('sale')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/products?new=true`} className="hover:text-white transition-colors">
                  {tNav('newIn')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Help Links */}
          <div>
            <h4 className="font-semibold mb-4">{t('customerService')}</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li>
                <Link href={`/${locale}/help/faq`} className="hover:text-white transition-colors">
                  {t('faq')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/help/shipping`} className="hover:text-white transition-colors">
                  {t('shipping')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/help/returns`} className="hover:text-white transition-colors">
                  {t('returns')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/contact`} className="hover:text-white transition-colors">
                  {t('contactUs')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-semibold mb-4">{locale === 'fa' ? 'درباره ما' : 'About'}</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li>
                <Link href={`/${locale}/about`} className="hover:text-white transition-colors">
                  {t('aboutUs')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/privacy`} className="hover:text-white transition-colors">
                  {t('privacyPolicy')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/terms`} className="hover:text-white transition-colors">
                  {t('terms')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="font-semibold mb-4">{t('followUs')}</h4>
            <div className="flex gap-3">
              <Button asChild variant="ghost" size="icon" className="hover:bg-white/10 text-white/70 hover:text-white">
                <Link href={`/${locale}/contact`} aria-label="Instagram"><Instagram className="h-5 w-5" /></Link>
              </Button>
              <Button asChild variant="ghost" size="icon" className="hover:bg-white/10 text-white/70 hover:text-white">
                <Link href={`/${locale}/contact`} aria-label="Twitter"><Twitter className="h-5 w-5" /></Link>
              </Button>
              <Button asChild variant="ghost" size="icon" className="hover:bg-white/10 text-white/70 hover:text-white">
                <Link href={`/${locale}/contact`} aria-label="Facebook"><Facebook className="h-5 w-5" /></Link>
              </Button>
              <Button asChild variant="ghost" size="icon" className="hover:bg-white/10 text-white/70 hover:text-white">
                <Link href={`/${locale}/contact`} aria-label="Youtube"><Youtube className="h-5 w-5" /></Link>
              </Button>
            </div>

            {/* Payment Methods */}
            <div className="mt-6">
              <h4 className="font-semibold mb-3 text-sm">{locale === 'fa' ? 'روش‌های پرداخت' : 'Payment Methods'}</h4>
              <div className="flex gap-2">
                <div className="bg-white/10 rounded px-3 py-1 text-xs">زرین‌پال</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-2 text-sm text-white/50">
            <p>
              © {currentYear} مدلاین. {t('allRightsReserved')}
            </p>
            <div className="flex items-center gap-1">
              <span>{locale === 'fa' ? 'ساخته شده با' : 'Built with'}</span>
              <span className="text-red-500">♥</span>
              <span>{locale === 'fa' ? 'در ایران' : 'in Iran'}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
