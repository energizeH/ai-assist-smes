import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { email } = await req.json()

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Please provide a valid email address.' }, { status: 400 })
    }

    // Check if already subscribed
    const { data: existing } = await supabase
      .from('contact_submissions')
      .select('id')
      .eq('email', email.toLowerCase().trim())
      .eq('service', 'Newsletter')
      .limit(1)

    if (existing && existing.length > 0) {
      return NextResponse.json({ message: 'You are already subscribed.' }, { status: 200 })
    }

    // Store subscription
    const { error } = await supabase
      .from('contact_submissions')
      .insert({
        name: 'Newsletter Subscriber',
        email: email.toLowerCase().trim(),
        message: 'Subscribed to the AI-Assist blog newsletter.',
        service: 'Newsletter',
        status: 'new',
      })

    if (error) {
      console.error('Newsletter subscription error:', error)
      return NextResponse.json({ error: 'Failed to subscribe. Please try again.' }, { status: 500 })
    }

    return NextResponse.json({ message: 'Successfully subscribed to the newsletter.' }, { status: 200 })
  } catch {
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}
