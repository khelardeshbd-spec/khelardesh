import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Restrict employee access to specific paths
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
      
      // If the path matches any restricted path
      if (restrictedPaths.some(p => path === p || path.startsWith(`${p}/`))) {
        return NextResponse.redirect(new URL('/admin/articles', req.url));
      }
    }
    
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname;
        // /admin is the login page, let everyone access it (it handles logged-in redirects internally)
        if (path === '/admin') {
          return true;
        }
        // All other /admin/* routes require authentication
        if (path.startsWith('/admin/')) {
          return !!token;
        }
        return true;
      },
    },
  }
);

export const config = {
  matcher: ['/admin/:path*'],
};
