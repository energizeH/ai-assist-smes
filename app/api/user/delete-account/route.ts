import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import Stripe from 'stripe'

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function DELETE(request: Request) {
  try {
    // Authenticate user
    const cookieStore = cookies()
    const supabase = createServerComponentClient({ cookies: () => cookieStore })
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorised. Please log in.' }, { status: 401 })
    }

    // Require confirmation via request body
    let body: { confirm?: string } = {}
    try {
      body = await request.json()
    } catch {
      return NextResponse.json({ error: 'Please confirm deletion.' }, { status: 400 })
    }

    if (body.confirm !== 'DELETE MY ACCOUNT') {
      return NextResponse.json(
        { error: 'Please type "DELETE MY ACCOUNT" to confirm account deletion.' },
        { status: 400 }
      )
    }

    const supabaseAdmin = getAdminClient()

    // Cancel any active Stripe subscription
    const { data: subscription } = await supabaseAdmin
      .from('subscriptions')
      .select('stripe_subscription_id')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single()

    if (subscription?.stripe_subscription_id && process.env.STRIPE_SECRET_KEY) {
      try {
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2023-10-16' })
        await stripe.subscriptions.cancel(subscription.stripe_subscription_id, {
          prorate: true,
        })
      } catch (stripeErr) {
        console.error('Stripe subscription cancel error:', stripeErr)
        // Continue with deletion even if Stripe fails
      }
    }

    // Delete user data from ALL tables (order matters for foreign keys)
    const tablesToClean = [
      { table: 'activities', column: 'user_id' },
      { table: 'messages', column: 'user_id' },
      { table: 'automations', column: 'user_id' },
      { table: 'knowledge_base', column: 'user_id' },
      { table: 'appointments', column: 'user_id' },
      { table: 'leads', column: 'user_id' },
      { table: 'clients', column: 'user_id' },
      { table: 'subscriptions', column: 'user_id' },
      { table: 'user_settings', column: 'user_id' },
      { table: 'profiles', column: 'id' },
    ]

    const deletionErrors: string[] = []

    for (const { table, column } of tablesToClean) {
      try {
        const { error: deleteError } = await supabaseAdmin
          .from(table)
          .delete()
          .eq(column, user.id)
        if (deleteError) {
          deletionErrors.push(`${table}: ${deleteError.message}`)
        }
      } catch (err) {
        console.error(`Error deleting from ${table}:`, err)
        deletionErrors.push(`${table}: unexpected error`)
      }
    }

    if (deletionErrors.length > 0) {
      console.error('Partial deletion errors:', deletionErrors)
    }

    // Delete the auth user (final step)
    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(user.id)

    if (deleteError) {
      console.error('Auth user deletion error:', deleteError)
      return NextResponse.json(
        { error: 'Failed to delete account. Please contact support at support@aiassistsmes.co.uk.' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Your account and all associated data have been permanently deleted. We are sorry to see you go.',
    })
  } catch (error) {
    console.error('Account deletion error:', error)
    return NextResponse.json(
      { error: 'Something went wrong. Please contact support at support@aiassistsmes.co.uk.' },
      { status: 500 }
    )
  }
}
