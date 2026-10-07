import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { DEFAULT_HOME_HREF, LOGIN_HREF, SESSION_COOKIES, buildLoginHref } from "./utils";

const PUBLIC_PATHS = new Set(["/", LOGIN_HREF]);

export function proxy(request: NextRequest) {
    const { pathname, search } = request.nextUrl;

    // Basta con cualquiera de las dos cookies. `jwt_access` caduca en una hora
    // y `jwt_refresh` dura días: si solo mirásemos la primera, quien vuelve
    // tras una pausa tendría que iniciar sesión otra vez aunque su sesión
    // siga viva. Con solo `jwt_refresh`, el cliente renueva el acceso al
    // cargar o con el primer 401; si el backend la rechaza, el gestor de
    // sesión cierra y borra las cookies, así que no hay bucle con el login.
    const hasSession =
        request.cookies.has(SESSION_COOKIES.ACCESS_TOKEN) ||
        request.cookies.has(SESSION_COOKIES.REFRESH_TOKEN);

    if (PUBLIC_PATHS.has(pathname)) {
        if (pathname === LOGIN_HREF && hasSession) {
            return NextResponse.redirect(new URL(DEFAULT_HOME_HREF, request.url));
        }

        return NextResponse.next();
    }

    if (!hasSession) {
        return NextResponse.redirect(new URL(buildLoginHref(pathname + search), request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|images|favicon.ico).*)"],
};
