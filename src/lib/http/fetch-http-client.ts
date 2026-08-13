import type {
    ErrorInterceptor,
    FetchHttpClientOptions,
    HttpClient,
    HttpMethod,
    HttpRequest,
    HttpRequestConfig,
    HttpResponse,
    QueryParams,
    RequestInterceptor,
    ResponseFormat,
} from "@/interfaces";
import { HTTP_DEFAULT_TIMEOUT_MS, HTTP_EMPTY_STATUSES } from "@/utils";

import { HttpError } from "./http-error";


/**
 * Cliente HTTP basado en `fetch`.
 * 
 * Cumple `HttpClient` usando el `fetch` de la plataforma. Es la única pieza de
 * la aplicación que conoce detalles de transporte: cabeceras, serialización,
 * códigos de estado y cancelación.
 * 
 * Por qué `fetch` y no axios: Next extiende `fetch` con su sistema de caché y
 * revalidación (`next: { tags }` + `revalidateTag`). Una petición hecha con
 * axios desde un Server Component queda fuera de eso. Si algún día hace falta
 * axios —por ejemplo para progreso de subida, que `fetch` no expone— se crea
 * un `AxiosHttpClient` que cumpla la misma interfaz y se registra en
 * `index.ts`; nada más cambia.
 * 
 * Lo que este cliente NO hace, a propósito:
 * 
 *   - Reintentar. La política de reintentos vive en React Query, que además
 *     sabe si la consulta sigue interesando. Reintentar en las dos capas
 *     multiplica los intentos (3 × 3 = 9) y nadie entiende de dónde salen.
 *   - Refrescar el token. Hacerlo bien exige encolar las peticiones que fallan
 *     en paralelo con 401 para no disparar N refrescos a la vez. Cuando exista
 *     autenticación, ese código va en `onRequest`/`onError` desde el módulo de
 *     sesión, no incrustado aquí.
 */


export class FetchHttpClient implements HttpClient {
    private readonly baseUrl: string;
    private readonly defaultHeaders: Record<string, string>;
    private readonly timeoutMs: number;
    private readonly credentials: RequestCredentials | undefined;
    private readonly onRequest: RequestInterceptor | undefined;
    private readonly onError: ErrorInterceptor | undefined;

    constructor(options: FetchHttpClientOptions = {}) {
        // La barra final se quita aquí para que `${baseUrl}${path}` nunca
        // produzca `//categories`, que algunos backends tratan como otra ruta.
        this.baseUrl = options.baseUrl?.replace(/\/+$/, "") ?? "";
        this.defaultHeaders = options.headers ?? {};
        this.timeoutMs = options.timeoutMs ?? HTTP_DEFAULT_TIMEOUT_MS;
        this.credentials = options.credentials;
        this.onRequest = options.onRequest;
        this.onError = options.onError;
    }

    // ── API pública ─────────────────────────────────────────────────────────

    public async request<TData>(input: HttpRequest): Promise<HttpResponse<TData>> {
        const resolved = this.onRequest ? await this.onRequest(input) : input;

        try {
            return await this.execute<TData>(resolved);

        } catch (error: unknown) {
            const httpError = HttpError.fromUnknown(error, {
                method: resolved.method,
                url: resolved.url,
            });

            // El interceptor observa, pero no puede impedir que el error llegue
            // a quien lo pidió: si él mismo falla, ese fallo no debe tapar el
            // error original.
            if (this.onError) {
                try {
                    await this.onError(httpError, resolved);
                } catch {
                    // Silencio deliberado: se propaga `httpError`, no éste.
                }
            }

            throw httpError;
        }
    }


    public async get<TData>(url: string, config?: HttpRequestConfig): Promise<TData> {
        const response = await this.request<TData>({ ...config, method: "GET", url });

        return response.data;
    }


    public async post<TData>(
        url: string,
        body?: unknown,
        config?: HttpRequestConfig
    ): Promise<TData> {
        const response = await this.request<TData>({
            ...config,
            method: "POST",
            url,
            body,
        });

        return response.data;
    }


