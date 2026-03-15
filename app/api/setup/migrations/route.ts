import { NextResponse } from 'next/server'
import { Client } from 'pg'

export async function POST() {
  const connectionString = process.env.DATABASE_URL || process.env.DIRECT_URL
  if (!connectionString) {
    return NextResponse.json({ error: 'No database connection string configured' }, { status: 500 })
  }

  const client = new Client({ connectionString, ssl: { rejectUnauthorized: false } })

  try {
    await client.connect()

    await client.query('ALTER TABLE clients ADD COLUMN IF NOT EXISTS photo_url TEXT;')
    await client.query('ALTER TABLE user_settings ADD COLUMN IF NOT EXISTS webhook_key TEXT;')
    await client.query('ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS is_gifted BOOLEAN DEFAULT FALSE;')
    await client.query('ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS gifted_by UUID;')
    await client.query('ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS gift_months INTEGER;')

    await client.end()
    return NextResponse.json({ success: true, migrations: ['photo_url', 'webhook_key', 'is_gifted', 'gifted_by', 'gift_months'] })
  } catch (error: any) {
    try { await client.end() } catch {}
    console.error('Migration error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
