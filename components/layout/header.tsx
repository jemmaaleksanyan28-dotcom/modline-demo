'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams, usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Search, Heart, ShoppingBag, User, Menu, X, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { LanguageSwitcher } from './language-switcher'
import { SearchDialog } from '@/components/shared/search-dialog'
import { useCartStore } from '@/lib/stores/cart-store'
import { useWishlistStore } from '@/lib/stores/wishlist-store'
import { useAuthStore } from '@/lib/stores/auth-store'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger
} from '@/components/ui/navigation-menu'
import { cn } from '@/lib/utils'
import type { Locale } from '@/i18n/config'

const menuItems = [
  {
    key: 'women',
    href: '/products?gender=women',
    featured: [
      { key: 'newIn', href: '/products?gender=women&new=true' },
      { key: 'sale', href: '/products?gender=women&sale=true' }
    ],
    categories: ['dresses', 'tops', 'jeans', 'jackets', 'shoes', 'bags', 'accessories']
  },
  {
    key: 'men',
    href: '/products?gender=men',
    featured: [
      { key: 'newIn', href: '/products?gender=men&new=true' },
      { key: 'sale', href: '/products?gender=men&sale=true' }
    ],
    categories: ['tops', 'jeans', 'jackets', 'shoes', 'accessories']
  },
  {
    key: 'kids',
    href: '/products?gender=kids',
    featured: [
      { key: 'newIn', href: '/products?gender=kids&new=true' }
    ],
    categories: ['tops', 'jeans', 'shoes']
  }
]

