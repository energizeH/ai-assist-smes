import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Helper: map Supabase error messages to user-friendly ones
function getFriendlyError(message: string): string {
  const msg = message.toLowerCase();
  if (msg.includes('user already registered') || msg.includes('already been registered')) {
    return 'An account with this email already exists. Please sign in instead.';
  }
  if (msg.includes('invalid api key') || msg.includes('api key')) {
    return 'Our service is temporarily unavailable. Please try again in a moment.';
  }
  if (msg.includes('invalid email')) {
    return 'Please enter a valid email address.';
  }
  if (msg.includes('password')) {
    return 'Password must be at least 6 characters long.';
  }
  if (msg.includes('rate limit') || msg.includes('too many')) {
    return 'Too many attempts. Please wait a few minutes before trying again.';
  }
  return 'Registration failed. Please try again or contact support.';
}

export async function POST(request: Request) {
  try {
    const { name, email, company, password } = await request.json();

    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Please fill in all required fields.' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    // Validate password strength (min 6 characters)
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long.' },
        { status: 400 }
      );
    }

    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Register user with Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
          company: company || null,
        },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      },
    });

    if (error) {
      console.error('Supabase registration error:', error.message);
      return NextResponse.json(
        { error: getFriendlyError(error.message) },
        { status: 400 }
      );
    }

    // Check if user needs email confirmation
    if (data.user && !data.user.email_confirmed_at) {
      return NextResponse.json({
        success: true,
        message: 'Account created! Please check your email to verify your account before signing in.',
        requiresEmailVerification: true,
        user: {
          id: data.user.id,
          email: data.user.email,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Registration successful!',
      user: {
        id: data.user?.id,
        email: data.user?.email,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
