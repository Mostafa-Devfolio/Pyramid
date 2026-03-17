// middleware.ts (or proxy.ts if you are importing this elsewhere)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getLoginTo } from './app/[locale]/login/login'; // Assumes you moved it!
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

// 1. Initialize the next-intl middleware
const intlMiddleware = createMiddleware(routing);

// 2. Next.js expects the default export to be the middleware function
export default async function middleware(request: NextRequest) {
  const token = await getLoginTo();

  // 3. Define the routes you want to protect
  // (Since next-intl adds locales to the URL like /en/profile, we check if the path includes the protected words)
  const pathname = request.nextUrl.pathname;
  const isProtectedPath = ['/profile', '/checkout', '/courier', '/taxi', '/orders', '/address'].some((path) =>
    pathname.includes(path)
  );

  // 4. Handle Auth Redirects
  if (isProtectedPath && !token) {
    // Redirect to your locked/login page.
    // You might want to include the locale here in the future!
    return NextResponse.redirect(new URL('/locked', request.url));
  }

  // 5. If auth passes (or it's a public route), pass the request to next-intl
  // so it can handle the /en/ or /es/ URL routing
  return intlMiddleware(request);
}

// 6. Matcher config
export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
