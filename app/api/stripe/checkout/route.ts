import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { createClient } from '@supabase/supabase-js'

function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('Payment system is not configured. Please contact support.')
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2023-10-16',
  })
}

const PLANS: Record<string, { priceId: string; name: string }> = {
  starter: {
    priceId: process.env.STRIPE_PRICE_STARTER!,
    name: 'Starter',
  },
  professional: {
    priceId: process.env.STRIPE_PRICE_PRO!,
    name: 'Professional',
  },
  enterprise: {
    priceId: process.env.STRIPE_PRICE_ENTERPRISE!,
    name: 'Enterprise',
  },
}

export async function POST(req: NextRequest) {
  try {
    const stripe = getStripe()
    const body = await req.json()
    
    // Support both direct planId/userId calls and planName from pricing page
    let planId = body.planId
    let userId = body.userId
    let userEmail = body.userEmail

    // If coming from the plans page (planName + billingPeriod)
    if (body.planName) {
      planId = body.planName.toLowerCase()
    }

    // If no userId provided, get from session
    if (!userId || !userEmail) {
      const supabaseAuth = createRouteHandlerClient({ cookies })
      const { data: { session } } = await supabaseAuth.auth.getSession()
      
      if (!session) {
        return NextResponse.json(
          { error: 'Please sign in to subscribe to a plan' },
          { status: 401 }
        )
      }
      
      userId = session.user.id
      userEmail = session.user.email
    }

    if (!planId) {
      return NextResponse.json(
        { error: 'Please select a plan to continue' },
        { status: 400 }
      )
    }

    const plan = PLANS[planId]
    if (!plan) {
      return NextResponse.json(
        { error: 'The selected plan is not available. Please try a different plan.' },
        { status: 400 }
      )
    }

    if (!plan.priceId) {
      return NextResponse.json(
        { error: 'This plan is not yet available for purchase. Please contact support.' },
        { status: 500 }
      )
    }

    // Check for existing Stripe customer
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data: subscription } = await supabaseAdmin
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', userId)
      .single()

    let customerId = subscription?.stripe_customer_id

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: userEmail,
        metadata: { supabase_user_id: userId },
      })
      customerId = customer.id
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://ai-assist-smes.vercel.app'

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [{ price: plan.priceId, quantity: 1 }],
      mode: 'subscription',
      success_url: `${appUrl}/dashboard?subscription=success&plan=${planId}`,
      cancel_url: `${appUrl}/plans?cancelled=true`,
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
      metadata: {
        user_id: userId,
        plan_id: planId,
      },
      subscription_data: {
        metadata: {
          user_id: userId,
          plan_id: planId,
        },
      },
    })

    return NextResponse.json({ url: session.url, sessionId: session.id })
  } catch (error: unknown) {
    console.error('Stripe checkout error:', error)
    
    // Return user-friendly error messages instead of raw Stripe errors
    const message = error instanceof Error ? error.message : 'Something went wrong. Please try again.'
    const lowerMsg = message.toLowerCase()
    
    // Don't expose internal error details to the user
    let safeMessage = 'Something went wrong. Please try again.'
    if (lowerMsg.includes('no such price') || lowerMsg.includes('resource_missing') || lowerMsg.includes('invalid_request')) {
      safeMessage = 'This plan is temporarily unavailable. Please try again later or contact support.'
    } else if (lowerMsg.includes('authentication') || lowerMsg.includes('api key')) {
      safeMessage = 'Payment system configuration error. Please contact support.'
    } else if (!lowerMsg.includes('stripe') && !lowerMsg.includes('api')) {
      safeMessage = message
    }
    return NextResponse.json({ error: safeMessage }, { status: 500 })
  }
}
