import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { products as initialProducts } from '@/lib/data/products'
import type { Product } from '@/lib/types'

type ProductInput = Omit<Product, 'id' | 'createdAt' | 'rating' | 'reviewCount'> & {
  id?: string
  createdAt?: string
  rating?: number
  reviewCount?: number
}

const dataDir = path.join(process.cwd(), 'data')
const catalogFile = path.join(dataDir, 'products.json')
let memoryProducts: Product[] = [...initialProducts]

function canUseFileStorage() {
  return process.env.VERCEL !== '1'
}

function ensureCatalogFile() {
  if (!canUseFileStorage()) return
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true })
  if (!fs.existsSync(catalogFile)) {
    fs.writeFileSync(catalogFile, JSON.stringify(initialProducts, null, 2), 'utf8')
  }
}

function readProducts(): Product[] {
  if (!canUseFileStorage()) return memoryProducts
  try {
    ensureCatalogFile()
    const raw = fs.readFileSync(catalogFile, 'utf8')
    const parsed = JSON.parse(raw) as Product[]
    return Array.isArray(parsed) ? parsed : initialProducts
  } catch {
    return memoryProducts
  }
}

function writeProducts(products: Product[]) {
  memoryProducts = products
  if (!canUseFileStorage()) return
  try {
    ensureCatalogFile()
    fs.writeFileSync(catalogFile, JSON.stringify(products, null, 2), 'utf8')
  } catch {
    // Serverless demo fallback: keep data in process memory for the current invocation.
  }
}

function normalizeProduct(input: ProductInput): Product {
  const stockCount = Number(input.stockCount || 0)
  const price = Number(input.price || 0)
  const originalPrice = input.originalPrice ? Number(input.originalPrice) : undefined

  return {
    ...input,
    id: input.id || `PRD-${crypto.randomUUID()}`,
    createdAt: input.createdAt || new Date().toISOString(),
    price,
    originalPrice,
    rating: input.rating ?? 0,
    reviewCount: input.reviewCount ?? 0,
    images: input.images?.length ? input.images : ['/images/fashion/product-1.webp'],
    sizes: input.sizes?.length ? input.sizes : ['M'],
    colors: input.colors?.length
      ? input.colors
      : [{ name: { fa: 'مشکی', en: 'Black' }, hex: '#000000' }],
    tags: input.tags || [],
    inStock: stockCount > 0 && input.inStock !== false,
    stockCount,
  }
}

export const catalogStore = {
  list() {
    return readProducts()
  },

  get(id: string) {
    return readProducts().find((product) => product.id === id) || null
  },

  create(input: ProductInput) {
    const products = readProducts()
    const product = normalizeProduct(input)
    writeProducts([product, ...products])
    return product
  },

  update(id: string, input: Partial<Product>) {
    const products = readProducts()
    let updated: Product | null = null
    const nextProducts = products.map((product) => {
      if (product.id !== id) return product
      updated = normalizeProduct({ ...product, ...input, id: product.id, createdAt: product.createdAt })
      return updated
    })
    if (!updated) return null
    writeProducts(nextProducts)
    return updated
  },

  delete(id: string) {
    const products = readProducts()
    const nextProducts = products.filter((product) => product.id !== id)
    if (nextProducts.length === products.length) return false
    writeProducts(nextProducts)
    return true
  },

  decrementStock(id: string, quantity: number) {
    const products = readProducts()
    const nextProducts = products.map((product) => {
      if (product.id !== id) return product
      const stockCount = Math.max(0, Number(product.stockCount || 0) - Math.max(1, quantity))
      return { ...product, stockCount, inStock: stockCount > 0 }
    })
    writeProducts(nextProducts)
  },

  reset() {
    writeProducts([...initialProducts])
    return initialProducts
  }
}
