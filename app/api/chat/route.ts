import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const systemPrompt = `You are a professional AI Receptionist for 'AI-Assist for SMEs', a leading AI automation consultancy.
Your goal is to be helpful, intelligent, and proactive.
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
- Never use generic placeholder responses.
- If you can't answer something specific about a client's business, offer to connect them with a human team member by scheduling a call.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
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
      throw new Error('AI API failed');
    }

    const data = await response.json();
    const botText = data.choices[0].message.content;

    return NextResponse.json({ text: botText });
  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      { text: "I'm sorry, I'm having trouble connecting to my brain right now. Please try again in a moment or book a call with our team!" },
      { status: 500 }
    );
  }
}
