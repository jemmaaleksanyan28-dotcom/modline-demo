import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { ordersStore } from '@/lib/server/orders-store'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET() {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  return NextResponse.json({ orders: ordersStore.byUser(user.userId) })
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await request.json()
    const order = ordersStore.create({
      userId: user.userId,
      items: body.items || [],
      shippingAddress: body.shippingAddress,
      shipping: body.shipping,
      discount: body.discount,
    })
    return NextResponse.json({ order }, { status: 201 })
  } catch (error) {
    console.error('Create order error:', error)
    return NextResponse.json({ error: 'Could not create order' }, { status: 400 })
  }
}
