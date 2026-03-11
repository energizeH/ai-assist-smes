import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Client } from 'pg'

const CEO_EMAIL = 'hxssxn772@gmail.com'

// This endpoint applies critical RLS policies to secure the database.
// It requires: (1) CEO authentication, (2) DATABASE_URL env var set on Vercel.
// After running successfully once, this endpoint can be removed.

const RLS_MIGRATION = `
-- ============================================
-- FIX: subscriptions table RLS
-- ============================================
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Drop any overly-permissive policies
DROP POLICY IF EXISTS "Enable read access for all users" ON public.subscriptions;
DROP POLICY IF EXISTS "Allow all" ON public.subscriptions;
DROP POLICY IF EXISTS "subscriptions_select" ON public.subscriptions;

-- Create proper user-scoped policies
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'subscriptions' AND policyname = 'Users can view own subscription') THEN
    CREATE POLICY "Users can view own subscription" ON public.subscriptions FOR SELECT USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'subscriptions' AND policyname = 'Users can insert own subscription') THEN
    CREATE POLICY "Users can insert own subscription" ON public.subscriptions FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'subscriptions' AND policyname = 'Users can update own subscription') THEN
    CREATE POLICY "Users can update own subscription" ON public.subscriptions FOR UPDATE USING (auth.uid() = user_id);
  END IF;
END $$;

-- Also allow service_role full access (for webhook/admin operations)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'subscriptions' AND policyname = 'Service role full access') THEN
    CREATE POLICY "Service role full access" ON public.subscriptions FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
  END IF;
END $$;

-- ============================================
-- FIX: contact_submissions table RLS
-- ============================================
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- Drop any overly-permissive policies
DROP POLICY IF EXISTS "Enable read access for all users" ON public.contact_submissions;
DROP POLICY IF EXISTS "Allow all" ON public.contact_submissions;
DROP POLICY IF EXISTS "contact_select" ON public.contact_submissions;
DROP POLICY IF EXISTS "Enable insert for all users" ON public.contact_submissions;

-- Allow anonymous inserts (contact form), but no reads by non-admin
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'contact_submissions' AND policyname = 'Allow anonymous insert') THEN
    CREATE POLICY "Allow anonymous insert" ON public.contact_submissions FOR INSERT WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'contact_submissions' AND policyname = 'Service role full access') THEN
    CREATE POLICY "Service role full access" ON public.contact_submissions FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
  END IF;
END $$;
`

export async function POST(request: NextRequest) {
  try {
    // Auth check - CEO only
    const supabaseAuth = createRouteHandlerClient({ cookies })
    const { data: { session } } = await supabaseAuth.auth.getSession()

    if (!session || session.user.email !== CEO_EMAIL) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Check for DATABASE_URL
    const dbUrl = process.env.DATABASE_URL
    if (!dbUrl) {
      return NextResponse.json(
        { error: 'DATABASE_URL environment variable not set. Add it in Vercel project settings.' },
        { status: 500 }
      )
    }

    // Connect and execute migration
    const client = new Client({
      connectionString: dbUrl,
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 15000,
    })

    await client.connect()
    await client.query(RLS_MIGRATION)
    await client.end()

    return NextResponse.json({
      success: true,
      message: 'RLS policies applied successfully. subscriptions and contact_submissions tables are now secured.',
      applied: [
        'subscriptions: RLS enabled, user-scoped SELECT/INSERT/UPDATE, service_role full access',
        'contact_submissions: RLS enabled, anonymous INSERT only, service_role full access',
      ]
    })
  } catch (error: any) {
    console.error('Migration error:', error)
    return NextResponse.json(
      { error: 'Migration failed', details: error.message },
      { status: 500 }
    )
  }
}