    public async put<TData>(
        url: string,
        body?: unknown,
        config?: HttpRequestConfig
    ): Promise<TData> {
        const response = await this.request<TData>({
            ...config,
            method: "PUT",
            url,
            body,
        });

        return response.data;
    }


    public async patch<TData>(
        url: string,
        body?: unknown,
        config?: HttpRequestConfig
    ): Promise<TData> {
        const response = await this.request<TData>({
            ...config,
            method: "PATCH",
            url,
            body,
        });

        return response.data;
    }


    public async delete<TData>(url: string, config?: HttpRequestConfig): Promise<TData> {
        const response = await this.request<TData>({ ...config, method: "DELETE", url });

        return response.data;
    }


    // ── Interior ────────────────────────────────────────────────────────────

    private async execute<TData>(input: HttpRequest): Promise<HttpResponse<TData>> {
        const {
            method,
            url,
            body,
            params,
            headers,
            signal,
            timeoutMs,
            responseAs,
            ...init
        } = input;

        const target = this.buildUrl(url, params);
        const requestHeaders = this.buildHeaders(headers);
        const payload = resolveBody(body, requestHeaders);

        // El timeout y la cancelación del llamante se combinan: gana el que
        // dispare primero. Se guarda la referencia al de timeout para poder
        // distinguir después "tardó demasiado" de "el usuario se fue".
        const effectiveTimeout = timeoutMs ?? this.timeoutMs;
        const timeoutSignal =
            effectiveTimeout > 0 ? AbortSignal.timeout(effectiveTimeout) : null;
        const signals = [signal, timeoutSignal].filter(
            (candidate): candidate is AbortSignal => Boolean(candidate)
        );

        let response: Response;

        try {
            response = await fetch(target, {
                method,
                headers: requestHeaders,
                ...(payload !== undefined ? { body: payload } : {}),
                ...(signals.length > 0 ? { signal: AbortSignal.any(signals) } : {}),
                ...(this.credentials ? { credentials: this.credentials } : {}),
                // `cache`, `next` y un `credentials` propio de la llamada. Va al
                // final para que lo puntual gane sobre lo general.
                ...init,
            });
        } catch (error) {
            throw this.describeTransportFailure(error, {
                method,
                url: target,
                timeoutSignal,
                callerSignal: signal,
                effectiveTimeout,
            });
        }

        if (!response.ok) {
            // El cuerpo se lee igual, porque el detalle útil del fallo suele
            // venir ahí: qué campo del formulario rechazó y por qué.
            throw new HttpError({
                kind: "response",
                status: response.status,
                body: await readErrorBody(response),
                message: `${method} ${target} respondió ${response.status} ${response.statusText}`,
                method,
                url: target,
            });
        }

        return {
            data: await parseBody<TData>(response, responseAs, method, target),
            status: response.status,
            headers: response.headers,
        };
    }


    /**
     * Traduce el fallo de `fetch` a un `kind` concreto.
     *
     * `fetch` lanza el mismo `AbortError` tanto si venció el timeout como si
     * canceló el llamante, así que se pregunta a las señales cuál se disparó
     * en vez de intentar adivinarlo por el mensaje.
     */
    private describeTransportFailure(
        error: unknown,
        context: {
            method: HttpMethod;
            url: string;
            timeoutSignal: AbortSignal | null;
            callerSignal: AbortSignal | undefined;
            effectiveTimeout: number;
        }
    ): HttpError {
        const { method, url } = context;

        if (context.timeoutSignal?.aborted === true) {
            return new HttpError({
                kind: "timeout",
                message: `${method} ${url} superó los ${context.effectiveTimeout} ms`,
                method,
                url,
                cause: error,
            });
        }

        if (context.callerSignal?.aborted === true) {
            return new HttpError({
                kind: "aborted",
                message: `${method} ${url} fue cancelada`,
                method,
                url,
                cause: error,
            });
        }

        return new HttpError({
            kind: "network",
            message: `${method} ${url} no obtuvo respuesta del servidor`,
            method,
            url,
            cause: error,
        });
    }


