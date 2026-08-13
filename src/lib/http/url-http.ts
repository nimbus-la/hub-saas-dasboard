import { QueryParams } from "@/interfaces";


/**
 * Construccion de URLs para peticiones HTTP.
 * 
 * Todo lo que hace falta para convertir `("/categories", { pageNumber 2 })` en una
 * URL absoluta. Viven fuera del cliente porque no tienen nada que ver con hablar
 * por la red, son funciones puras y ésa es la unica razon por la que cambian.
 */


/** Detecta `https://`, `http://` y cualquier otro esquema valido. */
const ABSOLUTE_URL_PATTERN = /^[a-z][a-z\d+\-.]*:\/\//i;



/**
 * Quita las barras finales del origen.
 * 
 * Se hace una vez al construir el cliente, no en cada peticion.
 * `${baseUrl}${path}` nunca debe producir `//categories`, algunos
 * backends tratan como otra ruta.
 */
export function normalizeUrl(baseUrl: string | undefined): string {
    return baseUrl?.replace(/\/+$/, "") ?? "";
};



/**
 * Serializa los parámetros a query string.
 * 
 * Dos decisiones que no son evidentes:
 * - `null` y `undefined` se omiten, no se mandan vacios. Un filtro sin
 *   elegir no debe llegar como `?status=`, que para el backend es un valor.
 * 
 * - Una array produce la clave repetida (`tag=a&tag=b`), que es la convención
 *   mas extendida.
 */
export function serializeQueryParams(params?: QueryParams): string {
    if (!params) return "";

    const search = new URLSearchParams();

    for (const [key, value] of Object.entries(params)) {
        if (value === undefined || value === null) continue;

        if (Array.isArray(value)) {
            for (const item of value) search.append(key, String(item));
            continue;
        };

        search.append(key, String(value));
    };

    return search.toString();
};



/**
 * Une origen, ruta y query string.
 * 
 * Las URL absolutas pasan intactas, sin el `baseUrl`, es lo que permite llamar
 * a un servicio de terceros con el mismo cliente.
 */
export function buildRequestUrl(
    baseUrl: string,
    url: string,
    params?: QueryParams
): string {
    const path = ABSOLUTE_URL_PATTERN.test(url)
        ? url
        : `${baseUrl}${url.startsWith("/") ? url : `/${url}`}`;

    const search = serializeQueryParams(params);

    if (search.length === 0) return path;

    return `${path}${path.includes("?") ? "&" : "?"}${search}`;
};