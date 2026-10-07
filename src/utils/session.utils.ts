import { DEFAULT_HOME_HREF, LOGIN_HREF } from "./session.constants";


/**
 * Ruta del login que recuerda de dónde se venía.
 *
 * La usan el proxy, al cortar el paso, y el gestor de sesión, al expulsar a
 * alguien cuya sesión caducó: así los dos escriben `from` igual y
 * `resolvePostLoginHref` lo lee en un solo formato.
 */
export function buildLoginHref(from?: string): string {
    if (!from || from === LOGIN_HREF) return LOGIN_HREF;

    return `${LOGIN_HREF}?${new URLSearchParams({ from }).toString()}`;
}


/**
 * A dónde volver después de iniciar sesión.
 *
 * `from` lo escribe el proxy, pero viaja en la URL y cualquiera puede armar un
 * enlace a `/login?from=https://otro-sitio.com`. Solo se acepta una ruta del
 * propio panel: empieza por `/` y no por `//` ni `/\`, que el navegador lee
 * como otro origen. Volver al propio login no tiene sentido, así que también
 * cae al inicio.
 */
export function resolvePostLoginHref(from: string | string[] | undefined): string {
    if (typeof from !== "string") return DEFAULT_HOME_HREF;

    const isInternalPath = from.startsWith("/") && !from.startsWith("//") && !from.startsWith("/\\");
    if (!isInternalPath || from === LOGIN_HREF) return DEFAULT_HOME_HREF;

    return from;
}
