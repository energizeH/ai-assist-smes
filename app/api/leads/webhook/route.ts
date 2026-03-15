import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const key = searchParams.get('key')

    if (!key) {
      return NextResponse.json({ error: 'Missing webhook key' }, { status: 401 })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    // Validate key against user_settings
    const { data: settings, error: settingsError } = await supabase
      .from('user_settings')
      .select('user_id')
      .eq('webhook_key', key)
      .single()

    if (settingsError || !settings) {
      return NextResponse.json({ error: 'Invalid webhook key' }, { status: 401 })
    }

    const body = await request.json()
    const { name, email, phone, company, notes } = body

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }

    // Create lead for the user
    const { data: lead, error: leadError } = await supabase.from('leads').insert([{
      user_id: settings.user_id,
      name: name,
      email: email || null,
      phone: phone || null,
      company: company || null,
      status: 'new',
      source: 'webhook',
      value: 0,
      notes: notes || null,
    }]).select().single()

    if (leadError) {
      console.error('Webhook lead creation error:', leadError)
      return NextResponse.json({ error: 'Failed to create lead' }, { status: 500 })
    }

    // Log activity
    await supabase.from('activities').insert([{
      user_id: settings.user_id,
      type: 'lead',
      title: 'New webhook lead',
      description: `Lead received via webhook: ${name}`,
    }])

    return NextResponse.json({ success: true, lead_id: lead?.id }, { status: 201 })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
