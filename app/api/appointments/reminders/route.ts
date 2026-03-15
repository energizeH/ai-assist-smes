import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { sendAppointmentReminderEmail } from '@/app/lib/email'

// Service role client to bypass RLS — this endpoint is called by a cron/scheduler
function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error('Missing Supabase credentials')
  return createClient(url, key)
}

export async function POST() {
  try {
    const admin = getAdminClient()
    const now = new Date()

    // Look for appointments in the next 65 minutes (covers both 1hr and 30min windows)
    const windowEnd = new Date(now.getTime() + 65 * 60 * 1000)

    const todayStr = now.toISOString().split('T')[0]
    const windowEndStr = windowEnd.toISOString().split('T')[0]

    // Fetch scheduled appointments for today (and possibly tomorrow if near midnight)
    const dates = [todayStr]
    if (windowEndStr !== todayStr) dates.push(windowEndStr)

    const { data: appointments, error } = await admin
      .from('appointments')
      .select('*, clients(name, email)')
      .in('appointment_date', dates)
      .eq('status', 'scheduled')

    if (error) throw error
    if (!appointments || appointments.length === 0) {
      return NextResponse.json({ sent: 0, message: 'No upcoming appointments' })
    }

    let sent = 0
    const errors: string[] = []

    for (const appt of appointments) {
      // Parse appointment datetime
      const apptDate = new Date(`${appt.appointment_date}T${appt.appointment_time}`)
      const diffMinutes = (apptDate.getTime() - now.getTime()) / (1000 * 60)

      // Send reminders at ~60 min and ~30 min before
      const shouldRemind60 = diffMinutes > 50 && diffMinutes <= 65
      const shouldRemind30 = diffMinutes > 20 && diffMinutes <= 35

      if (!shouldRemind60 && !shouldRemind30) continue

      // Need a client email to send the reminder
      const clientEmail = appt.clients?.email || appt.client_email
      const clientName = appt.clients?.name || appt.client_name || 'there'

      if (!clientEmail) continue

      // Check if reminder was already sent (avoid duplicates)
      const reminderType = shouldRemind60 ? '60min' : '30min'
      const reminderKey = `reminder_${reminderType}_sent`

      // Use metadata field if it exists, otherwise skip duplicate check
      if (appt.metadata && appt.metadata[reminderKey]) continue

      try {
        // Fetch the business name from the user's profile
        const { data: owner } = await admin
          .from('profiles')
          .select('business_name, full_name')
          .eq('id', appt.user_id)
          .single()

        await sendAppointmentReminderEmail(clientEmail, clientName, {
          appointment_date: appt.appointment_date,
          appointment_time: appt.appointment_time,
          service: appt.service || appt.title,
          duration: appt.duration,
          businessName: owner?.business_name || owner?.full_name || undefined,
        })

        // Mark reminder as sent in metadata
        const existingMetadata = appt.metadata || {}
        await admin
          .from('appointments')
          .update({ metadata: { ...existingMetadata, [reminderKey]: new Date().toISOString() } })
          .eq('id', appt.id)

        sent++
      } catch (emailErr: any) {
        errors.push(`Failed to send to ${clientEmail}: ${emailErr.message}`)
      }
    }

    return NextResponse.json({
      sent,
      checked: appointments.length,
      errors: errors.length > 0 ? errors : undefined,
    })
  } catch (error: any) {
    console.error('Appointment reminder error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
