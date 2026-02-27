import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const type = requestUrl.searchParams.get('type');

  if (code) {
    const supabase = createRouteHandlerClient({ cookies });
    await supabase.auth.exchangeCodeForSession(code);
  }

  // Handle different auth callback types
  // For password recovery, redirect to reset-password page
  if (type === 'recovery') {
    return NextResponse.redirect(`${requestUrl.origin}/reset-password`);
  }

  // For email verification (signup), redirect to verified page
  return NextResponse.redirect(`${requestUrl.origin}/verified`);
}
