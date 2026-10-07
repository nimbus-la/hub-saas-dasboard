import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { DEFAULT_HOME_HREF, LOGIN_HREF, SESSION_COOKIES } from "./utils";

const PUBLIC_PATHS = new Set(["/", LOGIN_HREF]);

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const hasSessionCookie = request.cookies.has(SESSION_COOKIES.ACCESS_TOKEN);

    if (PUBLIC_PATHS.has(pathname)) {
        if (pathname === LOGIN_HREF && hasSessionCookie) {
            return NextResponse.redirect(new URL(DEFAULT_HOME_HREF, request.url));
        }

        return NextResponse.next();
    }

    if (!hasSessionCookie) {
        const loginUrl = new URL(LOGIN_HREF, request.url);
        loginUrl.searchParams.set("from", pathname);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|images|favicon.ico).*)"],
};
