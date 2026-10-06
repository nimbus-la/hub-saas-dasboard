import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SESSION_COOKIE = "vorea_session";
const PUBLIC_PATHS = new Set(["/", "/login"]);

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const hasSessionCookie = Boolean(request.cookies.get(SESSION_COOKIE)?.value);

    if (PUBLIC_PATHS.has(pathname)) {
        if (pathname === "/login" && hasSessionCookie) {
            return NextResponse.redirect(new URL("/dashboard", request.url));
        }

        return NextResponse.next();
    }

    if (!hasSessionCookie) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("from", pathname);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
