import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect all API routes under /api/
  if (pathname.startsWith('/api/')) {
    const authHeader = request.headers.get('authorization') || request.headers.get('x-cuddlytails-auth');
    const referer = request.headers.get('referer');
    const host = request.headers.get('host');

    // Verify same-origin or authorization token presence
    const isSameOrigin = referer && host && referer.includes(host);

    if (!isSameOrigin && !authHeader && process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { error: 'Access Denied: Direct backend access is restricted.' },
        { status: 403 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
};
