import { NextRequest, NextResponse } from 'next/server'
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'

const CEO_EMAIL = 'hxssxn772@gmail.com'

// Routes that require authentication
const protectedRoutes = ['/dashboard']

// CEO-only routes - returns 404 for everyone else (invisible)
const ceoRoutes = ['/ceo']

// Routes that redirect to dashboard if already authenticated
const authRoutes = ['/login', '/register']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const response = NextResponse.next()

  // Create Supabase middleware client (handles cookie session automatically)
  const supabase = createMiddlewareClient({ req: request, res: response })

  // Refresh session if expired - important for Server Components
  const { data: { session } } = await supabase.auth.getSession()

  const isAuthenticated = !!session
  const userEmail = session?.user?.email?.toLowerCase() || ''

  // CEO routes - completely invisible to non-CEO users
  const isCeoRoute = ceoRoutes.some((route) => pathname.startsWith(route))
  if (isCeoRoute) {
    if (!isAuthenticated || userEmail !== CEO_EMAIL) {
      // Return 404 - page doesn't exist for non-CEO users
      const url = new URL('/not-found', request.url)
      return NextResponse.rewrite(url)
    }
    return response
  }

  // Check if route needs protection
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  )
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route))

  // Redirect to login if accessing protected route without auth
  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Redirect to dashboard if already authenticated and trying to access auth routes
  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - public folder
     * - api routes
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.svg$|api/).*)',
  ],
}
