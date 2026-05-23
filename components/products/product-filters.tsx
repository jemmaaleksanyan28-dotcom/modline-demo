'use client'

import { useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Separator } from '@/components/ui/separator'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { formatPriceShort } from '@/lib/format'
import type { FilterState } from '@/lib/types'
import type { Locale } from '@/i18n/config'

interface ProductFiltersProps {
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
  brands: string[]
  categories: string[]
}

const categoryTranslations: Record<string, { fa: string; en: string }> = {
  jackets: { fa: 'ژاکت و کاپشن', en: 'Jackets & Coats' },
  tops: { fa: 'بالاتنه', en: 'Tops' },
  dresses: { fa: 'لباس مجلسی', en: 'Dresses' },
  jeans: { fa: 'شلوار جین', en: 'Jeans' },
  shoes: { fa: 'کفش', en: 'Shoes' },
  bags: { fa: 'کیف', en: 'Bags' },
  accessories: { fa: 'اکسسوری', en: 'Accessories' },
  sportswear: { fa: 'ورزشی', en: 'Sportswear' },
  sweaters: { fa: 'بافت و سویشرت', en: 'Sweaters' },
  pants: { fa: 'شلوار', en: 'Pants' },
  clothing: { fa: 'پوشاک', en: 'Clothing' }
}

const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '28', '30', '32', '34', '36', '38', '40', '41', '42', '43', '44', '45']
const colors = [
  { name: { fa: 'مشکی', en: 'Black' }, hex: '#000000' },
  { name: { fa: 'سفید', en: 'White' }, hex: '#FFFFFF' },
  { name: { fa: 'آبی', en: 'Blue' }, hex: '#1E90FF' },
  { name: { fa: 'قرمز', en: 'Red' }, hex: '#DC143C' },
  { name: { fa: 'سبز', en: 'Green' }, hex: '#228B22' },
  { name: { fa: 'خاکستری', en: 'Gray' }, hex: '#808080' },
  { name: { fa: 'قهوه‌ای', en: 'Brown' }, hex: '#8B4513' },
  { name: { fa: 'کرم', en: 'Cream' }, hex: '#FFFDD0' }
]

export function ProductFilters({ filters, onFiltersChange, brands, categories }: ProductFiltersProps) {
  const params = useParams()
  const locale = params.locale as Locale
  const t = useTranslations('filters')

  const toggleCategory = (category: string) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter(c => c !== category)
      : [...filters.categories, category]
    onFiltersChange({ ...filters, categories: newCategories })
  }

  const toggleBrand = (brand: string) => {
    const newBrands = filters.brands.includes(brand)
      ? filters.brands.filter(b => b !== brand)
      : [...filters.brands, brand]
    onFiltersChange({ ...filters, brands: newBrands })
  }

  const toggleSize = (size: string) => {
    const newSizes = filters.sizes.includes(size)
      ? filters.sizes.filter(s => s !== size)
      : [...filters.sizes, size]
    onFiltersChange({ ...filters, sizes: newSizes })
  }

  const toggleColor = (color: string) => {
    const newColors = filters.colors.includes(color)
      ? filters.colors.filter(c => c !== color)
      : [...filters.colors, color]
    onFiltersChange({ ...filters, colors: newColors })
  }

  return (
    <div className="space-y-4">
      <Accordion type="multiple" defaultValue={['category', 'brand', 'size', 'price']} className="w-full">
        {/* Categories */}
        <AccordionItem value="category">
          <AccordionTrigger className="text-sm font-semibold">{t('category')}</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category} className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Checkbox
                    id={`cat-${category}`}
                    checked={filters.categories.includes(category)}
                    onCheckedChange={() => toggleCategory(category)}
                  />
                  <Label htmlFor={`cat-${category}`} className="text-sm cursor-pointer">
                    {categoryTranslations[category]?.[locale] || category}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Brands */}
        <AccordionItem value="brand">
          <AccordionTrigger className="text-sm font-semibold">{t('brand')}</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {brands.map((brand) => (
                <div key={brand} className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Checkbox
                    id={`brand-${brand}`}
                    checked={filters.brands.includes(brand)}
                    onCheckedChange={() => toggleBrand(brand)}
                  />
                  <Label htmlFor={`brand-${brand}`} className="text-sm cursor-pointer">
                    {brand}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Sizes */}
        <AccordionItem value="size">
          <AccordionTrigger className="text-sm font-semibold">{t('size')}</AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-wrap gap-2">
              {sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => toggleSize(size)}
                  className={`px-3 py-1.5 text-xs border rounded-md transition-colors ${
                    filters.sizes.includes(size)
                      ? 'bg-foreground text-background border-foreground'
                      : 'hover:border-foreground'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Colors */}
        <AccordionItem value="color">
          <AccordionTrigger className="text-sm font-semibold">{t('color')}</AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-wrap gap-2">
              {colors.map((color) => (
                <button
                  key={color.hex}
                  onClick={() => toggleColor(color.hex)}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${
                    filters.colors.includes(color.hex)
                      ? 'ring-2 ring-foreground ring-offset-2'
                      : 'hover:scale-110'
                  }`}
                  style={{ backgroundColor: color.hex }}
                  title={color.name[locale]}
                />
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Price Range */}
        <AccordionItem value="price">
          <AccordionTrigger className="text-sm font-semibold">{t('priceRange')}</AccordionTrigger>
          <AccordionContent>
            <div className="px-2 pt-2 pb-4">
              <Slider
                min={0}
                max={5000000}
                step={100000}
                value={filters.priceRange}
                onValueChange={(value) => onFiltersChange({ ...filters, priceRange: value as [number, number] })}
                className="mb-4"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{formatPriceShort(filters.priceRange[0], locale)} {locale === 'fa' ? 'تومان' : 'T'}</span>
                <span>{formatPriceShort(filters.priceRange[1], locale)} {locale === 'fa' ? 'تومان' : 'T'}</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
