import { EnvelopeHttpClient } from "./envelope-http-client";
import { FetchHttpClient } from "./fetch-http-client";
import type { HttpClient } from "@/interfaces";

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
const BASE_URL =
    (typeof window === "undefined" ? process.env["API_INTERNAL_URL"] : undefined) ??
    process.env["NEXT_PUBLIC_API_URL"] ??
    "";

/**
 * Cliente compartido de la aplicación.
 *
 * Se tipa como `HttpClient` y no como `FetchHttpClient` a propósito: así el
 * autocompletado sólo ofrece lo que está en el contrato, y es imposible que
 * una pantalla acabe dependiendo sin querer de un detalle de `fetch`.
 *
 * Se compone en dos capas, de dentro hacia fuera:
 *
 * 1. `FetchHttpClient` — habla por la red. Sólo sabe de HTTP.
 * 2. `EnvelopeHttpClient` — saca `data` del sobre de este backend y convierte
 *    un `code` de fallo en un error lanzado.
 *
 * Cada una tiene un motivo distinto para cambiar. Para migrar a otra librería
 * de red se sustituye la de dentro y la de fuera no se entera:
 *
 *     new EnvelopeHttpClient(new AxiosHttpClient({ ... }))
 *
 * Y el día que el backend deje de envolver sus respuestas, se quita la de
 * fuera y ni un servicio se toca.
 */
export const httpClient: HttpClient = new EnvelopeHttpClient(
    new FetchHttpClient({
        baseUrl: BASE_URL,
        headers: {
            Accept: "application/json",
        },

        // Aquí entra el token cuando exista sesión. Se hace en el interceptor y
        // no en `headers` porque `headers` se evalúa una sola vez al arrancar
        // el módulo, y el token cambia durante la vida de la aplicación.
        //
        // onRequest: async (request) => ({
        //     ...request,
        //     headers: { ...request.headers, Authorization: `Bearer ${await getToken()}` },
        // }),
    })
);
