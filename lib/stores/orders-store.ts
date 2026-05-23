'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Order, CartItem, Address, OrderStatus } from '@/lib/types'

interface OrdersStore {
  orders: Order[]
  createOrder: (
    userId: string,
    items: CartItem[],
    shippingAddress: Address,
    subtotal: number,
    shipping: number,
    discount: number
  ) => Order
  updateOrderStatus: (orderId: string, status: OrderStatus) => void
  updatePaymentInfo: (orderId: string, authority: string, refId?: string) => void
  updateTracking: (orderId: string, trackingCode: string, adminNote?: string) => void
  getOrderById: (orderId: string) => Order | undefined
  getOrdersByUserId: (userId: string) => Order[]
  setOrders: (orders: Order[]) => void
  upsertOrder: (order: Order) => void
}

export const useOrdersStore = create<OrdersStore>()(
  persist(
    (set, get) => ({
      orders: [],

      setOrders: (orders) => set({ orders }),

      upsertOrder: (order) => set((state) => ({
        orders: state.orders.some((item) => item.id === order.id)
          ? state.orders.map((item) => item.id === order.id ? order : item)
          : [order, ...state.orders]
      })),
      
      createOrder: (userId, items, shippingAddress, subtotal, shipping, discount) => {
        const newOrder: Order = {
          id: `ORD-${Date.now()}`,
          userId,
          items,
          subtotal,
          shipping,
          discount,
          total: subtotal + shipping - discount,
          status: 'pending',
          shippingAddress,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        
        set((state) => ({
          orders: [newOrder, ...state.orders]
        }))
        
        return newOrder
      },
      
      updateOrderStatus: (orderId, status) => {
        set((state) => ({
          orders: state.orders.map((order) =>
            order.id === orderId
              ? { ...order, status, updatedAt: new Date().toISOString() }
              : order
          )
        }))
      },
      
      updatePaymentInfo: (orderId, authority, refId) => {
        set((state) => ({
          orders: state.orders.map((order) =>
            order.id === orderId
              ? {
                  ...order,
                  paymentAuthority: authority,
                  refId,
                  status: refId ? 'paid' : order.status,
                  updatedAt: new Date().toISOString()
                }
              : order
          )
        }))
      },
      
      updateTracking: (orderId, trackingCode, adminNote) => {
        set((state) => ({
          orders: state.orders.map((order) =>
            order.id === orderId
              ? { ...order, trackingCode, adminNote, updatedAt: new Date().toISOString() }
              : order
          )
        }))
      },
      
      getOrderById: (orderId) => {
        return get().orders.find((order) => order.id === orderId)
      },
      
      getOrdersByUserId: (userId) => {
        return get().orders.filter((order) => order.userId === userId)
      }
    }),
    {
      name: 'modline-orders'
    }
  )
)
