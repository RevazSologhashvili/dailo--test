import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const session = request.cookies.get('session_test')?.value;
  const pathname = request.nextUrl.pathname;

  const lowerPath = pathname.toLowerCase();

  // 1. Redirect '/' to '/Login'
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/Login', request.url));
  }

  // 2. Normalize casing: force `/login` → `/Login`, `/main` → `/Main`
  if (lowerPath === '/login' && pathname !== '/Login') {
    return NextResponse.redirect(new URL('/Login', request.url));
  }
  if (lowerPath === '/main' && pathname !== '/Main') {
    return NextResponse.redirect(new URL('/Main', request.url));
  }

  // 3. If accessing /Login and user is logged in → redirect to /Main
  if (lowerPath === '/login' && session) {
    return NextResponse.redirect(new URL('/Main', request.url));
  }

  // 4. If accessing /Main and user is NOT logged in → redirect to /Login
  if (lowerPath === '/main' && !session) {
    return NextResponse.redirect(new URL('/Login', request.url));
  }

  return NextResponse.next();
}

// Match all routes for login/main/home redirect logic
export const config = {
  matcher: ['/', '/login', '/Login', '/main', '/Main'],
};

