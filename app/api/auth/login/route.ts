import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { checkRateLimit, getClientIP, RATE_LIMITS } from '../../../lib/rate-limit'

export async function POST(request: NextRequest) {
  try {
    // Rate limit check (brute force protection)
    const ip = getClientIP(request)
    const limit = checkRateLimit(`login:${ip}`, RATE_LIMITS.auth)
    if (!limit.success) {
      return NextResponse.json(
        { error: `Too many login attempts. Please try again in ${Math.ceil(limit.resetIn / 60)} minutes.` },
        { status: 429 }
      )
    }

    const body = await request.json()
    const { email, password } = body

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Create Supabase route handler client (handles cookie session automatically)
    const supabase = createRouteHandlerClient({ cookies })

    // Sign in with Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error('Supabase login error:', error)
      return NextResponse.json(
        { error: error.message || 'Invalid credentials' },
        { status: 401 }
      )
    }

    if (!data.session) {
      return NextResponse.json(
        { error: 'Login failed - no session created' },
        { status: 401 }
      )
    }

    // Session is automatically set in cookies by createRouteHandlerClient
    return NextResponse.json(
      {
        success: true,
        message: 'Login successful',
        user: {
          id: data.user.id,
          email: data.user.email,
          name: data.user.user_metadata?.full_name || '',
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'An error occurred during login' },
      { status: 500 }
    )
  }
}
