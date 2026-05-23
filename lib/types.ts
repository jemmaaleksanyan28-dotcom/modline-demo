export interface LocalizedString {
  fa: string
  en: string
}

export interface ProductColor {
  name: LocalizedString
  hex: string
}

export interface Product {
  id: string
  name: LocalizedString
  description: LocalizedString
  price: number
  originalPrice?: number
  images: string[]
  category: string
  subcategory: string
  brand: string
  sizes: string[]
  colors: ProductColor[]
  inStock: boolean
  stockCount: number
  rating: number
  reviewCount: number
  tags: string[]
  gender: 'women' | 'men' | 'kids' | 'unisex'
  isNew?: boolean
  isSale?: boolean
  createdAt: string
}

export interface CartItem {
  product: Product
  quantity: number
  size: string
  color: string
}

export interface WishlistItem {
  productId: string
  addedAt: string
}

export interface Address {
  id: string
  firstName: string
  lastName: string
  phone?: string
  addressLine1: string
  addressLine2?: string | null
  city: string
  state: string
  postalCode: string
  country: string
  isDefault: boolean
}

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  role: 'admin' | 'user'
  addresses: Address[]
  createdAt: string
  updatedAt?: string
}

export type OrderStatus = 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled'

export interface Order {
  id: string
  userId: string
  items: CartItem[]
  subtotal: number
  shipping: number
  discount: number
  total: number
  status: OrderStatus
  shippingAddress: Address
  paymentAuthority?: string
  refId?: string
  trackingCode?: string
  adminNote?: string
  createdAt: string
  updatedAt: string
}

export interface Category {
  id: string
  name: LocalizedString
  slug: string
  image: string
  parentId?: string
  gender: 'women' | 'men' | 'kids' | 'all'
}

export interface FilterState {
  categories: string[]
  brands: string[]
  sizes: string[]
  colors: string[]
  priceRange: [number, number]
  gender: string | null
  sortBy: 'newest' | 'price-asc' | 'price-desc' | 'popular'
}
