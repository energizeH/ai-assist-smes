import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { sendSubscriptionConfirmation, sendPaymentFailedEmail, sendSubscriptionCancelledEmail } from '../../../lib/email';

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2023-10-16',
  });
}

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature');
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    return NextResponse.json({ error: 'Missing stripe signature or webhook secret' }, { status: 400 });
  }

  const stripe = getStripe();
  const supabase = getSupabaseAdmin();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Webhook signature verification failed';
    console.error('Webhook signature error:', message);
    return NextResponse.json({ error: `Webhook Error: ${message}` }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.user_id;
        const planId = session.metadata?.plan_id;
        const customerId = session.customer as string;
        const subscriptionId = session.subscription as string;

        if (userId && planId) {
          // Get actual subscription dates from Stripe
          let periodStart = new Date().toISOString();
          let periodEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

          if (subscriptionId) {
            try {
              const sub = await stripe.subscriptions.retrieve(subscriptionId);
              periodStart = new Date(sub.current_period_start * 1000).toISOString();
              periodEnd = new Date(sub.current_period_end * 1000).toISOString();
            } catch (e) {
              console.error('Failed to retrieve subscription details:', e);
            }
          }

          const { error } = await supabase
            .from('subscriptions')
            .upsert(
              {
                user_id: userId,
                plan: planId,
                stripe_customer_id: customerId,
                stripe_subscription_id: subscriptionId,
                status: 'active',
                current_period_start: periodStart,
                current_period_end: periodEnd,
              },
              { onConflict: 'user_id' }
            );
          if (error) console.error('DB upsert error (checkout.session.completed):', error);

          // Log activity
          await supabase.from('activities').insert([{
            user_id: userId,
            type: 'billing',
            title: `Subscribed to ${planId} plan`,
            description: 'Subscription activated successfully',
          }]);

          // Send confirmation email
          if (process.env.RESEND_API_KEY && session.customer_email) {
            const planPrices: Record<string, string> = { starter: '£49', professional: '£149', enterprise: '£299' };
            const planName = planId.charAt(0).toUpperCase() + planId.slice(1);
            sendSubscriptionConfirmation(
              session.customer_email,
              session.metadata?.user_name || 'there',
              planName,
              planPrices[planId] || planId
            ).catch(err => console.error('Subscription email error:', err));
          }
        }
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        const subId = invoice.subscription as string | null;
        if (subId) {
          const sub = await stripe.subscriptions.retrieve(subId);
          const userId = sub.metadata?.user_id;
          if (userId) {
            await supabase
              .from('subscriptions')
              .update({
                status: 'active',
                current_period_start: new Date(sub.current_period_start * 1000).toISOString(),
                current_period_end: new Date(sub.current_period_end * 1000).toISOString(),
              })
              .eq('user_id', userId);
          }
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        const subId = invoice.subscription as string | null;
        if (subId) {
          const sub = await stripe.subscriptions.retrieve(subId);
          const userId = sub.metadata?.user_id;
          if (userId) {
            await supabase
              .from('subscriptions')
              .update({ status: 'past_due' })
              .eq('user_id', userId);

            // Log activity for visibility
            await supabase.from('activities').insert([{
              user_id: userId,
              type: 'billing',
              title: 'Payment failed',
              description: 'Your subscription payment could not be processed. Please update your payment method.',
            }]);

            // Send payment failed email
            if (process.env.RESEND_API_KEY) {
              const { data: profile } = await supabase.from('profiles').select('email, full_name').eq('id', userId).single();
              if (profile?.email) {
                sendPaymentFailedEmail(profile.email, profile.full_name || 'there').catch(err => console.error('Payment failed email error:', err));
              }
            }
          }
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription;
        const userId = sub.metadata?.user_id;
        if (userId) {
          await supabase
            .from('subscriptions')
            .update({ status: 'cancelled' })
            .eq('user_id', userId);

          // Log activity
          await supabase.from('activities').insert([{
            user_id: userId,
            type: 'billing',
            title: 'Subscription cancelled',
            description: 'Your subscription has been cancelled. You can resubscribe anytime.',
          }]);

          // Send cancellation email
          if (process.env.RESEND_API_KEY) {
            const { data: profile } = await supabase.from('profiles').select('email, full_name').eq('id', userId).single();
            if (profile?.email) {
              const endDate = new Date(sub.current_period_end * 1000).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
              sendSubscriptionCancelledEmail(profile.email, profile.full_name || 'there', endDate).catch(err => console.error('Cancel email error:', err));
            }
          }
        }
        break;
      }

      case 'customer.subscription.updated': {
        const sub = event.data.object as Stripe.Subscription;
        const userId = sub.metadata?.user_id;
        if (userId) {
          await supabase
            .from('subscriptions')
            .update({
              status: sub.status,
              plan: sub.metadata?.plan_id || undefined,
              current_period_start: new Date(sub.current_period_start * 1000).toISOString(),
              current_period_end: new Date(sub.current_period_end * 1000).toISOString(),
            })
            .eq('user_id', userId);
        }
        break;
      }

      default:
        console.log(`Unhandled Stripe event: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: unknown) {
    console.error('Webhook handler error:', error);
    const message = error instanceof Error ? error.message : 'Webhook processing failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
