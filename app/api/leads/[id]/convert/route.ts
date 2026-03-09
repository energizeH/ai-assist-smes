import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Convert a lead to a client
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // Fetch the lead
    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .select('*')
      .eq('id', params.id)
      .eq('user_id', session.user.id)
      .single()

    if (leadError || !lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 })
    }

    // Create a client from the lead
    const { data: client, error: clientError } = await supabase
      .from('clients')
      .insert([{
        user_id: session.user.id,
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        company: lead.company,
        status: 'active',
        notes: `Converted from lead. Source: ${lead.source || 'N/A'}. Original value: £${lead.value || 0}.`,
      }])
      .select()
      .single()

    if (clientError) throw clientError

    // Update lead status to converted
    await supabase
      .from('leads')
      .update({ status: 'closed_won' })
      .eq('id', params.id)
      .eq('user_id', session.user.id)

    // Log activity
    await supabase.from('activities').insert([{
      user_id: session.user.id,
      type: 'lead',
      title: `Lead converted: ${lead.name}`,
      description: `${lead.name} was converted to a client`,
    }])

    return NextResponse.json({ client, message: 'Lead converted to client successfully' })
  } catch (error) {
    console.error('Lead conversion error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
