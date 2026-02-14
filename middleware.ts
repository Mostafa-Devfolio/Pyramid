import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import { getLoginTo } from './app/login/login'
 
// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
    const token = await getLoginTo();
    if(token){
        NextResponse.next();
    } else{ 
        return NextResponse.redirect(new URL('/', request.url))
    }
}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/profile', '/checkout', '/orders/:path*'],
}