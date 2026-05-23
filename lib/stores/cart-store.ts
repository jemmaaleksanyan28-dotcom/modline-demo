'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem, Product } from '@/lib/types'

interface CartStore {
  items: CartItem[]
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  addItem: (product: Product, size: string, color: string, quantity?: number) => void
  removeItem: (productId: string, size: string, color: string) => void
  updateQuantity: (productId: string, size: string, color: string, quantity: number) => void
  clearCart: () => void
  getItemCount: () => number
  getSubtotal: () => number
  getShipping: () => number
  getTotal: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      
      setIsOpen: (open) => set({ isOpen: open }),
      
      addItem: (product, size, color, quantity = 1) => {
        set((state) => {
          const existingIndex = state.items.findIndex(
            (item) =>
              item.product.id === product.id &&
              item.size === size &&
              item.color === color
          )
          
          if (existingIndex > -1) {
            const newItems = [...state.items]
            newItems[existingIndex].quantity += quantity
            return { items: newItems }
          }
          
          return {
            items: [...state.items, { product, size, color, quantity }]
          }
        })
      },
      
      removeItem: (productId, size, color) => {
        set((state) => ({
          items: state.items.filter(
            (item) =>
              !(item.product.id === productId &&
                item.size === size &&
                item.color === color)
          )
        }))
      },
      
      updateQuantity: (productId, size, color, quantity) => {
        set((state) => {
          if (quantity <= 0) {
            return {
              items: state.items.filter(
                (item) =>
                  !(item.product.id === productId &&
                    item.size === size &&
                    item.color === color)
              )
            }
          }
          
          const newItems = state.items.map((item) => {
            if (
              item.product.id === productId &&
              item.size === size &&
              item.color === color
            ) {
              return { ...item, quantity }
            }
            return item
          })
          
          return { items: newItems }
        })
      },
      
      clearCart: () => set({ items: [] }),
      
      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0)
      },
      
      getSubtotal: () => {
        return get().items.reduce(
          (sum, item) => sum + item.product.price * item.quantity,
          0
        )
      },
      
      getShipping: () => {
        const subtotal = get().getSubtotal()
        return subtotal >= 500000 ? 0 : 50000
      },
      
      getTotal: () => {
        return get().getSubtotal() + get().getShipping()
      }
    }),
    {
      name: 'modline-cart'
    }
  )
)
