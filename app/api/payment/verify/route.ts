import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const ZARINPAL_MERCHANT_ID = process.env.ZARINPAL_MERCHANT_ID || 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
const ZARINPAL_SANDBOX = process.env.NODE_ENV !== 'production'

interface VerifyRequest {
  authority: string
  amount: number
}

export async function POST(request: NextRequest) {
  try {
    const body: VerifyRequest = await request.json()
    const { authority, amount } = body

    if (!authority || !amount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // ZarinPal verification endpoint
    const apiUrl = ZARINPAL_SANDBOX
      ? 'https://sandbox.zarinpal.com/pg/v4/payment/verify.json'
      : 'https://api.zarinpal.com/pg/v4/payment/verify.json'

    // Amount should be in Rial (Toman * 10)
    const amountInRial = amount * 10

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        merchant_id: ZARINPAL_MERCHANT_ID,
        authority,
        amount: amountInRial
      })
    })

    const data = await response.json()

    if (data.data?.code === 100 || data.data?.code === 101) {
      // Payment verified successfully
      // code 100: first verification
      // code 101: already verified
      return NextResponse.json({
        success: true,
        refId: data.data.ref_id,
        cardPan: data.data.card_pan,
        cardHash: data.data.card_hash
      })
    } else {
      // Verification failed
      return NextResponse.json(
        { 
          error: 'Payment verification failed',
          code: data.errors?.code,
          message: data.errors?.message
        },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Payment verification error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
