import type { Category } from '@/lib/types'

export const categories: Category[] = [
  {
    id: 'women',
    name: { fa: 'زنانه', en: 'Women' },
    slug: 'women',
    image: '/images/fashion/product-1.webp',
    gender: 'women'
  },
  {
    id: 'men',
    name: { fa: 'مردانه', en: 'Men' },
    slug: 'men',
    image: '/images/fashion/product-2.webp',
    gender: 'men'
  },
  {
    id: 'kids',
    name: { fa: 'بچگانه', en: 'Kids' },
    slug: 'kids',
    image: '/images/fashion/product-3.webp',
    gender: 'kids'
  },
  {
    id: 'dresses',
    name: { fa: 'لباس مجلسی', en: 'Dresses' },
    slug: 'dresses',
    image: '/images/fashion/product-4.webp',
    gender: 'women'
  },
  {
    id: 'tops',
    name: { fa: 'بالاتنه', en: 'Tops' },
    slug: 'tops',
    image: '/images/fashion/product-5.webp',
    gender: 'all'
  },
  {
    id: 'jeans',
    name: { fa: 'شلوار جین', en: 'Jeans' },
    slug: 'jeans',
    image: '/images/fashion/product-6.webp',
    gender: 'all'
  },
  {
    id: 'jackets',
    name: { fa: 'ژاکت و کاپشن', en: 'Jackets & Coats' },
    slug: 'jackets',
    image: '/images/fashion/product-7.webp',
    gender: 'all'
  },
  {
    id: 'shoes',
    name: { fa: 'کفش', en: 'Shoes' },
    slug: 'shoes',
    image: '/images/fashion/product-8.webp',
    gender: 'all'
  },
  {
    id: 'bags',
    name: { fa: 'کیف', en: 'Bags' },
    slug: 'bags',
    image: '/images/fashion/product-9.webp',
    gender: 'all'
  },
  {
    id: 'accessories',
    name: { fa: 'اکسسوری', en: 'Accessories' },
    slug: 'accessories',
    image: '/images/fashion/product-10.webp',
    gender: 'all'
  },
  {
    id: 'sportswear',
    name: { fa: 'ورزشی', en: 'Sportswear' },
    slug: 'sportswear',
    image: '/images/fashion/product-11.webp',
    gender: 'all'
  },
  {
    id: 'sweaters',
    name: { fa: 'بافت و سویشرت', en: 'Sweaters & Hoodies' },
    slug: 'sweaters',
    image: '/images/fashion/product-12.webp',
    gender: 'all'
  }
]

export function getCategoryById(id: string): Category | undefined {
  return categories.find(c => c.id === id)
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find(c => c.slug === slug)
}

export function getCategoriesByGender(gender: string): Category[] {
  if (gender === 'all') return categories
  return categories.filter(c => c.gender === gender || c.gender === 'all')
}

export function getMainCategories(): Category[] {
  return categories.filter(c => ['women', 'men', 'kids'].includes(c.id))
}

export function getShopCategories(): Category[] {
  return categories.filter(c => !['women', 'men', 'kids'].includes(c.id))
}
