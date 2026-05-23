import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const ZARINPAL_MERCHANT_ID = process.env.ZARINPAL_MERCHANT_ID || 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
const ZARINPAL_SANDBOX = process.env.NODE_ENV !== 'production'

interface PaymentRequest {
  amount: number
  description: string
  callbackUrl: string
  orderId: string
}

export async function POST(request: NextRequest) {
  try {
    const body: PaymentRequest = await request.json()
    const { amount, description, callbackUrl, orderId } = body

    if (!amount || !description || !callbackUrl || !orderId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // ZarinPal API endpoint
    const apiUrl = ZARINPAL_SANDBOX
      ? 'https://sandbox.zarinpal.com/pg/v4/payment/request.json'
      : 'https://api.zarinpal.com/pg/v4/payment/request.json'

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
        amount: amountInRial,
        description,
        callback_url: callbackUrl,
        metadata: {
          order_id: orderId
        }
      })
    })

    const data = await response.json()

    if (data.data?.code === 100) {
      // Payment request successful
      const authority = data.data.authority
      const paymentUrl = ZARINPAL_SANDBOX
        ? `https://sandbox.zarinpal.com/pg/StartPay/${authority}`
        : `https://www.zarinpal.com/pg/StartPay/${authority}`

      return NextResponse.json({
        success: true,
        authority,
        paymentUrl
      })
    } else {
      // Payment request failed
      return NextResponse.json(
        { 
          error: 'Payment request failed',
          code: data.errors?.code,
          message: data.errors?.message
        },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Payment creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
