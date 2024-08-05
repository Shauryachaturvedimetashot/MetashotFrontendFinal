import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 

export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;
    const publicPaths= path =="/login" || path ==="/";
    const protectedPaths= path ==="/Jobs" || path==="/addQuestions" ||path==="Candidates" || path==="createInterview" || path ==="Invite" || path ==="PastInterviews" || path ==="scheduledInterviews" || path ==="Settings";
    const token = request.cookies.get("token")?.value||"";
    if(publicPaths && token){
        return NextResponse.redirect(
            new URL('/Jobs', request.nextUrl)
        );
    };
    if(protectedPaths && !token){
        return NextResponse.redirect(
            new URL('/SignUp', request.nextUrl)
        );
    };

  return NextResponse.next();
}
 

export const config = {
  matcher: '/(.*)',
}