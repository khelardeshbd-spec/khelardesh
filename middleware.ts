import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // Only protect /admin/* routes, but allow the login page /admin
  if (path === '/admin') {
    return NextResponse.next();
  }

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    return NextResponse.redirect(new URL('/admin', req.url));
  }

  // Restrict employee access
  if (token?.role === 'employee') {
    const restrictedPaths = [
      '/admin/dashboard', 
      '/admin/composers', 
      '/admin/scores', 
      '/admin/sponsors', 
      '/admin/team', 
      '/admin/admins', 
      '/admin/activity'
    ];
    
    if (restrictedPaths.some(p => path === p || path.startsWith(`${p}/`))) {
      return NextResponse.redirect(new URL('/admin/articles', req.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
