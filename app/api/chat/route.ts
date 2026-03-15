import { NextResponse } from 'next/server'
import { checkRateLimit, getClientIP, RATE_LIMITS } from '../../lib/rate-limit'

const SYSTEM_PROMPT = `You are a helpful AI assistant for AI-Assist for SMEs, a Birmingham-based AI automation company. Help visitors understand our services, pricing, and how we can help their SME. Be friendly, professional, and concise. Always encourage visitors to book a free consultation at /contact.

Key business info:
- Services: AI Receptionist Systems, WhatsApp Automation, Lead Management, Email Automation, Appointment Scheduling, Custom API Integrations
- Plans: Starter £49/month, Professional £149/month, Enterprise £299/month
- Opening Hours: Mon-Fri, 9am - 6pm GMT
- Contact email: info@aiassistsmes.co.uk
- Phone: +44 121 000 0000
- Location: Birmingham, United Kingdom
- Website: https://aiassistsmes.co.uk`

function getRuleBasedResponse(msg: string): string | null {
  const lower = msg.toLowerCase()

  if (lower.includes('price') || lower.includes('pricing') || lower.includes('cost') || lower.includes('how much') || lower.includes('plan')) {
    return 'Our plans start from £49/month for Starter, £149/month for Professional, and £299/month for Enterprise. All plans include a free consultation. Would you like to discuss which plan suits your business best?'
  }
  if (lower.includes('service') || lower.includes('what do you') || lower.includes('offer') || lower.includes('provide')) {
    return 'We offer: AI Receptionist Systems, WhatsApp Automation, Lead Management, Email Automation, Appointment Scheduling, and Custom API Integrations. Each solution is tailored to your SME. Which service interests you most?'
  }
  if (lower.includes('hour') || lower.includes('open') || lower.includes('available') || lower.includes('when')) {
    return 'We are available Mon-Fri, 9am to 6pm GMT. Outside those hours, our AI handles enquiries automatically. Would you like to book a consultation during business hours?'
  }
  if (lower.includes('appointment') || lower.includes('book') || lower.includes('schedule') || lower.includes('consult') || lower.includes('meeting')) {
    return "I'd love to help you book a consultation. Please visit our Contact page at /contact or share your preferred date/time and we'll confirm within 24 hours."
  }
  if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey') || lower.includes('good morning') || lower.includes('good afternoon')) {
    return "Hello! Welcome to AI-Assist for SMEs. I'm here to help with information about our services, pricing, or booking a consultation. How can I help you today?"
  }
  if (lower.includes('contact') || lower.includes('email') || lower.includes('phone') || lower.includes('reach')) {
    return 'You can reach us at info@aiassistsmes.co.uk, call +44 121 000 0000, or visit our Contact page. We typically respond within 2 hours during business hours (Mon-Fri, 9am-6pm GMT).'
  }
  if (lower.includes('thank') || lower.includes('thanks') || lower.includes('great') || lower.includes('perfect')) {
    return "You're welcome! Is there anything else I can help you with?"
  }
  return null
}

export async function POST(req: Request) {
  try {
    const ip = getClientIP(req)
    const limit = checkRateLimit(`chat:${ip}`, RATE_LIMITS.chat)
    if (!limit.success) {
      return NextResponse.json({ text: 'You\'re sending messages too quickly. Please wait a moment.' })
    }

    const { messages } = await req.json()
    const lastMessage = messages[messages.length - 1]?.text || ''

    const apiKey = process.env.ANTHROPIC_API_KEY

    // Use rule-based responses if no API key
    if (!apiKey) {
      const ruleResponse = getRuleBasedResponse(lastMessage)
      const botText = ruleResponse || "Thank you for your message. Please email us at info@aiassistsmes.co.uk or book a free consultation through our Contact page. We respond within 2 hours during business hours."
      return NextResponse.json({ text: botText })
    }

    // Try rule-based first for common queries (saves API calls)
    const ruleResponse = getRuleBasedResponse(lastMessage)
    if (ruleResponse) {
      return NextResponse.json({ text: ruleResponse })
    }

    // Call Anthropic Claude API
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 500,
        system: SYSTEM_PROMPT,
        messages: messages.map((m: { sender: string; text: string }) => ({
          role: m.sender === 'user' ? 'user' : 'assistant',
          content: m.text,
        })),
      }),
    })

    if (!response.ok) {
      const fallback = "Thank you for your message. Please email us at info@aiassistsmes.co.uk or book a free consultation through our Contact page."
      return NextResponse.json({ text: fallback })
    }

    const data = await response.json()
    const botText = data.content?.[0]?.text || "Thank you for your message. How can I help you today?"
    return NextResponse.json({ text: botText })
  } catch (error) {
    console.error('Chat API Error:', error)
    return NextResponse.json(
      { text: "I'm having trouble connecting right now. Please email info@aiassistsmes.co.uk for immediate assistance." },
      { status: 200 }
    )
  }
}
