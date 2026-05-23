'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { products as initialProducts } from '@/lib/data/products'
import type { Product } from '@/lib/types'

type ProductInput = Omit<Product, 'id' | 'createdAt' | 'rating' | 'reviewCount'> & {
  id?: string
  createdAt?: string
  rating?: number
  reviewCount?: number
}

interface ProductStore {
  products: Product[]
  addProduct: (product: ProductInput) => Product
  updateProduct: (id: string, product: Partial<Product>) => void
  deleteProduct: (id: string) => void
  getProductById: (id: string) => Product | undefined
  resetProducts: () => void
  setProducts: (products: Product[]) => void
}

function normalizeProduct(input: ProductInput): Product {
  const stockCount = Number(input.stockCount || 0)

  return {
    ...input,
    id: input.id || `local-${Date.now()}`,
    createdAt: input.createdAt || new Date().toISOString(),
    rating: input.rating ?? 0,
    reviewCount: input.reviewCount ?? 0,
    inStock: stockCount > 0 && input.inStock !== false,
    stockCount,
    images: input.images?.length ? input.images : ['/placeholder.jpg'],
    sizes: input.sizes?.length ? input.sizes : ['M'],
    colors: input.colors?.length
      ? input.colors
      : [{ name: { fa: 'مشکی', en: 'Black' }, hex: '#000000' }],
    tags: input.tags || [],
  }
}

export const useProductStore = create<ProductStore>()(
  persist(
    (set, get) => ({
      products: initialProducts,

      setProducts: (products) => set({ products }),

      addProduct: (product) => {
        const nextProduct = normalizeProduct(product)
        set((state) => ({ products: [nextProduct, ...state.products] }))
        return nextProduct
      },

      updateProduct: (id, product) => {
        set((state) => ({
          products: state.products.map((item) =>
            item.id === id
              ? normalizeProduct({ ...item, ...product, id: item.id, createdAt: item.createdAt })
              : item
          ),
        }))
      },

      deleteProduct: (id) => {
        set((state) => ({ products: state.products.filter((item) => item.id !== id) }))
      },

      getProductById: (id) => get().products.find((item) => item.id === id),

      resetProducts: () => set({ products: initialProducts }),
    }),
    {
      name: 'modline-products',
    }
  )
)
