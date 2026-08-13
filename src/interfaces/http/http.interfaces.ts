/**
 * Contrato del cliente HTTP
 * 
 * Esta es la costura de la aplicación con el mundo exterior. Todo lo que hable
 * con el backend depende de `HttpClient` —la interfaz— y nunca de una
 * implementación concreta.
 * 
 * El objetivo es que cambiar `fetch` por axios, por `ky` o por un cliente
 * falso en pruebas signifique escribir una clase nueva que cumpla este
 * contrato y registrarla en un único sitio (`src/lib/http/index.ts`), sin
 * tocar ni una pantalla.
 * 
 * Por eso aquí no aparece ni un tipo propio de `fetch` salvo los que son
 * estándar del navegador (`Headers`, `AbortSignal`, `RequestCache`): son parte
 * de la plataforma, no de la librería, y cualquier implementación puede
 * respetarlos.
 */



/** Verbos que usa la aplicación. Si el backend expone otro, se añade aquí. */
export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";



/** Valor admitido en la query string. Todo se serializa con `String()`. */
export type QueryParamPrimitive = string | number | boolean;



/**
 * Parámetros de la query string.
 *
 * Los `null` y `undefined` se omiten en lugar de mandarse como cadena vacía:
 * un filtro sin elegir no debe llegar al backend como `?status=`, que es un
 * valor distinto de "no filtrar".
 *
 * Un array produce la clave repetida (`?tag=a&tag=b`), que es la convención
 * más común. Si tu backend espera `?tag=a,b`, únelo antes de pasarlo.
 */
export type QueryParams = Record<
    string,
    QueryParamPrimitive | QueryParamPrimitive[] | null | undefined
>;



/**
 * Cómo interpretar el cuerpo de la respuesta.
 *
 * `json` cubre el 99% y es el valor por defecto. `blob` existe para descargas
 * (exportar ventas a Excel) y `text` para respuestas que no son JSON.
 */
export type ResponseFormat = "json" | "text" | "blob";



/** Opciones de una petición, sin el método ni la URL. */
export interface HttpRequestConfig {
    /** Cabeceras propias de esta petición. Se fusionan sobre las del cliente. */
    headers?: Record<string, string>;

    /** Query string. Ver `QueryParams`. */
    params?: QueryParams;

    /**
     * Señal de cancelación del llamante.
     *
     * React Query pasa la suya en `queryFn` para abortar consultas que ya no
     * interesan (el usuario cambió de página antes de que respondiera). Se
     * combina con el `timeout` interno, no lo reemplaza.
     */
    signal?: AbortSignal;

    /**
     * Milisegundos antes de abortar por tiempo. `0` desactiva el límite.
     *
     * Sin esto, una petición contra un backend caído deja el spinner girando
     * para siempre: `fetch` no tiene timeout por defecto.
     */
    timeoutMs?: number;

    /** Formato del cuerpo de la respuesta. Por defecto `json`. */
    responseAs?: ResponseFormat;

    /** Envío de cookies. Necesario si la sesión va en cookie de otro dominio. */
    credentials?: RequestCredentials;

    /**
     * Caché HTTP estándar.
     *
     * Sólo tiene efecto en implementaciones basadas en `fetch`. Una
     * implementación con axios la ignora, y es correcto que lo haga: es una
     * pista, no una garantía del contrato.
     */
    cache?: RequestCache;

    /**
     * Caché de Next (`revalidate` y `tags`), para peticiones desde Server
     * Components y Server Actions.
     *
     * Es la razón principal por la que la implementación por defecto usa
     * `fetch` y no axios: `revalidateTag` sólo puede invalidar lo que pasó por
     * `fetch`.
     */
    next?: NextFetchRequestConfig;
}



/** Petición completa: configuración + qué se pide y a dónde. */
export interface HttpRequest extends HttpRequestConfig {
    method: HttpMethod;

    /**
     * Ruta relativa al `baseUrl` (`/categories`) o URL absoluta.
     *
     * Las absolutas se respetan tal cual, para poder llamar a servicios de
     * terceros con el mismo cliente.
     */
    url: string;

    /**
     * Cuerpo de la petición.
     *
     * Un objeto plano se serializa a JSON y se le pone la cabecera. `FormData`,
     * `Blob`, `URLSearchParams` y `string` se envían tal cual.
     */
    body?: unknown;
}



/**
 * Respuesta con sus metadatos.
 *
 * Los métodos por verbo (`get`, `post`…) devuelven directamente `data`, porque
 * es lo único que necesita el 95% de las llamadas. `request()` devuelve esto
 * completo para cuando hacen falta `status` o `headers` — por ejemplo leer
 * `X-Total-Count` o el cursor de la siguiente página en un listado grande.
 */
export interface HttpResponse<TData> {
    data: TData;
    status: number;
    headers: Headers;
}



/**
 * Se ejecuta antes de cada petición y devuelve la petición a enviar.
 *
 * Es el punto para inyectar el token de sesión, un id de correlación para
 * trazas o la sucursal activa. Puede ser asíncrono (leer el token de un
 * almacén asíncrono, por ejemplo).
 */
export type RequestInterceptor = (
    request: HttpRequest
) => HttpRequest | Promise<HttpRequest>;



/**
 * Se ejecuta ante cualquier fallo, antes de que el error se propague.
 *
 * Observa, no repara: sirve para telemetría o para cerrar sesión ante un 401.
 * No puede sustituir la respuesta, y es deliberado — un interceptor que
 * reintenta en silencio hace que los fallos sean invisibles justo cuando más
 * necesitas verlos.
 */
export type ErrorInterceptor = (
    error: unknown,
    request: HttpRequest
) => void | Promise<void>;



/**
 * Cliente HTTP de la aplicación.
 *
 * Los métodos por verbo devuelven el cuerpo ya parseado y **lanzan** ante
 * cualquier fallo (incluido un 4xx o 5xx). No hay que comprobar `response.ok`
 * en el llamante: si la promesa resuelve, hay datos válidos.
 *
 * Eso es justo lo que esperan React Query y los Server Components, que
 * distinguen éxito de error por si la promesa resuelve o revienta.
 */
export interface HttpClient {
    /** Petición completa. Devuelve datos, `status` y `headers`. */
    request<TData>(request: HttpRequest): Promise<HttpResponse<TData>>;

    get<TData>(url: string, config?: HttpRequestConfig): Promise<TData>;

    post<TData>(
        url: string,
        body?: unknown,
        config?: HttpRequestConfig
    ): Promise<TData>;

    put<TData>(
        url: string,
        body?: unknown,
        config?: HttpRequestConfig
    ): Promise<TData>;

    patch<TData>(
        url: string,
        body?: unknown,
        config?: HttpRequestConfig
    ): Promise<TData>;

    delete<TData>(url: string, config?: HttpRequestConfig): Promise<TData>;
}
