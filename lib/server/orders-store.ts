import fs from 'node:fs'
import path from 'node:path'
import type { Address, CartItem, Order, OrderStatus } from '@/lib/types'
import { catalogStore } from '@/lib/server/catalog-store'
import { products } from '@/lib/data/products'

const dataDir = path.join(process.cwd(), 'data')
const ordersFile = path.join(dataDir, 'orders.json')

const demoShippingAddress: Address = {
  id: 'demo-address-1',
  firstName: 'کاربر',
  lastName: 'دمو',
  phone: '09120000000',
  addressLine1: 'تهران، خیابان نمونه، پلاک ۱۲',
  addressLine2: 'واحد ۴',
  city: 'تهران',
  state: 'تهران',
  postalCode: '1234567890',
  country: 'ایران',
  isDefault: true,
}

const demoOrders: Order[] = [
  {
    id: 'ORD-DEMO-1001',
    userId: 'demo-user',
    items: [
      { product: products[0], quantity: 1, size: 'L', color: 'مشکی' },
      { product: products[4], quantity: 1, size: '42', color: 'سفید' },
    ],
    subtotal: products[0].price + products[4].price,
    shipping: 85000,
    discount: 150000,
    total: products[0].price + products[4].price + 85000 - 150000,
    status: 'shipped',
    shippingAddress: demoShippingAddress,
    trackingCode: 'POST-DEMO-245879',
    adminNote: 'سفارش نمونه برای نمایش جریان کاربر و ادمین',
    createdAt: '2026-05-20T10:30:00.000Z',
    updatedAt: '2026-05-22T12:15:00.000Z',
  },
  {
    id: 'ORD-DEMO-1002',
    userId: 'demo-user',
    items: [
      { product: products[2], quantity: 1, size: 'M', color: 'مشکی' },
    ],
    subtotal: products[2].price,
    shipping: 85000,
    discount: 0,
    total: products[2].price + 85000,
    status: 'processing',
    shippingAddress: demoShippingAddress,
    createdAt: '2026-05-21T09:20:00.000Z',
    updatedAt: '2026-05-21T09:20:00.000Z',
  },
]

let memoryOrders: Order[] = [...demoOrders]

function canUseFileStorage() {
  return process.env.VERCEL !== '1'
}

function ensureOrdersFile() {
  if (!canUseFileStorage()) return
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true })
  if (!fs.existsSync(ordersFile)) fs.writeFileSync(ordersFile, JSON.stringify(demoOrders, null, 2), 'utf8')
}

function readOrders(): Order[] {
  if (!canUseFileStorage()) return memoryOrders
  try {
    ensureOrdersFile()
    const raw = fs.readFileSync(ordersFile, 'utf8')
    const parsed = JSON.parse(raw) as Order[]
    return Array.isArray(parsed) && parsed.length ? parsed : demoOrders
  } catch {
    return memoryOrders
  }
}

function writeOrders(orders: Order[]) {
  memoryOrders = orders
  if (!canUseFileStorage()) return
  try {
    ensureOrdersFile()
    fs.writeFileSync(ordersFile, JSON.stringify(orders, null, 2), 'utf8')
  } catch {
    // Serverless demo fallback: keep data in process memory for the current invocation.
  }
}

function normalizeItems(items: CartItem[]): CartItem[] {
  return items.map((item) => {
    const product = catalogStore.get(item.product.id)
    if (!product) throw new Error(`Product not found: ${item.product.id}`)
    const quantity = Math.max(1, Number(item.quantity || 1))
    return {
      product,
      quantity,
      size: item.size,
      color: item.color,
    }
  })
}

export const ordersStore = {
  list() {
    return readOrders()
  },

  byUser(userId: string) {
    return readOrders().filter((order) => order.userId === userId)
  },

  create(input: {
    userId: string
    items: CartItem[]
    shippingAddress: Address
    shipping?: number
    discount?: number
  }) {
    const items = normalizeItems(input.items)
    const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
    const shipping = Number(input.shipping || 0)
    const discount = Number(input.discount || 0)
    const now = new Date().toISOString()
    items.forEach((item) => catalogStore.decrementStock(item.product.id, item.quantity))

    const order: Order = {
      id: `ORD-${Date.now()}`,
      userId: input.userId,
      items,
      subtotal,
      shipping,
      discount,
      total: subtotal + shipping - discount,
      status: 'paid',
      shippingAddress: input.shippingAddress || demoShippingAddress,
      createdAt: now,
      updatedAt: now,
    }

    const orders = readOrders()
    writeOrders([order, ...orders])
    return order
  },

  update(id: string, input: { status?: OrderStatus; trackingCode?: string; adminNote?: string }) {
    const orders = readOrders()
    let updated: Order | null = null
    const nextOrders = orders.map((order) => {
      if (order.id !== id) return order
      updated = {
        ...order,
        ...input,
        updatedAt: new Date().toISOString(),
      }
      return updated
    })
    if (!updated) return null
    writeOrders(nextOrders)
    return updated
  }
}
