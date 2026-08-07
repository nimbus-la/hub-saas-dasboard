import type { ErrorInterceptor, RequestInterceptor } from "./http.interfaces";


/**
 * Opciones de la implementación sobre `fetch`
 *
 * A diferencia de `http.interfaces.ts`, que describe el contrato que cumple
 * *cualquier* cliente, esto describe cómo se configura **una** implementación
 * concreta: `FetchHttpClient` (`src/lib/http/fetch-http-client.ts`).
 *
 * La distinción importa a la hora de importar. Un servicio o un hook depende
 * de `HttpClient` y nunca de esto; quien construye el cliente —el punto de
 * composición en `src/lib/http/index.ts`— es el único que lo necesita. Si
 * mañana se añade un `AxiosHttpClient`, tendrá su propio archivo de opciones
 * al lado de éste, porque sus ajustes no tienen por qué coincidir.
 */



export interface FetchHttpClientOptions {
    /**
     * Prefijo de toda ruta relativa, sin barra final.
     *
     * Vacío significa "mismo origen", útil para pegarle a los Route Handlers
     * del propio Next (`/api/...`). Si se pasa con barra final, el cliente la
     * quita: `${baseUrl}${path}` nunca debe producir `//categories`, que
     * algunos backends tratan como una ruta distinta.
     */
    baseUrl?: string;

    /**
     * Cabeceras fijas de todas las peticiones (`Accept`, versión de API…).
     *
     * Se evalúan una sola vez, al construir el cliente, así que no sirven para
     * valores que cambian durante la sesión. El token de autenticación va en
     * `onRequest`, que se ejecuta en cada petición.
     */
    headers?: Record<string, string>;

    /**
     * Tiempo máximo por defecto, en milisegundos. `0` lo desactiva.
     *
     * Se aplica a toda petición que no traiga el suyo. Por defecto,
     * `HTTP_DEFAULT_TIMEOUT_MS`.
     */
    timeoutMs?: number;

    /**
     * Envío de cookies por defecto.
     *
     * Necesario si la sesión viaja en una cookie emitida por otro dominio:
     * `fetch` no las manda entre orígenes distintos salvo que se le indique.
     */
    credentials?: RequestCredentials;

    /**
     * Ver `RequestInterceptor`.
     *
     * Punto de entrada del token de sesión, del id de correlación para trazas
     * o de la sucursal activa. Se ejecuta antes de cada petición y puede ser
     * asíncrono.
     */
    onRequest?: RequestInterceptor;

    /**
     * Ver `ErrorInterceptor`.
     *
     * Punto de salida para telemetría y para reaccionar a un 401 cerrando la
     * sesión. Observa el fallo, no lo repara: el error se propaga igual a quien
     * hizo la petición.
     */
    onError?: ErrorInterceptor;
}
