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
const DRAFT_COOKIE = 'geocutter_draft_key';

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
  const isArticle = pathname.startsWith('/articles/');
  const draftKey = request.nextUrl.searchParams.get('dk');
  const cookieDraftKey = request.cookies.get(DRAFT_COOKIE)?.value;
  const isDraft = isArticle && (draftKey !== null || cookieDraftKey !== undefined);
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

  const cleanUrl = request.nextUrl.clone();
  cleanUrl.searchParams.delete('dk');
  const response = isArticle && draftKey !== null
    ? NextResponse.redirect(cleanUrl)
    : NextResponse.next();
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
  if (isArticle && draftKey !== null) {
    response.cookies.set(DRAFT_COOKIE, draftKey, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 300,
      path: `/blog${pathname}`,
    });
  } else if (isDraft) {
    response.cookies.delete({ name: DRAFT_COOKIE, path: `/blog${pathname}` });
  }

  return response;
}

export const config = {
  matcher: '/:path*',
};
