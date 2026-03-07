import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const response = NextResponse.next();

    // Check if Stub User UUID cookie exists
    let uuid = request.cookies.get('stub_user_id')?.value;

    // If not, generate a new one and set it
    if (!uuid) {
        uuid = crypto.randomUUID();
        response.cookies.set({
            name: 'stub_user_id',
            value: uuid,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24 * 365, // 1 year
        });
    }

    return response;
}

export const config = {
    matcher: [
        // Apply to all routes except api, _next/static, _next/image, favicon.ico
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};
