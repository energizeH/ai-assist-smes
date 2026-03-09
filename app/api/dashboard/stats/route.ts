import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const [clientsRes, leadsRes, appointmentsRes, automationsRes] = await Promise.all([
      supabase.from('clients').select('id', { count: 'exact' }).eq('user_id', userId),
      supabase.from('leads').select('id', { count: 'exact' }).eq('user_id', userId).neq('stage', 'converted'),
      supabase.from('appointments').select('id', { count: 'exact' }).eq('user_id', userId).gte('start_time', today.toISOString()).lt('start_time', tomorrow.toISOString()),
      supabase.from('automations').select('id', { count: 'exact' }).eq('user_id', userId).eq('is_active', true),
    ])

    return NextResponse.json({
      totalClients: clientsRes.count || 0,
      activeLeads: leadsRes.count || 0,
      appointmentsToday: appointmentsRes.count || 0,
      automationsActive: automationsRes.count || 0,
    })
  } catch (error) {
    console.error('Stats error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
