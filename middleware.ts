import type { NextFetchEvent } from 'next/server';
import { NextResponse } from 'next/server';
import { withAuth } from 'next-auth/middleware';

// NextJS Middleware in combination with NextAuth
export default withAuth(
  async function middleware(req, event: NextFetchEvent) {
    const notFoundUrl = `${process.env.NEXT_PUBLIC_DOMAIN_URL}/404`;
    const loginUrl = `${process.env.NEXT_PUBLIC_DOMAIN_URL}/login`;

    const token = req.nextauth.token;
    const isAdmin = token?.role === 'ADMIN';
    // const isCustomer = token?.role === 'CUSTOMER';

    if (!token) {
      console.log('Token not found, redirecting to login page');
      return NextResponse.redirect(loginUrl);
    }

    if (req.url.startsWith('/api/admin') && !isAdmin) {
      console.log(
        'Token found, but account is not authorized, redirecting to 404 page',
      );
      return NextResponse.redirect(notFoundUrl);
    }
  },
  {
    callbacks: {
      // authorized: ({ token, req }) => {
      //   if (!token) return false;

      //   if (req.url.startsWith('/api/admin')) {
      //     (req as any).isAuthenticated = true;
      //     return token.role === 'ADMIN';
      //   } else {
      //     return token.role === 'ADMIN' || token.role === 'CUSTOMER';
      //   }
      // },
      authorized: () => true,
    },
  },
);

export const config = {
  matcher: [
    '/api/admin/:path*',
    '/api/profile/:path*',
    '/api/cart/:accountId',
    '/checkout',
    '/distance',
  ],
};
