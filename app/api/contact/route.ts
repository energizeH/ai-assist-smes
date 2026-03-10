import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import nodemailer from 'nodemailer'

export async function POST(request: Request) {
  try {
    const { name, email, phone, company, service, message } = await request.json()

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

    // Save to database (always works even if email fails)
    try {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )
      await supabase.from('contact_submissions').insert([{
        name,
        email,
        phone: phone || null,
        company: company || null,
        service: service || null,
        message,
      }])
    } catch (dbErr) {
      console.error('DB save error (non-blocking):', dbErr)
    }

    // Send email notification if Gmail is configured
    if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
      try {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_APP_PASSWORD,
          },
        })

        await transporter.sendMail({
          from: process.env.GMAIL_USER,
          to: process.env.GMAIL_USER,
          replyTo: email,
          subject: `New Contact: ${name} - AI-Assist for SMEs`,
          html: `
            <h2>New Contact Form Submission</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
            <p><strong>Company:</strong> ${company || 'Not provided'}</p>
            <p><strong>Service:</strong> ${service || 'Not specified'}</p>
            <p><strong>Message:</strong></p>
            <p>${message.replace(/\n/g, '<br>')}</p>
            <hr>
            <p style="color: #666; font-size: 12px;">Sent from AI-Assist for SMEs contact form</p>
          `,
        })
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
