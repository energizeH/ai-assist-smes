import { NextResponse } from 'next/server';

function getRuleBasedResponse(userMessage: string): string | null {
  const msg = userMessage.toLowerCase();

  if (msg.includes('price') || msg.includes('pricing') || msg.includes('cost') || msg.includes('how much')) {
    return 'Our plans start from £149/month for the Starter plan, £299/month for Pro, and custom pricing for Enterprise. All plans include a free consultation. Would you like to book a call to discuss which plan suits your business best?';
  }
  if (msg.includes('service') || msg.includes('what do you') || msg.includes('offer') || msg.includes('provide')) {
    return 'We offer: AI Receptionist Systems, WhatsApp Automation, Lead Management, Email Automation, Appointment Scheduling, and Custom API Integrations. Each solution is tailored to your SME. Which service are you most interested in?';
  }
  if (msg.includes('hour') || msg.includes('open') || msg.includes('available') || msg.includes('when')) {
    return 'We are available Mon-Fri, 9am to 6pm GMT. Outside of those hours, our AI handles enquiries automatically. Would you like to book a consultation during business hours?';
  }
  if (msg.includes('appointment') || msg.includes('book') || msg.includes('schedule') || msg.includes('consult') || msg.includes('meeting')) {
    return 'I\'d love to help you book a consultation! Please visit our Plans page or contact us at hello@ai-assist-smes.com. Alternatively, share your preferred date/time and your name and email, and our team will confirm within 24 hours.';
  }
  if (msg.includes('whatsapp') || msg.includes('automation')) {
    return 'Our WhatsApp Automation solution lets your business respond to customer enquiries 24/7 automatically. It can handle bookings, FAQs, and lead capture. Would you like a demo or consultation?';
  }
  if (msg.includes('lead') || msg.includes('crm') || msg.includes('customer')) {
    return 'Our Lead Management system captures, qualifies, and nurtures leads automatically. It integrates with your existing tools and notifies you instantly when a hot lead comes in. Shall I arrange a consultation?';
  }
  if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey') || msg.includes('good morning') || msg.includes('good afternoon')) {
    return 'Hello! Welcome to AI-Assist for SMEs. I\'m your AI Receptionist. I can help you with information about our services, pricing, or to book a consultation. How can I help you today?';
  }
  if (msg.includes('contact') || msg.includes('email') || msg.includes('phone') || msg.includes('reach')) {
    return 'You can reach us at hello@ai-assist-smes.com or through our Contact page. We typically respond within 2 hours during business hours (Mon-Fri, 9am-6pm GMT).';
  }
  if (msg.includes('thank') || msg.includes('thanks') || msg.includes('great') || msg.includes('perfect')) {
    return 'You\'re welcome! Is there anything else I can help you with? Feel free to ask about our services or book a consultation anytime.';
  }
  return null;
}

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const lastMessage = messages[messages.length - 1]?.text || '';

    // Try rule-based first if no OpenAI key
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      const ruleResponse = getRuleBasedResponse(lastMessage);
      const botText = ruleResponse || 'Thank you for your message! Our team at AI-Assist for SMEs would love to help. Please email us at hello@ai-assist-smes.com or book a free consultation through our Plans page. We respond within 2 hours during business hours (Mon-Fri, 9am-6pm GMT).';
      return NextResponse.json({ text: botText });
    }

    const systemPrompt = `You are a professional AI Receptionist for 'AI-Assist for SMEs', a leading AI automation consultancy. Your goal is to be helpful, intelligent, and proactive.
Business Info:
- Services: AI Receptionist Systems, WhatsApp Automation, Lead Management, Email Automation, Appointment Scheduling, Custom API Integrations.
- Pricing: Starts from £149/month. Custom quotes available.
- Opening Hours: Mon-Fri, 9am - 6pm GMT.
- Goal: Capture leads and guide users to book a consultation.

Capabilities:
1. Schedule appointments: Ask for preferred date/time and contact details.
2. Capture leads: If someone shows interest, ask for their name, email, and business needs.
3. Answer FAQs: Use the business info above.

Style:
- Professional yet friendly.
- Concise and direct.
- Always end with a helpful question or call to action.`;

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
          ...messages.map((m: any) => ({
            role: m.sender === 'user' ? 'user' : 'assistant',
            content: m.text,
          })),
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const ruleResponse = getRuleBasedResponse(lastMessage);
      const botText = ruleResponse || 'I\'m sorry, I\'m having trouble connecting right now. Please book a call with our team or email hello@ai-assist-smes.com for immediate assistance!';
      return NextResponse.json({ text: botText });
    }

    const data = await response.json();
    const botText = data.choices[0].message.content;
    return NextResponse.json({ text: botText });
  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      { text: 'I\'m sorry, I\'m having trouble connecting right now. Please book a call with our team or email hello@ai-assist-smes.com for immediate assistance!' },
      { status: 500 }
    );
  }
}
