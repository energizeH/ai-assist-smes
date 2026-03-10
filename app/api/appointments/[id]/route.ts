import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const { client_name, client_email, client_phone, service, appointment_date, appointment_time, duration, notes, status } = body

    const { data, error } = await supabase
      .from('appointments')
      .update({
        client_name,
        client_email: client_email || null,
        client_phone: client_phone || null,
        service: service || null,
        appointment_date,
        appointment_time,
        duration: duration || 30,
        notes: notes || null,
        status: status || 'scheduled',
      })
      .eq('id', params.id)
      .eq('user_id', session.user.id)
      .select()
      .single()

    if (error) {
      console.error('Appointment update error:', error)
      return NextResponse.json({ error: error.message || 'Failed to update appointment' }, { status: 500 })
    }
    return NextResponse.json({ appointment: data })
  } catch (error: unknown) {
    console.error('Appointment PUT error:', error)
    const message = error instanceof Error ? error.message : 'Failed to update appointment'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { error } = await supabase
      .from('appointments')
      .delete()
      .eq('id', params.id)
      .eq('user_id', session.user.id)

    if (error) {
      console.error('Appointment delete error:', error)
      return NextResponse.json({ error: error.message || 'Failed to delete appointment' }, { status: 500 })
    }
    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    console.error('Appointment DELETE error:', error)
    const message = error instanceof Error ? error.message : 'Failed to delete appointment'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
