import { NextResponse } from 'next/server'
import { catalogStore } from '@/lib/server/catalog-store'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET() {
  return NextResponse.json({ products: catalogStore.list() }, { headers: { 'Cache-Control': 'no-store' } })
}
