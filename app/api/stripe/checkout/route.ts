import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

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
        { error: 'Plan selection is required' },
        { status: 400 }
      )
    }

    const plan = PLANS[planId]
    if (!plan) {
      return NextResponse.json(
        { error: `Invalid plan: ${planId}. Valid plans: starter, professional, enterprise` },
        { status: 400 }
      )
    }

    if (!plan.priceId) {
      return NextResponse.json(
        { error: `Stripe price ID not configured for plan: ${planId}` },
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
    const message = error instanceof Error ? error.message : 'Failed to create checkout session'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
