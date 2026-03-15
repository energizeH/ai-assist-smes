import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { sendContactFormNotification, sendContactFormConfirmation } from '../../lib/email'
import { checkRateLimit, getClientIP, RATE_LIMITS } from '../../lib/rate-limit'

export async function POST(request: Request) {
  try {
    // Rate limit check
    const ip = getClientIP(request)
    const limit = checkRateLimit(`contact:${ip}`, RATE_LIMITS.contact)
    if (!limit.success) {
      return NextResponse.json(
        { error: `Too many submissions. Please try again in ${Math.ceil(limit.resetIn / 60)} minutes.` },
        { status: 429 }
      )
    }

    const { name, email, phone, company, service, subject, message } = await request.json()

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Please fill in your name, email, and message.' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address.' },
        { status: 400 }
      )
    }

    // Sanitise inputs (basic XSS prevention)
    const sanitise = (str: string) => str.replace(/[<>]/g, '').trim()
    const safeName = sanitise(name)
    const safeSubject = sanitise(subject || 'General Enquiry')
    const safeMessage = sanitise(message)

    // Save to database
    try {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )
      await supabase.from('contact_submissions').insert([{
        name: safeName,
        email,
        phone: phone || null,
        company: company || null,
        service: service || null,
        subject: safeSubject,
        message: safeMessage,
        status: 'new',
      }])

      // Auto-create lead for CEO user
      const CEO_USER_ID = '495e99f7-3aad-498b-a611-86978134d3d4'
      await supabase.from('leads').insert([{
        user_id: CEO_USER_ID,
        name: safeName,
        email: email,
        phone: phone || null,
        company: company || null,
        status: 'new',
        source: 'website',
        value: 0,
        notes: `Website enquiry: ${safeSubject} — ${safeMessage}`,
      }])

      // Log activity for CEO dashboard (platform-level event)
      await supabase.from('activities').insert([{
        user_id: CEO_USER_ID,
        type: 'contact',
        title: 'New website enquiry',
        description: `Enquiry received from ${safeName} (${email})`,
      }])
    } catch (dbErr) {
      console.error('DB save error (non-blocking):', dbErr)
    }

    // Send email notification to team + confirmation to user
    if (process.env.RESEND_API_KEY) {
      try {
        await Promise.all([
          sendContactFormNotification({
            name: safeName,
            email,
            subject: safeSubject,
            message: safeMessage,
            phone: phone || undefined,
            company: company || undefined,
          }),
          sendContactFormConfirmation(email, safeName),
        ])
      } catch (emailErr) {
        console.error('Email send error (non-blocking):', emailErr)
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Thank you for your message. We will get back to you within 24 hours.',
    })
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again or email us directly.' },
      { status: 500 }
    )
  }
}
