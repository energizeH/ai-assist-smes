import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'

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

    // Check if user has an active Stripe subscription and cancel it
    const supabaseAdmin = getAdminClient()
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('stripe_customer_id, subscription_id')
      .eq('id', user.id)
      .single()

    if (profile?.subscription_id) {
      try {
        const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
        await stripe.subscriptions.cancel(profile.subscription_id, {
          prorate: true,
        })
      } catch (stripeErr) {
        console.error('Stripe subscription cancel error:', stripeErr)
        // Continue with deletion even if Stripe fails — log for manual follow-up
      }
    }

    // Delete user data from all tables (order matters for foreign keys)
    const tablesToClean = ['leads', 'appointments', 'user_settings', 'profiles']

    for (const table of tablesToClean) {
      try {
        const column = table === 'profiles' ? 'id' : 'user_id'
        await supabaseAdmin.from(table).delete().eq(column, user.id)
      } catch (err) {
        console.error(`Error deleting from ${table}:`, err)
        // Continue cleanup even if individual tables fail
      }
    }

    // Delete the auth user (this is the final step)
    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(user.id)

    if (deleteError) {
      console.error('Auth user deletion error:', deleteError)
      return NextResponse.json(
        { error: 'Failed to delete account. Please contact support at support@ai-assist-smes.co.uk.' },
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
      { error: 'Something went wrong. Please contact support at support@ai-assist-smes.co.uk.' },
      { status: 500 }
    )
  }
}
