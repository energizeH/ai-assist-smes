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
      .from('appointments')
      .select('id, user_id, client_name, client_email, client_phone, service, appointment_date, appointment_time, duration, notes, status, created_at')
      .eq('user_id', session.user.id)
      .order('appointment_date', { ascending: true })

    if (error) {
      console.error('Appointments fetch error:', error)
      return NextResponse.json({ error: error.message || 'Failed to load appointments' }, { status: 500 })
    }
    return NextResponse.json({ appointments: data || [] })
  } catch (error: unknown) {
    console.error('Appointments GET error:', error)
    const message = error instanceof Error ? error.message : 'Failed to load appointments'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const { client_name, client_email, client_phone, service, appointment_date, appointment_time, duration, notes, status } = body

    if (!client_name || !appointment_date || !appointment_time) {
      return NextResponse.json({ error: 'Client name, date, and time are required' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('appointments')
      .insert([{
        user_id: session.user.id,
        client_name,
        client_email: client_email || null,
        client_phone: client_phone || null,
        service: service || null,
        appointment_date,
        appointment_time,
        duration: duration || 30,
        notes: notes || null,
        status: status || 'scheduled',
      }])
      .select()
      .single()

    if (error) {
      console.error('Appointment insert error:', error)
      return NextResponse.json({ error: error.message || 'Failed to create appointment' }, { status: 500 })
    }

    // Log activity (non-blocking)
    supabase.from('activities').insert([{
      user_id: session.user.id,
      type: 'appointment',
      title: `New appointment: ${client_name}`,
      description: `Scheduled for ${appointment_date} at ${appointment_time}`,
    }]).then(() => {})

    return NextResponse.json({ appointment: data }, { status: 201 })
  } catch (error: unknown) {
    console.error('Appointments POST error:', error)
    const message = error instanceof Error ? error.message : 'Failed to create appointment'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