    /** Une `baseUrl`, ruta y query string. Las URL absolutas pasan intactas. */
    private buildUrl(url: string, params?: QueryParams): string {
        const isAbsolute = /^[a-z][a-z\d+\-.]*:\/\//i.test(url);
        const path = isAbsolute
            ? url
            : `${this.baseUrl}${url.startsWith("/") ? url : `/${url}`}`;

        const search = serializeParams(params);

        if (search.length === 0) return path;

        return `${path}${path.includes("?") ? "&" : "?"}${search}`;
    }


    /**
     * Fusiona cabeceras por defecto y de la llamada.
     *
     * Se usa `Headers` y no un objeto plano porque normaliza mayúsculas: sin
     * eso, `Content-Type` de la llamada y `content-type` del cliente viajarían
     * las dos y el backend elegiría una al azar.
     */
    private buildHeaders(headers?: Record<string, string>): Headers {
        const merged = new Headers();

        for (const [key, value] of Object.entries(this.defaultHeaders)) {
            merged.set(key, value);
        }

        if (headers) {
            for (const [key, value] of Object.entries(headers)) {
                merged.set(key, value);
            }
        }

        return merged;
    }
}


// ── Auxiliares de serialización ─────────────────────────────────────────────

function serializeParams(params?: QueryParams): string {
    if (!params) return "";

    const search = new URLSearchParams();

    for (const [key, value] of Object.entries(params)) {
        if (value === undefined || value === null) continue;

        if (Array.isArray(value)) {
            for (const item of value) search.append(key, String(item));
            continue;
        }

        search.append(key, String(value));
    }

    return search.toString();
}


/**
 * Decide qué se manda como cuerpo y si hay que declarar el `Content-Type`.
 *
 * El caso que importa es `FormData`: la cabecera se deja **sin tocar** a
 * propósito, porque el navegador tiene que añadirle el `boundary` que separa
 * las partes. Ponerle `multipart/form-data` a mano produce un cuerpo que el
 * backend no sabe leer, y es el error clásico al subir una imagen de producto.
 */
function resolveBody(body: unknown, headers: Headers): BodyInit | undefined {
    if (body === undefined || body === null) return undefined;

    const isNativeBody =
        typeof body === "string" ||
        body instanceof FormData ||
        body instanceof URLSearchParams ||
        body instanceof Blob ||
        body instanceof ArrayBuffer;

    if (isNativeBody) return body as BodyInit;

    if (!headers.has("Content-Type")) {
        headers.set("Content-Type", "application/json");
    }

    return JSON.stringify(body);
}


/**
 * Lee el cuerpo de una respuesta correcta.
 *
 * Un `204` o un cuerpo vacío devuelven `null`: un `DELETE` que responde sin
 * contenido es un éxito, no un error de parseo.
 */
async function parseBody<TData>(
    response: Response,
    responseAs: ResponseFormat | undefined,
    method: HttpMethod,
    url: string
): Promise<TData> {
    const format = responseAs ?? "json";

    if (format === "blob") return (await response.blob()) as TData;
    if (format === "text") return (await response.text()) as TData;

    if (HTTP_EMPTY_STATUSES.includes(response.status)) return null as TData;

    const raw = await response.text();

    if (raw.trim().length === 0) return null as TData;

    try {
        return JSON.parse(raw) as TData;
    } catch (error) {
        throw new HttpError({
            kind: "parse",
            status: response.status,
            body: raw,
            message: `${method} ${url} devolvió un cuerpo que no es JSON válido`,
            method,
            url,
            cause: error,
        });
    }
}


/**
 * Lee el cuerpo de una respuesta de error sin lanzar nunca.
 *
 * Si el backend contesta un 500 con una página HTML de error, eso no debe
 * convertirse en un fallo de parseo que oculte el 500 de verdad.
 */
async function readErrorBody(response: Response): Promise<unknown> {
    try {
        const raw = await response.text();

        if (raw.trim().length === 0) return null;

        try {
            return JSON.parse(raw) as unknown;
        } catch {
            return raw;
        }
    } catch {
        return null;
    }
}
