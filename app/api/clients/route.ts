import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false })

    if (error) throw error
    return NextResponse.json({ clients: data || [] })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const { name, email, phone, company, status, notes } = body

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('clients')
      .insert([{
        user_id: session.user.id,
        name,
        email: email || null,
        phone: phone || null,
        company: company || null,
        status: status || 'active',
        notes: notes || null,
      }])
      .select()
      .single()

    if (error) throw error

    // Log activity
    await supabase.from('activities').insert([{
      user_id: session.user.id,
      type: 'client',
      title: `New client: ${name}`,
      description: `${name}${email ? ` (${email})` : ''} was added as a client`,
    }])

    return NextResponse.json({ client: data }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
