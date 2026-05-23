import fs from 'node:fs/promises'
import path from 'node:path'
import crypto from 'node:crypto'
import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export const runtime = 'nodejs'

const allowedTypes = new Set(['image/jpeg', 'image/png', 'image/webp'])
const maxSizeBytes = 6 * 1024 * 1024

async function requireAdmin() {
  const user = await getCurrentUser()
  if (!user) return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }
  if (user.role !== 'admin') return { error: NextResponse.json({ error: 'Forbidden' }, { status: 403 }) }
  return { user }
}

function safeExtension(type: string) {
  if (type === 'image/png') return 'png'
  if (type === 'image/webp') return 'webp'
  return 'jpg'
}

export async function POST(request: NextRequest) {
  const auth = await requireAdmin()
  if (auth.error) return auth.error

  try {
    const formData = await request.formData()
    const file = formData.get('file')

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'No image file provided' }, { status: 400 })
    }

    if (!allowedTypes.has(file.type)) {
      return NextResponse.json({ error: 'Only JPG, PNG and WebP images are allowed' }, { status: 400 })
    }

    if (file.size > maxSizeBytes) {
      return NextResponse.json({ error: 'Image is too large. Maximum size is 6MB.' }, { status: 400 })
    }

    const extension = safeExtension(file.type)
    const buffer = Buffer.from(await file.arrayBuffer())
    if (process.env.VERCEL === '1') {
      // Vercel demo deployments do not provide persistent writable storage.
      // Return an existing local sample image so the admin flow remains demonstrable.
      return NextResponse.json({
        url: '/uploads/products/sample-boutique.webp',
        size: file.size,
        type: file.type,
        demo: true,
      }, { status: 201 })
    }

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'products')
    await fs.mkdir(uploadsDir, { recursive: true })

    const fileName = `${new Date().toISOString().slice(0, 10)}-${crypto.randomUUID()}.${extension}`
    const filePath = path.join(uploadsDir, fileName)
    await fs.writeFile(filePath, buffer)

    return NextResponse.json({
      url: `/uploads/products/${fileName}`,
      size: file.size,
      type: file.type,
    }, { status: 201 })
  } catch (error) {
    console.error('Upload image error:', error)
    return NextResponse.json({ error: 'Image upload failed' }, { status: 500 })
  }
}
