import type { HttpClient, RequestInterceptor } from "@/interfaces";
import { EnvelopeHttpClient } from "./envelope-http-client";
import { FetchHttpClient } from "./fetch-http-client";

export * from "./api-alert";
export * from "./base-http-client";
export * from "./envelope";
export * from "./envelope-http-client";
export * from "./fetch-http-client";
export * from "./http-error";


/**
 * Punto de composición del transporte
 * 
 * El único sitio del proyecto donde se decide QUÉ implementación de
 * `HttpClient` se usa. Cambiar de librería es cambiar la clase que se
 * construye aquí abajo: ni una pantalla, ni un hook, ni un servicio se entera.
 *
 * Cómo se consume, según dónde estés:
 *
 *   · Server Component / Server Action → importa `httpClient` directamente.
 *   · Componente cliente              → `useHttpClient()` de `@/context`, que
 *                                        permite inyectar un doble en pruebas.
 *
 * Nadie más debería instanciar un cliente por su cuenta.
 */


/**
 * Origen del backend.
 *
 * En el servidor se prefiere `API_INTERNAL_URL` si existe, para hablar con el
 * backend por la red interna del despliegue —más rápido y sin salir a
 * internet—. En el navegador sólo puede existir la variable pública, porque
 * Next únicamente inyecta al bundle las que llevan el prefijo `NEXT_PUBLIC_`.
 *
 * Si ninguna está definida, queda vacío y las rutas se resuelven contra el
 * mismo origen: sirve para pegarle a los Route Handlers del propio Next.
 */
const DEFAULT_BASE_URL =
    (typeof window === "undefined" ? process.env["API_INTERNAL_URL"] : undefined) ??
    process.env["NEXT_PUBLIC_API_URL"] ??
    "";



export interface CreateHttpClientOptions {
    /** Sustituye el origen por defecto. Lo usa el banco de pruebas. */
    baseUrl?: string;

    /**
     * Ver `RequestInterceptor`. Se ejecuta antes de cada petición.
     *
     * Para cabeceras que cambian durante la sesión: un id de correlación para
     * trazas, la sucursal activa. No sirven las de `headers`, que se evalúan una
     * sola vez al construir el cliente.
     */
    onRequest?: RequestInterceptor;
}



/**
 * Fábrica del cliente.
 *
 * Apila los decoradores de dentro hacia fuera:
 *
 *   1. `FetchHttpClient`    — red. Sólo sabe de HTTP.
 *   2. `EnvelopeHttpClient` — quita el sobre y convierte un `code` de fallo en
 *                             un error lanzado.
 *
 * Existe como función y no sólo como constante para que el banco de pruebas
 * pueda apuntar a otro origen sin tocar variables de entorno.
 *
 * Aquí es donde entran las capas que faltan, sin tocar nada más:
 *
 *   · `LoggingHttpClient` — **por fuera de todo**, porque es el único punto que
 *     ve tanto los fallos de red como los que lanza el decorador del sobre.
 *   · `AuthHttpClient` — por fuera del sobre, porque este backend puede anunciar
 *     un 401 dentro de un `200 OK` y una capa colocada por dentro no lo vería.
 */
export function createHttpClient(options: CreateHttpClientOptions = {}): HttpClient {
    const transport = new FetchHttpClient({
        baseUrl: options.baseUrl ?? DEFAULT_BASE_URL,
        headers: { Accept: "application/json" },
        credentials: "include",
        ...(options.onRequest ? { onRequest: options.onRequest } : {}),
    });

    return new EnvelopeHttpClient(transport);
}



/**
 * Cliente compartido de la aplicación.
 *
 * Se tipa como `HttpClient` y no como la clase concreta a propósito: así el
 * autocompletado sólo ofrece lo que está en el contrato, y es imposible que una
 * pantalla acabe dependiendo sin querer de un detalle de `fetch`.
 */
export const httpClient: HttpClient = createHttpClient();
