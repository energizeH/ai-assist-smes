import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    // Check if bucket exists
    const { data: buckets } = await supabase.storage.listBuckets()
    const exists = buckets?.some(b => b.name === 'client-photos')

    if (!exists) {
      const { error } = await supabase.storage.createBucket('client-photos', {
        public: true,
        fileSizeLimit: 5 * 1024 * 1024, // 5MB
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
      })
      if (error && !error.message?.includes('already exists')) {
        console.error('Bucket creation error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Storage setup error:', error)
    return NextResponse.json({ error: 'Failed to set up storage' }, { status: 500 })
  }
}
