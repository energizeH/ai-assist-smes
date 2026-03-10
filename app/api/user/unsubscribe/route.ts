import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

/**
 * POST /api/user/unsubscribe
 * Handles one-click marketing email unsubscribe (UK PECR compliant).
 * Accepts either a user_id or email to identify the user.
 */
export async function POST(request: NextRequest) {
  try {
    const { email, user_id, token } = await request.json()

    if (!email && !user_id) {
      return NextResponse.json({ error: 'Missing identifier.' }, { status: 400 })
    }

    const supabaseAdmin = getAdminClient()

    // Find the user
    let userId = user_id
    if (!userId && email) {
      // Look up user by email in profiles
      const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('id')
        .eq('email', email)
        .single()

      if (profile) {
        userId = profile.id
      }
    }

    if (!userId) {
      // Silently succeed even if user not found (don't leak info)
      return NextResponse.json({ success: true, message: 'You have been unsubscribed from marketing emails.' })
    }

    // Update user_settings to disable marketing emails
    await supabaseAdmin.from('user_settings').upsert({
      user_id: userId,
      notifications_marketing: false,
    }, { onConflict: 'user_id' })

    return NextResponse.json({
      success: true,
      message: 'You have been unsubscribed from marketing emails.',
    })
  } catch (error) {
    console.error('Unsubscribe error:', error)
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}

/**
 * GET /api/user/unsubscribe?email=xxx
 * Handles one-click unsubscribe via link in emails (List-Unsubscribe header).
 */
export async function GET(request: NextRequest) {
  const email = request.nextUrl.searchParams.get('email')

  if (!email) {
    return NextResponse.redirect(new URL('/unsubscribe', request.url))
  }

  const supabaseAdmin = getAdminClient()

  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('id')
    .eq('email', email)
    .single()

  if (profile) {
    await supabaseAdmin.from('user_settings').upsert({
      user_id: profile.id,
      notifications_marketing: false,
    }, { onConflict: 'user_id' })
  }

  // Redirect to unsubscribe confirmation page
  return NextResponse.redirect(new URL('/unsubscribe?success=true', request.url))
}
