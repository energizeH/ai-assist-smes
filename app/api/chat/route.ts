import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Fetch knowledge base entries for the chatbot
async function getKnowledgeBase(userId?: string): Promise<string> {
  try {
    if (!userId) return ''
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    const { data } = await supabase
      .from('knowledge_base')
      .select('category, title, content')
      .eq('user_id', userId)
    
    if (!data || data.length === 0) return ''
    
    return data.map(entry => `[${entry.category}] ${entry.title}: ${entry.content}`).join('\n')
  } catch {
    return ''
  }
}

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
    return "I'd love to help you book a consultation. Please share your preferred date/time and your name and email, and our team will confirm within 24 hours. Or visit our Contact page directly."
  }
  if (lower.includes('whatsapp') || lower.includes('automation')) {
    return 'Our WhatsApp Automation lets your business respond to customer enquiries 24/7 automatically. It handles bookings, FAQs, and lead capture. Would you like a demo?'
  }
  if (lower.includes('lead') || lower.includes('crm') || lower.includes('customer')) {
    return 'Our Lead Management system captures, qualifies, and nurtures leads automatically. It integrates with your existing tools and notifies you instantly when a hot lead comes in.'
  }
  if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey') || lower.includes('good morning') || lower.includes('good afternoon')) {
    return "Hello! Welcome to AI-Assist for SMEs. I'm your AI Receptionist. I can help with information about our services, pricing, or booking a consultation. How can I help you today?"
  }
  if (lower.includes('contact') || lower.includes('email') || lower.includes('phone') || lower.includes('reach')) {
    return 'You can reach us at hello@ai-assist-smes.com or through our Contact page. We typically respond within 2 hours during business hours (Mon-Fri, 9am-6pm GMT).'
  }
  if (lower.includes('thank') || lower.includes('thanks') || lower.includes('great') || lower.includes('perfect')) {
    return "You're welcome! Is there anything else I can help you with?"
  }
  return null
}

export async function POST(req: Request) {
  try {
    const { messages, userId } = await req.json()
    const lastMessage = messages[messages.length - 1]?.text || ''

    const apiKey = process.env.OPENAI_API_KEY

    // Try rule-based first if no OpenAI key
    if (!apiKey) {
      const ruleResponse = getRuleBasedResponse(lastMessage)
      const botText = ruleResponse || "Thank you for your message. Please email us at hello@ai-assist-smes.com or book a free consultation through our Plans page. We respond within 2 hours during business hours."
      return NextResponse.json({ text: botText })
    }

    // Get knowledge base for context
    const knowledgeBase = await getKnowledgeBase(userId)

    const systemPrompt = `You are a professional AI Receptionist for 'AI-Assist for SMEs', a leading AI automation consultancy for small and medium businesses in the UK.

Business Info:
- Services: AI Receptionist Systems, WhatsApp Automation, Lead Management, Email Automation, Appointment Scheduling, Custom API Integrations
- Plans: Starter £49/month, Professional £149/month, Enterprise £299/month
- Opening Hours: Mon-Fri, 9am - 6pm GMT
- Contact: hello@ai-assist-smes.com

${knowledgeBase ? `\nCustom Knowledge Base:\n${knowledgeBase}\n` : ''}

Your role:
1. Answer questions about the business, services, and pricing
2. Capture leads by asking for name, email, and business needs
3. Help schedule appointments by asking for preferred date/time
4. Be professional, friendly, and concise
5. Always end with a helpful call-to-action`

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages.map((m: { sender: string; text: string }) => ({
            role: m.sender === 'user' ? 'user' : 'assistant',
            content: m.text,
          })),
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    })

    if (!response.ok) {
      const ruleResponse = getRuleBasedResponse(lastMessage)
      const botText = ruleResponse || "I'm having trouble connecting right now. Please email hello@ai-assist-smes.com for immediate assistance."
      return NextResponse.json({ text: botText })
    }

    const data = await response.json()
    const botText = data.choices[0].message.content
    return NextResponse.json({ text: botText })
  } catch (error) {
    console.error('Chat API Error:', error)
    return NextResponse.json(
      { text: "I'm having trouble connecting right now. Please email hello@ai-assist-smes.com for immediate assistance." },
      { status: 200 } // Return 200 so the chatbot UI doesn't break
    )
  }
}
