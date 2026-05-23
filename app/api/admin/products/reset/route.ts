import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { catalogStore } from '@/lib/server/catalog-store'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST() {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (user.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  return NextResponse.json({ products: catalogStore.reset() })
}
