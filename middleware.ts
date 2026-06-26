import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone()
  const hostname = request.headers.get('host') || ''

  // Exclude localhost for local development
  if (hostname.includes('localhost') || hostname.includes('127.0.0.1')) {
    return NextResponse.next()
  }

  // If the hostname is NOT www.khelardesh.com, redirect to www.khelardesh.com
  // This catches khelardesh.com, khelardesh.vercel.app, and any other aliases
  if (hostname !== 'www.khelardesh.com') {
    url.host = 'www.khelardesh.com'
    url.port = '' // Ensure port is cleared when redirecting to prod
    url.protocol = 'https:'
    return NextResponse.redirect(url, 301) // 301 Permanent Redirect for SEO
  }

  return NextResponse.next()
}

export const config = {
  // Apply middleware to all routes except internal Next.js paths and API routes
  // (API routes excluded to ensure external services/webhooks aren't broken by redirects)
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)',
  ],
}
