import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function GET() {
  try {
    // Authenticate user
    const cookieStore = cookies()
    const supabase = createServerComponentClient({ cookies: () => cookieStore })
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorised. Please log in.' }, { status: 401 })
    }

    // Collect all user data from various tables
    const supabaseAdmin = getAdminClient()
    const [profileResult, settingsResult, appointmentsResult, leadsResult] = await Promise.allSettled([
      supabaseAdmin.from('profiles').select('*').eq('id', user.id).single(),
      supabaseAdmin.from('user_settings').select('*').eq('user_id', user.id).single(),
      supabaseAdmin.from('appointments').select('*').eq('user_id', user.id),
      supabaseAdmin.from('leads').select('*').eq('user_id', user.id),
    ])

    const exportData = {
      export_info: {
        generated_at: new Date().toISOString(),
        user_id: user.id,
        format: 'JSON (UK GDPR Article 20 - Right to Data Portability)',
        platform: 'AI-Assist for SMEs',
      },
      account: {
        id: user.id,
        email: user.email,
        created_at: user.created_at,
        last_sign_in: user.last_sign_in_at,
        email_verified: !!user.email_confirmed_at,
        metadata: {
          full_name: user.user_metadata?.full_name || null,
          company: user.user_metadata?.company || null,
          phone: user.user_metadata?.phone || null,
        },
      },
      profile: profileResult.status === 'fulfilled' ? profileResult.value.data : null,
      settings: settingsResult.status === 'fulfilled'
        ? (() => {
            const settings = settingsResult.value.data
            if (settings) {
              // Redact API keys for security
              const { api_keys, ...safeSettings } = settings
              return {
                ...safeSettings,
                api_keys: api_keys
                  ? Object.fromEntries(
                      Object.entries(api_keys as Record<string, string>).map(([key, val]) => [
                        key,
                        val ? `***${(val as string).slice(-4)}` : null
                      ])
                    )
                  : null,
              }
            }
            return null
          })()
        : null,
      appointments: appointmentsResult.status === 'fulfilled' ? appointmentsResult.value.data : [],
      leads: leadsResult.status === 'fulfilled' ? leadsResult.value.data : [],
    }

    // Return as downloadable JSON
    return new NextResponse(JSON.stringify(exportData, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="ai-assist-data-export-${new Date().toISOString().split('T')[0]}.json"`,
      },
    })
  } catch (error) {
    console.error('Data export error:', error)
    return NextResponse.json({ error: 'Failed to export data. Please try again.' }, { status: 500 })
  }
}
