import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const PLANS: Record<string, { priceId: string; name: string }> = {
  starter: {
    priceId: process.env.STRIPE_PRICE_STARTER!,
    name: 'Starter',
  },
  pro: {
    priceId: process.env.STRIPE_PRICE_PRO!,
    name: 'Pro',
  },
  enterprise: {
    priceId: process.env.STRIPE_PRICE_ENTERPRISE!,
    name: 'Enterprise',
  },
};

export async function POST(req: NextRequest) {
  try {
    const { planId, userId, userEmail } = await req.json();

    if (!planId || !userId || !userEmail) {
      return NextResponse.json(
        { error: 'Missing required fields: planId, userId, userEmail' },
        { status: 400 }
      );
    }

    const plan = PLANS[planId];
    if (!plan) {
      return NextResponse.json(
        { error: `Invalid plan: ${planId}. Valid plans: starter, pro, enterprise` },
        { status: 400 }
      );
    }

    if (!plan.priceId) {
      return NextResponse.json(
        { error: `Stripe price ID not configured for plan: ${planId}` },
        { status: 500 }
      );
    }

    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', userId)
      .single();

    let customerId = subscription?.stripe_customer_id;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: userEmail,
        metadata: { supabase_user_id: userId },
      });
      customerId = customer.id;
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: plan.priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?subscription=success&plan=${planId}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/plans?cancelled=true`,
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
    });

    return NextResponse.json({ url: session.url, sessionId: session.id });
  } catch (error: unknown) {
    console.error('Stripe checkout error:', error);
    const message = error instanceof Error ? error.message : 'Failed to create checkout session';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
