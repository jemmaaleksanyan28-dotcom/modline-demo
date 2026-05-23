import type { Product } from '@/lib/types'

export const products: Product[] = [
  {
    id: '1',
    name: { fa: 'کت چرم مشکی کلاسیک', en: 'Classic Black Leather Jacket' },
    description: {
      fa: 'کت چرم اصل با طراحی کلاسیک و مدرن، مناسب برای استایل‌های مختلف. دارای زیپ فلزی و جیب‌های کاربردی.',
      en: 'Genuine leather jacket with classic and modern design, suitable for various styles. Features metal zipper and functional pockets.'
    },
    price: 2850000,
    originalPrice: 3500000,
    images: [
      '/images/fashion/product-7.webp',
      '/images/fashion/product-13.webp'
    ],
    category: 'jackets',
    subcategory: 'leather',
    brand: 'Modline Studio',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: { fa: 'مشکی', en: 'Black' }, hex: '#000000' },
      { name: { fa: 'قهوه‌ای', en: 'Brown' }, hex: '#8B4513' }
    ],
    inStock: true,
    stockCount: 15,
    rating: 4.8,
    reviewCount: 124,
    tags: ['leather', 'jacket', 'winter'],
    gender: 'men',
    isSale: true,
    createdAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    name: { fa: 'پیراهن کتان سفید', en: 'White Linen Shirt' },
    description: {
      fa: 'پیراهن کتان با کیفیت بالا، سبک و راحت برای فصل‌های گرم. دارای یقه کلاسیک و دکمه‌های صدفی.',
      en: 'High-quality linen shirt, light and comfortable for warm seasons. Features classic collar and mother of pearl buttons.'
    },
    price: 890000,
    images: [
      '/images/fashion/product-14.webp',
      '/images/fashion/product-15.webp'
    ],
    category: 'tops',
    subcategory: 'shirts',
    brand: 'Modline Basic',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: { fa: 'سفید', en: 'White' }, hex: '#FFFFFF' },
      { name: { fa: 'آبی آسمانی', en: 'Sky Blue' }, hex: '#87CEEB' }
    ],
    inStock: true,
    stockCount: 32,
    rating: 4.5,
    reviewCount: 89,
    tags: ['linen', 'shirt', 'summer'],
    gender: 'men',
    isNew: true,
    createdAt: '2024-02-20T10:00:00Z'
  },
  {
    id: '3',
    name: { fa: 'مانتو مجلسی ساتن مشکی', en: 'Black Satin Occasion Coat' },
    description: {
      fa: 'لباس مجلسی شیک از جنس ساتن براق، مناسب برای استایل پوشیده، مهمانی‌ها و مراسم‌های رسمی. دارای برش ظریف و زیبا.',
      en: 'Elegant modest occasion coat made of shiny satin, perfect for parties and formal events. Features delicate and beautiful cut.'
    },
    price: 1650000,
    originalPrice: 2200000,
    images: [
      '/images/fashion/product-4.webp',
      '/images/fashion/product-16.webp'
    ],
    category: 'dresses',
    subcategory: 'evening',
    brand: 'Modline Studio',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [
      { name: { fa: 'مشکی', en: 'Black' }, hex: '#000000' },
      { name: { fa: 'قرمز', en: 'Red' }, hex: '#DC143C' }
    ],
    inStock: true,
    stockCount: 8,
    rating: 4.9,
    reviewCount: 156,
    tags: ['dress', 'evening', 'party'],
    gender: 'women',
    isSale: true,
    createdAt: '2024-01-28T10:00:00Z'
  },
  {
    id: '4',
    name: { fa: 'شلوار جین اسلیم آبی', en: 'Blue Slim Fit Jeans' },
    description: {
      fa: 'شلوار جین با فیت اسلیم و پارچه کش‌دار، بسیار راحت و با دوام. مناسب برای استفاده روزانه.',
      en: 'Slim fit jeans with stretch fabric, very comfortable and durable. Perfect for daily use.'
    },
    price: 780000,
    images: [
      '/images/fashion/product-6.webp',
      '/images/fashion/product-17.webp'
    ],
    category: 'jeans',
    subcategory: 'slim',
    brand: 'Modline Denim',
    sizes: ['28', '30', '32', '34', '36'],
    colors: [
      { name: { fa: 'آبی', en: 'Blue' }, hex: '#1E90FF' },
      { name: { fa: 'آبی تیره', en: 'Dark Blue' }, hex: '#00008B' }
    ],
    inStock: true,
    stockCount: 45,
    rating: 4.6,
    reviewCount: 234,
    tags: ['jeans', 'slim', 'casual'],
    gender: 'men',
    createdAt: '2024-02-05T10:00:00Z'
  },
  {
    id: '5',
    name: { fa: 'کفش ورزشی سفید', en: 'White Sports Sneakers' },
    description: {
      fa: 'کفش ورزشی سبک و راحت با زیره لاستیکی مقاوم، مناسب برای پیاده‌روی و ورزش‌های سبک.',
      en: 'Light and comfortable sports shoes with durable rubber sole, suitable for walking and light sports.'
    },
    price: 1250000,
    originalPrice: 1500000,
    images: [
      '/images/fashion/product-8.webp',
      '/images/fashion/product-18.webp'
    ],
    category: 'shoes',
    subcategory: 'sneakers',
    brand: 'Modline Sport',
    sizes: ['40', '41', '42', '43', '44', '45'],
    colors: [
      { name: { fa: 'سفید', en: 'White' }, hex: '#FFFFFF' },
      { name: { fa: 'مشکی', en: 'Black' }, hex: '#000000' }
    ],
    inStock: true,
    stockCount: 28,
    rating: 4.7,
    reviewCount: 312,
    tags: ['shoes', 'sneakers', 'sports'],
    gender: 'unisex',
    isSale: true,
    createdAt: '2024-02-10T10:00:00Z'
  },
  {
    id: '6',
    name: { fa: 'بلوز بافت یقه اسکی', en: 'Turtleneck Knit Sweater' },
    description: {
      fa: 'بلوز بافت گرم با یقه اسکی، از جنس پشم مرینو با کیفیت عالی. مناسب برای فصل زمستان.',
      en: 'Warm knit sweater with turtleneck, made of high-quality merino wool. Perfect for winter season.'
    },
    price: 1120000,
    images: [
      '/images/fashion/product-19.webp',
      '/images/fashion/product-20.webp'
    ],
    category: 'sweaters',
    subcategory: 'turtleneck',
    brand: 'Modline Studio',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: { fa: 'کرم', en: 'Cream' }, hex: '#FFFDD0' },
      { name: { fa: 'خاکستری', en: 'Gray' }, hex: '#808080' },
      { name: { fa: 'سرمه‌ای', en: 'Navy' }, hex: '#000080' }
    ],
    inStock: true,
    stockCount: 22,
    rating: 4.4,
    reviewCount: 67,
    tags: ['sweater', 'winter', 'wool'],
    gender: 'women',
    isNew: true,
    createdAt: '2024-02-25T10:00:00Z'
  },
  {
    id: '7',
    name: { fa: 'کیف دستی چرم قهوه‌ای', en: 'Brown Leather Handbag' },
    description: {
      fa: 'کیف دستی زنانه از چرم طبیعی با طراحی مینیمال و شیک. دارای بند بلند قابل تنظیم.',
      en: 'Women\'s handbag made of genuine leather with minimal and chic design. Features adjustable long strap.'
    },
    price: 1850000,
    images: [
      '/images/fashion/product-9.webp',
      '/images/fashion/product-1.webp'
    ],
    category: 'bags',
    subcategory: 'handbags',
    brand: 'Modline Leather',
    sizes: ['One Size'],
    colors: [
      { name: { fa: 'قهوه‌ای', en: 'Brown' }, hex: '#8B4513' },
      { name: { fa: 'مشکی', en: 'Black' }, hex: '#000000' }
    ],
    inStock: true,
    stockCount: 12,
    rating: 4.8,
    reviewCount: 98,
    tags: ['bag', 'leather', 'handbag'],
    gender: 'women',
    createdAt: '2024-01-20T10:00:00Z'
  },
  {
    id: '8',
    name: { fa: 'تی‌شرت اورسایز گرافیکی', en: 'Oversized Graphic T-Shirt' },
    description: {
      fa: 'تی‌شرت اورسایز با چاپ گرافیکی خاص، از جنس نخ پنبه ۱۰۰٪. استایل استریت‌ور.',
      en: 'Oversized t-shirt with unique graphic print, made of 100% cotton. Streetwear style.'
    },
    price: 450000,
    images: [
      '/images/fashion/product-19.webp',
      '/images/fashion/product-2.webp'
    ],
    category: 'tops',
    subcategory: 'tshirts',
    brand: 'Modline Street',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: { fa: 'مشکی', en: 'Black' }, hex: '#000000' },
      { name: { fa: 'سفید', en: 'White' }, hex: '#FFFFFF' }
    ],
    inStock: true,
    stockCount: 55,
    rating: 4.3,
    reviewCount: 145,
    tags: ['tshirt', 'oversized', 'streetwear'],
    gender: 'unisex',
    isNew: true,
    createdAt: '2024-03-01T10:00:00Z'
  },
  {
    id: '9',
    name: { fa: 'شلوار پارچه‌ای رسمی', en: 'Formal Dress Pants' },
    description: {
      fa: 'شلوار پارچه‌ای رسمی با فیت استاندارد، مناسب برای محیط کار و مراسم‌های رسمی.',
      en: 'Formal dress pants with standard fit, suitable for work environment and formal events.'
    },
    price: 920000,
    images: [
      '/images/fashion/product-3.webp',
      '/images/fashion/product-4.webp'
    ],
    category: 'pants',
    subcategory: 'dress',
    brand: 'Modline Basic',
    sizes: ['30', '32', '34', '36', '38'],
    colors: [
      { name: { fa: 'سرمه‌ای', en: 'Navy' }, hex: '#000080' },
      { name: { fa: 'مشکی', en: 'Black' }, hex: '#000000' },
      { name: { fa: 'خاکستری', en: 'Gray' }, hex: '#808080' }
    ],
    inStock: true,
    stockCount: 38,
    rating: 4.5,
    reviewCount: 76,
    tags: ['pants', 'formal', 'work'],
    gender: 'men',
    createdAt: '2024-02-08T10:00:00Z'
  },
  {
    id: '10',
    name: { fa: 'ساعت مچی استیل نقره‌ای', en: 'Silver Steel Watch' },
    description: {
      fa: 'ساعت مچی کلاسیک با بند استیل نقره‌ای و صفحه مینیمال. ضد آب تا ۵۰ متر.',
      en: 'Classic wristwatch with silver steel band and minimal dial. Water resistant up to 50 meters.'
    },
    price: 2100000,
    originalPrice: 2800000,
    images: [
      '/images/fashion/product-5.webp',
      '/images/fashion/product-10.webp'
    ],
    category: 'accessories',
    subcategory: 'watches',
    brand: 'Modline Studio',
    sizes: ['One Size'],
    colors: [
      { name: { fa: 'نقره‌ای', en: 'Silver' }, hex: '#C0C0C0' },
      { name: { fa: 'طلایی', en: 'Gold' }, hex: '#FFD700' }
    ],
    inStock: true,
    stockCount: 18,
    rating: 4.6,
    reviewCount: 112,
    tags: ['watch', 'accessories', 'steel'],
    gender: 'men',
    isSale: true,
    createdAt: '2024-01-25T10:00:00Z'
  },
  {
    id: '11',
    name: { fa: 'مانتو بلند زمستانی', en: 'Long Winter Coat' },
    description: {
      fa: 'مانتو بلند زمستانی با آستر گرم، مناسب برای روزهای سرد. دارای کمربند و یقه بزرگ.',
      en: 'Long winter coat with warm lining, perfect for cold days. Features belt and large collar.'
    },
    price: 2450000,
    images: [
      '/images/fashion/product-6.webp',
      '/images/fashion/product-7.webp'
    ],
    category: 'jackets',
    subcategory: 'coats',
    brand: 'Modline Studio',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: { fa: 'شتری', en: 'Camel' }, hex: '#C19A6B' },
      { name: { fa: 'مشکی', en: 'Black' }, hex: '#000000' }
    ],
    inStock: true,
    stockCount: 14,
    rating: 4.7,
    reviewCount: 89,
    tags: ['coat', 'winter', 'long'],
    gender: 'women',
    isNew: true,
    createdAt: '2024-02-28T10:00:00Z'
  },
  {
    id: '12',
    name: { fa: 'کتانی کلاسیک سفید', en: 'Classic White Trainers' },
    description: {
      fa: 'کفش کتانی کلاسیک سفید با طراحی ساده و همه‌کاره، مناسب برای ست‌های مختلف.',
      en: 'Classic white trainers with simple and versatile design, suitable for various outfits.'
    },
    price: 980000,
    images: [
      '/images/fashion/product-8.webp',
      '/images/fashion/product-9.webp'
    ],
    category: 'shoes',
    subcategory: 'trainers',
    brand: 'Modline Sport',
    sizes: ['38', '39', '40', '41', '42', '43'],
    colors: [
      { name: { fa: 'سفید', en: 'White' }, hex: '#FFFFFF' }
    ],
    inStock: true,
    stockCount: 42,
    rating: 4.8,
    reviewCount: 287,
    tags: ['shoes', 'trainers', 'classic'],
    gender: 'unisex',
    createdAt: '2024-02-12T10:00:00Z'
  },
  {
    id: '13',
    name: { fa: 'ست ورزشی پوشیده مشکی', en: 'Black Modest Sports Set' },
    description: {
      fa: 'ست ورزشی سبک با پارچه نرم و راحت، مناسب برای پیاده‌روی و تمرینات سبک.',
      en: 'Light modest sports set with soft fabric, suitable for walking and light workouts.'
    },
    price: 520000,
    images: [
      '/images/fashion/product-10.webp',
      '/images/fashion/product-11.webp'
    ],
    category: 'sportswear',
    subcategory: 'leggings',
    brand: 'Modline Sport',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      { name: { fa: 'مشکی', en: 'Black' }, hex: '#000000' },
      { name: { fa: 'خاکستری', en: 'Gray' }, hex: '#808080' }
    ],
    inStock: true,
    stockCount: 65,
    rating: 4.6,
    reviewCount: 198,
    tags: ['sportswear', 'leggings', 'yoga'],
    gender: 'women',
    createdAt: '2024-02-15T10:00:00Z'
  },
  {
    id: '14',
    name: { fa: 'عینک آفتابی مربعی', en: 'Square Sunglasses' },
    description: {
      fa: 'عینک آفتابی با فریم مربعی و لنز UV400، استایل مدرن و شیک.',
      en: 'Sunglasses with square frame and UV400 lens, modern and chic style.'
    },
    price: 680000,
    images: [
      '/images/fashion/product-11.webp',
      '/images/fashion/product-12.webp'
    ],
    category: 'accessories',
    subcategory: 'sunglasses',
    brand: 'Modline Studio',
    sizes: ['One Size'],
    colors: [
      { name: { fa: 'مشکی', en: 'Black' }, hex: '#000000' },
      { name: { fa: 'قهوه‌ای', en: 'Brown' }, hex: '#8B4513' }
    ],
    inStock: true,
    stockCount: 35,
    rating: 4.4,
    reviewCount: 78,
    tags: ['accessories', 'sunglasses', 'summer'],
    gender: 'unisex',
    createdAt: '2024-02-18T10:00:00Z'
  },
  {
    id: '15',
    name: { fa: 'هودی اورسایز خاکستری', en: 'Gray Oversized Hoodie' },
    description: {
      fa: 'هودی اورسایز راحت با جیب کانگورویی، از جنس فلیس نرم و گرم.',
      en: 'Comfortable oversized hoodie with kangaroo pocket, made of soft and warm fleece.'
    },
    price: 750000,
    images: [
      '/images/fashion/product-12.webp',
      '/images/fashion/product-13.webp'
    ],
    category: 'sweaters',
    subcategory: 'hoodies',
    brand: 'Modline Street',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: { fa: 'خاکستری', en: 'Gray' }, hex: '#808080' },
      { name: { fa: 'مشکی', en: 'Black' }, hex: '#000000' },
      { name: { fa: 'سفید', en: 'White' }, hex: '#FFFFFF' }
    ],
    inStock: true,
    stockCount: 48,
    rating: 4.7,
    reviewCount: 234,
    tags: ['hoodie', 'oversized', 'casual'],
    gender: 'unisex',
    isNew: true,
    createdAt: '2024-03-02T10:00:00Z'
  },
  {
    id: '16',
    name: { fa: 'دامن پلیسه میدی', en: 'Pleated Midi Skirt' },
    description: {
      fa: 'دامن پلیسه میدی با کمر کشی، بسیار راحت و شیک برای استایل‌های مختلف.',
      en: 'Pleated midi skirt with elastic waist, very comfortable and chic for various styles.'
    },
    price: 620000,
    images: [
      '/images/fashion/product-14.webp',
      '/images/fashion/product-15.webp'
    ],
    category: 'clothing',
    subcategory: 'skirts',
    brand: 'Modline Studio',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [
      { name: { fa: 'مشکی', en: 'Black' }, hex: '#000000' },
      { name: { fa: 'کرم', en: 'Cream' }, hex: '#FFFDD0' },
      { name: { fa: 'سبز زیتونی', en: 'Olive' }, hex: '#808000' }
    ],
    inStock: true,
    stockCount: 26,
    rating: 4.5,
    reviewCount: 67,
    tags: ['skirt', 'pleated', 'midi'],
    gender: 'women',
    createdAt: '2024-02-22T10:00:00Z'
  },
  {
    id: '17',
    name: { fa: 'کمربند چرمی کلاسیک', en: 'Classic Leather Belt' },
    description: {
      fa: 'کمربند چرم طبیعی با سگک فلزی، مناسب برای استایل‌های رسمی و کژوال.',
      en: 'Genuine leather belt with metal buckle, suitable for formal and casual styles.'
    },
    price: 380000,
    images: [
      '/images/fashion/product-16.webp',
      '/images/fashion/product-17.webp'
    ],
    category: 'accessories',
    subcategory: 'belts',
    brand: 'Modline Basic',
    sizes: ['85', '90', '95', '100', '105'],
    colors: [
      { name: { fa: 'مشکی', en: 'Black' }, hex: '#000000' },
      { name: { fa: 'قهوه‌ای', en: 'Brown' }, hex: '#8B4513' }
    ],
    inStock: true,
    stockCount: 52,
    rating: 4.6,
    reviewCount: 123,
    tags: ['belt', 'leather', 'accessories'],
    gender: 'men',
    createdAt: '2024-01-30T10:00:00Z'
  },
  {
    id: '18',
    name: { fa: 'کیف دستی تابستانی شیک', en: 'Chic Summer Handbag' },
    description: {
      fa: 'کیف دستی سبک با طراحی مینیمال، مناسب برای استایل روزمره و مهمانی‌های تابستانی.',
      en: 'Light handbag with minimal design, suitable for everyday style and summer occasions.'
    },
    price: 890000,
    originalPrice: 1200000,
    images: [
      '/images/fashion/product-18.webp',
      '/images/fashion/product-19.webp'
    ],
    category: 'bags',
    subcategory: 'handbags',
    brand: 'Modline Studio',
    sizes: ['36', '37', '38', '39', '40'],
    colors: [
      { name: { fa: 'مشکی', en: 'Black' }, hex: '#000000' },
      { name: { fa: 'نود', en: 'Nude' }, hex: '#E3BC9A' }
    ],
    inStock: true,
    stockCount: 19,
    rating: 4.3,
    reviewCount: 56,
    tags: ['bag', 'summer', 'accessories'],
    gender: 'women',
    isSale: true,
    createdAt: '2024-02-14T10:00:00Z'
  },
  {
    id: '19',
    name: { fa: 'کلاه بیسبال مشکی', en: 'Black Baseball Cap' },
    description: {
      fa: 'کلاه بیسبال با طراحی ساده و بند قابل تنظیم، مناسب برای استایل کژوال.',
      en: 'Baseball cap with simple design and adjustable strap, perfect for casual style.'
    },
    price: 280000,
    images: [
      '/images/fashion/product-20.webp',
      '/images/fashion/product-1.webp'
    ],
    category: 'accessories',
    subcategory: 'hats',
    brand: 'Modline Sport',
    sizes: ['One Size'],
    colors: [
      { name: { fa: 'مشکی', en: 'Black' }, hex: '#000000' },
      { name: { fa: 'سفید', en: 'White' }, hex: '#FFFFFF' },
      { name: { fa: 'سرمه‌ای', en: 'Navy' }, hex: '#000080' }
    ],
    inStock: true,
    stockCount: 78,
    rating: 4.5,
    reviewCount: 167,
    tags: ['cap', 'accessories', 'casual'],
    gender: 'unisex',
    createdAt: '2024-02-02T10:00:00Z'
  },
  {
    id: '20',
    name: { fa: 'بلیزر تک دکمه مشکی', en: 'Single Button Black Blazer' },
    description: {
      fa: 'بلیزر تک دکمه با فیت اسلیم، مناسب برای مراسم‌های رسمی و محیط کار.',
      en: 'Single button blazer with slim fit, suitable for formal events and work environment.'
    },
    price: 1680000,
    images: [
      '/images/fashion/product-2.webp',
      '/images/fashion/product-3.webp'
    ],
    category: 'jackets',
    subcategory: 'blazers',
    brand: 'Modline Basic',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: { fa: 'مشکی', en: 'Black' }, hex: '#000000' },
      { name: { fa: 'سرمه‌ای', en: 'Navy' }, hex: '#000080' }
    ],
    inStock: true,
    stockCount: 21,
    rating: 4.7,
    reviewCount: 94,
    tags: ['blazer', 'formal', 'work'],
    gender: 'men',
    createdAt: '2024-01-18T10:00:00Z'
  }
]

