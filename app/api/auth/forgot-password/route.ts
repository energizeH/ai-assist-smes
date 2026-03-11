import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { checkRateLimit, getClientIP, RATE_LIMITS } from '../../../lib/rate-limit'

export async function POST(request: NextRequest) {
  try {
    // Rate limit check
    const ip = getClientIP(request)
    const limit = checkRateLimit(`reset:${ip}`, RATE_LIMITS.passwordReset)
    if (!limit.success) {
      return NextResponse.json(
        { error: `Too many reset attempts. Please try again in ${Math.ceil(limit.resetIn / 60)} minutes.` },
        { status: 429 }
      )
    }

    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password`,
    })

    if (error) {
      console.error('Password reset error:', error)
      return NextResponse.json(
        { error: error.message || 'Failed to send reset email' },
        { status: 400 }
      )
    }

    // Always return success to prevent email enumeration
    return NextResponse.json({
      success: true,
      message: 'If an account exists with that email, you will receive a password reset link shortly.',
    })
  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
