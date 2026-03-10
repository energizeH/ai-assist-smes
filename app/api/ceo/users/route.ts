import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

const CEO_EMAIL = 'hxssxn772@gmail.com'

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

// POST: CEO user management actions
export async function POST(req: NextRequest) {
  try {
    // Auth check - only CEO
    const supabaseAuth = createRouteHandlerClient({ cookies })
    const { data: { session } } = await supabaseAuth.auth.getSession()

    if (!session || session.user.email !== CEO_EMAIL) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const body = await req.json()
    const { action, userId, plan, status } = body

    if (!userId || !action) {
      return NextResponse.json({ error: 'Missing userId or action' }, { status: 400 })
    }

    const admin = getAdminClient()

    switch (action) {
      case 'grant_free_access': {
        // Create or update subscription to active with chosen plan, no Stripe
        const planName = plan || 'professional'
        const periodEnd = new Date()
        periodEnd.setFullYear(periodEnd.getFullYear() + 10) // 10 years = effectively permanent

        // Check if subscription exists
        const { data: existing } = await admin
          .from('subscriptions')
          .select('id')
          .eq('user_id', userId)
          .single()

        if (existing) {
          await admin
            .from('subscriptions')
            .update({
              plan: planName,
              status: 'active',
              current_period_end: periodEnd.toISOString(),
              updated_at: new Date().toISOString(),
            })
            .eq('user_id', userId)
        } else {
          await admin
            .from('subscriptions')
            .insert({
              user_id: userId,
              plan: planName,
              status: 'active',
              current_period_start: new Date().toISOString(),
              current_period_end: periodEnd.toISOString(),
              stripe_customer_id: null,
              stripe_subscription_id: null,
            })
        }

        return NextResponse.json({ success: true, message: `Granted free ${planName} access` })
      }

      case 'change_plan': {
        if (!plan) {
          return NextResponse.json({ error: 'Missing plan name' }, { status: 400 })
        }

        const { error: updateError } = await admin
          .from('subscriptions')
          .update({
            plan,
            updated_at: new Date().toISOString(),
          })
          .eq('user_id', userId)

        if (updateError) {
          return NextResponse.json({ error: updateError.message }, { status: 500 })
        }

        return NextResponse.json({ success: true, message: `Plan changed to ${plan}` })
      }

      case 'revoke_access': {
        const { error: revokeError } = await admin
          .from('subscriptions')
          .update({
            status: 'cancelled',
            updated_at: new Date().toISOString(),
          })
          .eq('user_id', userId)

        if (revokeError) {
          return NextResponse.json({ error: revokeError.message }, { status: 500 })
        }

        return NextResponse.json({ success: true, message: 'Access revoked' })
      }

      case 'reactivate': {
        const periodEnd = new Date()
        periodEnd.setMonth(periodEnd.getMonth() + 1)

        const { error: reactivateError } = await admin
          .from('subscriptions')
          .update({
            status: 'active',
            current_period_end: periodEnd.toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq('user_id', userId)

        if (reactivateError) {
          return NextResponse.json({ error: reactivateError.message }, { status: 500 })
        }

        return NextResponse.json({ success: true, message: 'Subscription reactivated' })
      }

      case 'delete_user': {
        // Delete subscription first
        await admin.from('subscriptions').delete().eq('user_id', userId)
        // Delete profile
        await admin.from('profiles').delete().eq('id', userId)
        // Delete auth user
        await admin.auth.admin.deleteUser(userId)

        return NextResponse.json({ success: true, message: 'User deleted' })
      }

      default:
        return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
    }
  } catch (error) {
    console.error('CEO user management error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
