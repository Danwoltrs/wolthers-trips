import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // If user is authenticated and trying to access login page, redirect to dashboard
    if (token && pathname === '/') {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    // If user is not authenticated and trying to access protected routes, redirect to login
    if (!token && pathname.startsWith('/dashboard')) {
      return NextResponse.redirect(new URL('/', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow access to login page and public routes
        if (req.nextUrl.pathname === '/' || req.nextUrl.pathname.startsWith('/api/auth')) {
          return true;
        }
        
        // Require authentication for dashboard routes
        if (req.nextUrl.pathname.startsWith('/dashboard')) {
          return !!token;
        }
        
        // Allow all other routes
        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    '/((?!api/(?!auth)|_next/static|_next/image|favicon.ico|test-page).*)',
  ],
};