export function getProductById(id: string): Product | undefined {
  return products.find(p => p.id === id)
}

export function getProductsByCategory(category: string): Product[] {
  return products.filter(p => p.category === category || p.subcategory === category)
}

export function getProductsByGender(gender: string): Product[] {
  if (gender === 'all') return products
  return products.filter(p => p.gender === gender || p.gender === 'unisex')
}

export function getSaleProducts(): Product[] {
  return products.filter(p => p.isSale)
}

export function getNewProducts(): Product[] {
  return products.filter(p => p.isNew)
}

export function searchProducts(query: string, locale: 'fa' | 'en' = 'fa'): Product[] {
  const searchLower = query.toLowerCase()
  return products.filter(p => 
    p.name[locale].toLowerCase().includes(searchLower) ||
    p.description[locale].toLowerCase().includes(searchLower) ||
    p.brand.toLowerCase().includes(searchLower) ||
    p.tags.some(tag => tag.toLowerCase().includes(searchLower))
  )
}

export function getRelatedProducts(product: Product, limit: number = 4): Product[] {
  return products
    .filter(p => p.id !== product.id && (p.category === product.category || p.gender === product.gender))
    .slice(0, limit)
}

export const brands = [...new Set(products.map(p => p.brand))]
export const categories = [...new Set(products.map(p => p.category))]
export const sizes = [...new Set(products.flatMap(p => p.sizes))]
