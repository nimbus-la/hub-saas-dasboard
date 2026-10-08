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
 * Origen ficticio contra el que se resuelve `from`. Solo sirve para saber si la
 * ruta se queda en casa: si al resolverla el origen cambia, apuntaba fuera.
 */
const PANEL_ORIGIN_PLACEHOLDER = "http://panel.invalid";


/**
 * A dónde volver después de iniciar sesión.
 *
 * `from` lo escribe el proxy, pero viaja en la URL y cualquiera puede armar un
 * enlace a `/login?from=https://otro-sitio.com`. Mirar el texto no basta: el
 * navegador borra tabuladores y saltos de línea y lee `\` como `/`, así que
 * `/\t/otro-sitio.com` acaba siendo `//otro-sitio.com`. Por eso se resuelve
 * con el mismo parser que usará el navegador y se devuelve lo que salió de él,
 * no lo que llegó.
 *
 * La ruta resuelta también se comprueba: `/.//otro-sitio.com` se queda en el
 * origen al resolverla, pero normaliza a `//otro-sitio.com`, y eso en un
 * `href` vuelve a ser otro sitio. Volver al propio login no tiene sentido, así
 * que también cae al inicio.
 */
export function resolvePostLoginHref(from: string | string[] | undefined): string {
    if (typeof from !== "string" || !from.startsWith("/")) return DEFAULT_HOME_HREF;

    let url: URL;
    try {
        url = new URL(from, PANEL_ORIGIN_PLACEHOLDER);
    } catch {
        return DEFAULT_HOME_HREF;
    }

    const isSameOrigin = url.origin === PANEL_ORIGIN_PLACEHOLDER;
    if (!isSameOrigin || url.pathname.startsWith("//") || url.pathname === LOGIN_HREF) {
        return DEFAULT_HOME_HREF;
    }

    return url.pathname + url.search + url.hash;
}
