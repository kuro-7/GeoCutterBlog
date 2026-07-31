import { NextRequest, NextResponse } from 'next/server';

const CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "script-src 'self' 'unsafe-inline' https://static.cloudflareinsights.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https://cdn.geocutter.com",
  "connect-src 'self'",
  "font-src 'self'",
  "frame-src 'none'",
  "form-action 'self'",
].join('; ');

const stripBasePath = (pathname: string) => {
  if (pathname === '/blog') {
    return '/';
  }
  return pathname.startsWith('/blog/') ? pathname.slice('/blog'.length) : pathname;
};

const isNoIndexPath = (pathname: string) =>
  pathname === '/search' ||
  /^\/p\/\d+$/.test(pathname) ||
  /^\/search\/p\/\d+$/.test(pathname) ||
  /^\/tags\/[^/]+(?:\/p\/\d+)?$/.test(pathname);

export function middleware(request: NextRequest) {
  const pathname = stripBasePath(request.nextUrl.pathname);
  const isStaging = request.nextUrl.hostname === 'staging.geocutter.com';
  const isDraft = pathname.startsWith('/articles/') && request.nextUrl.searchParams.has('dk');
  const directives = new Set<string>();

  if (isStaging) {
    directives.add('noindex');
    directives.add('nofollow');
  } else if (isNoIndexPath(pathname)) {
    directives.add('noindex');
    directives.add('follow');
  }

  if (isDraft) {
    directives.add('noindex');
    directives.add('noarchive');
  }

  const response = NextResponse.next();
  response.headers.set('Content-Security-Policy', CONTENT_SECURITY_POLICY);
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
  );

  if (directives.size) {
    response.headers.set('X-Robots-Tag', Array.from(directives).join(', '));
  }
  if (isDraft) {
    response.headers.set('Cache-Control', 'private, no-store, max-age=0');
  }

  return response;
}

export const config = {
  matcher: '/:path*',
};
