import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, company, password } = body

    // Validate input
    if (!name || !email || !company || !password) {
      return NextResponse.json(
        { error: 'All fields are required' },
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

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      )
    }

    // TODO: Implement actual registration logic
    // This is a placeholder - you would typically:
    // 1. Check if user already exists
    // 2. Hash the password using bcrypt
    // 3. Save user to database
    // 4. Send verification email
    // 5. Create a session/JWT token

    // For now, accept registration for demonstration
    // In production, replace this with real database operations
    const response = NextResponse.json(
      {
        success: true,
        message: 'Registration successful',
        user: {
          name,
          email,
          company,
        },
      },
      { status: 201 }
    )

    // Set auth cookie (in production, use httpOnly, secure cookies with JWT)
    response.cookies.set('auth-token', 'demo-token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })

    return response
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'An error occurred during registration' },
      { status: 500 }
    )
  }
}