export function Header() {
  const t = useTranslations('nav')
  const tCat = useTranslations('categories')
  const params = useParams()
  const pathname = usePathname()
  const locale = params.locale as Locale
  
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  
  const { setIsOpen: setCartOpen, getItemCount } = useCartStore()
  const { items: wishlistItems } = useWishlistStore()
  const { isAuthenticated, user, logout } = useAuthStore()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const cartCount = getItemCount()
  const wishlistCount = wishlistItems.length

  return (
    <>
      <header className={cn(
        'sticky top-0 z-50 w-full transition-all duration-200',
        isScrolled ? 'bg-background/95 backdrop-blur-sm shadow-sm' : 'bg-[#2d2d2d]'
      )}>
        {/* Top Bar */}
        <div className="bg-[#2d2d2d] text-white">
          <div className="container mx-auto px-4">
            <div className="flex h-10 items-center justify-between text-xs">
              <div className="hidden md:flex items-center gap-4">
                <span>{locale === 'fa' ? 'ارسال رایگان برای خریدهای بالای ۵۰۰ هزار تومان' : 'Free shipping on orders over 500,000 Toman'}</span>
              </div>
              <div className="flex items-center gap-4 ms-auto">
                <LanguageSwitcher />
              </div>
            </div>
          </div>
        </div>

        {/* Main Header */}
        <div className={cn(
          'border-b transition-colors',
          isScrolled ? 'border-border bg-background' : 'bg-[#2d2d2d] border-[#2d2d2d]'
        )}>
          <div className="container mx-auto px-4">
            <div className="flex h-16 items-center justify-between gap-4">
              {/* Mobile Menu */}
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild className="lg:hidden">
                  <Button variant="ghost" size="icon" className={cn(
                    isScrolled ? 'text-foreground hover:bg-accent' : 'text-white hover:bg-white/10'
                  )}>
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side={locale === 'fa' ? 'right' : 'left'} className="w-80 p-0">
                  <div className="flex flex-col h-full">
                    <div className="p-4 border-b flex items-center justify-between">
                      <Link href={`/${locale}`} className="text-2xl font-bold" onClick={() => setIsMobileMenuOpen(false)}>
                        مدلاین
                      </Link>
                      <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
                        <X className="h-5 w-5" />
                      </Button>
                    </div>
                    <nav className="flex-1 overflow-y-auto p-4">
                      {menuItems.map((item) => (
                        <div key={item.key} className="mb-4">
                          <Link
                            href={`/${locale}${item.href}`}
                            className="block py-2 text-lg font-semibold"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            {t(item.key)}
                          </Link>
                          <div className="ps-4 space-y-2">
                            {item.categories.map((cat) => (
                              <Link
                                key={cat}
                                href={`/${locale}/products?category=${cat}`}
                                className="block py-1 text-muted-foreground hover:text-foreground"
                                onClick={() => setIsMobileMenuOpen(false)}
                              >
                                {tCat(cat)}
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                      <Link
                        href={`/${locale}/products?sale=true`}
                        className="block py-2 text-lg font-semibold text-red-500"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {t('sale')}
                      </Link>
                    </nav>
                  </div>
                </SheetContent>
              </Sheet>

              {/* Logo */}
              <Link href={`/${locale}`} className={cn(
                'text-2xl font-bold tracking-tight',
                isScrolled ? 'text-foreground' : 'text-white'
              )}>
                مدلاین
              </Link>

              {/* Desktop Navigation */}
              <NavigationMenu className="hidden lg:flex">
                <NavigationMenuList>
                  {menuItems.map((item) => (
                    <NavigationMenuItem key={item.key}>
                      <NavigationMenuTrigger className={cn(
                        'bg-transparent',
                        isScrolled 
                          ? 'text-foreground hover:bg-accent data-[state=open]:bg-accent' 
                          : 'text-white hover:bg-white/10 data-[state=open]:bg-white/10'
                      )}>
                        {t(item.key)}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <div className="grid gap-3 p-6 w-[500px] lg:w-[700px] lg:grid-cols-[1fr_1fr_1fr]">
                          <div className="space-y-3">
                            <h3 className="font-semibold text-sm text-muted-foreground uppercase">
                              {locale === 'fa' ? 'ویژه' : 'Featured'}
                            </h3>
                            {item.featured.map((f) => (
                              <NavigationMenuLink asChild key={f.key}>
                                <Link
                                  href={`/${locale}${f.href}`}
                                  className="block py-1 font-medium hover:text-primary transition-colors"
                                >
                                  {t(f.key)}
                                </Link>
                              </NavigationMenuLink>
                            ))}
                          </div>
                          <div className="col-span-2 grid grid-cols-2 gap-3">
                            <div className="space-y-3">
                              <h3 className="font-semibold text-sm text-muted-foreground uppercase">
                                {locale === 'fa' ? 'دسته‌بندی‌ها' : 'Categories'}
                              </h3>
                              {item.categories.slice(0, Math.ceil(item.categories.length / 2)).map((cat) => (
                                <NavigationMenuLink asChild key={cat}>
                                  <Link
                                    href={`/${locale}/products?category=${cat}`}
                                    className="block py-1 hover:text-primary transition-colors"
                                  >
                                    {tCat(cat)}
                                  </Link>
                                </NavigationMenuLink>
                              ))}
                            </div>
                            <div className="space-y-3 pt-7">
                              {item.categories.slice(Math.ceil(item.categories.length / 2)).map((cat) => (
                                <NavigationMenuLink asChild key={cat}>
                                  <Link
                                    href={`/${locale}/products?category=${cat}`}
                                    className="block py-1 hover:text-primary transition-colors"
                                  >
                                    {tCat(cat)}
                                  </Link>
                                </NavigationMenuLink>
                              ))}
                            </div>
                          </div>
                        </div>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                  ))}
                  <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                      <Link
                        href={`/${locale}/products?sale=true`}
                        className={cn(
                          'group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors',
                          isScrolled
                            ? 'text-red-500 hover:bg-red-50'
                            : 'text-red-400 hover:bg-red-500/10'
                        )}
                      >
                        {t('sale')}
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>

              {/* Actions */}
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsSearchOpen(true)}
                  className={cn(
                    isScrolled ? 'text-foreground hover:bg-accent' : 'text-white hover:bg-white/10'
                  )}
                >
                  <Search className="h-5 w-5" />
                </Button>

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={cn(
                        isScrolled ? 'text-foreground hover:bg-accent' : 'text-white hover:bg-white/10'
                      )}
                    >
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    {isAuthenticated ? (
                      <>
                        <DropdownMenuItem className="font-medium">
                          {user?.firstName} {user?.lastName}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link href={`/${locale}/profile`}>{t('profile')}</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/${locale}/profile/orders`}>{t('orders')}</Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => logout()} className="text-red-500">
                          {t('logout')}
                        </DropdownMenuItem>
                      </>
                    ) : (
                      <>
                        <DropdownMenuItem asChild>
                          <Link href={`/${locale}/auth/login`}>{t('login')}</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/${locale}/auth/register`}>{t('register')}</Link>
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button
                  variant="ghost"
                  size="icon"
                  asChild
                  className={cn(
                    'relative',
                    isScrolled ? 'text-foreground hover:bg-accent' : 'text-white hover:bg-white/10'
                  )}
                >
                  <Link href={`/${locale}/profile/wishlist`}>
                    <Heart className="h-5 w-5" />
                    {wishlistCount > 0 && (
                      <span className="absolute -top-1 -end-1 h-4 w-4 rounded-full bg-red-500 text-[10px] font-medium text-white flex items-center justify-center">
                        {wishlistCount}
                      </span>
                    )}
                  </Link>
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setCartOpen(true)}
                  className={cn(
                    'relative',
                    isScrolled ? 'text-foreground hover:bg-accent' : 'text-white hover:bg-white/10'
                  )}
                >
                  <ShoppingBag className="h-5 w-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -end-1 h-4 w-4 rounded-full bg-red-500 text-[10px] font-medium text-white flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <SearchDialog open={isSearchOpen} onOpenChange={setIsSearchOpen} />
    </>
  )
}
