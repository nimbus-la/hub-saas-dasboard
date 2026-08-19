import { ErrorInterceptor, FetchHttpClientOptions, HttpMethod, HttpRequest, HttpResponse, QueryParams, RequestInterceptor, ResponseFormat } from "@/interfaces";
import { HTTP_DEFAULT_TIMEOUT_MS, HTTP_EMPTY_STATUSES } from "@/utils";

import { BaseHttpClient } from "./base-http-client";
import { HttpError } from "./http-error";


export class FetchHttpClient extends BaseHttpClient {
    private readonly baseUrl: string;
    private readonly defaultHeaders: Record<string, string>;
    private readonly timeoutMs: number;
    private readonly credentials: RequestCredentials | undefined;
    private readonly onRequest: RequestInterceptor | undefined;
    private readonly onError: ErrorInterceptor | undefined;


    constructor(options: FetchHttpClientOptions) {
        super();

        this.baseUrl = this.normalizeUrl(options.baseUrl);
        this.defaultHeaders = options.headers ?? {};
        this.timeoutMs = options.timeoutMs ?? HTTP_DEFAULT_TIMEOUT_MS;
        this.credentials = options.credentials;
        this.onRequest = options.onRequest;
        this.onError = options.onError;
    }


    override async request<TData>(request: HttpRequest): Promise<HttpResponse<TData>> {
        const resolved = this.onRequest ? await this.onRequest(request) : request;

        try {
            return await this.execute<TData>(resolved);

        } catch (error: unknown) {
            const httpError = HttpError.fromUnknown(error, {
                method: resolved.method,
                url: resolved.url
            });

            if (this.onError) {
                try {
                    await this.onError(httpError, resolved);
                } catch (error) {
                    // Se propaga 'httpError'
                }
            }

            throw httpError;
        }
    }


    private async execute<TData>(request: HttpRequest): Promise<HttpResponse<TData>> {
        const target = this.buildUrl(request.url, request.params);
        const headers = this.buildHeaders(request.headers);
        const payload = this.serializeBody(request.body, headers);

        const effectiveTimeout = request.timeoutMs ?? this.timeoutMs;
        const timeoutSignal = effectiveTimeout > 0 ? AbortSignal.timeout(effectiveTimeout) : null;

        const signal = [request.signal, timeoutSignal].filter(
            (candidate): candidate is AbortSignal => Boolean(candidate)
        );

        const credentials = request.credentials ?? this.credentials;

        let response: Response;

        try {
            response = await fetch(target, {
                method: request.method,
                headers,
                ...(payload !== undefined ? { body: payload } : {}),
                ...(signal.length > 0 ? { signal: AbortSignal.any(signal) } : {}),
                ...(credentials ? { credentials } : {}),
                ...(request.cache ? { cache: request.cache } : {}),
                ...(request.next ? { next: request.next } : {}),
            });
        } catch (error: unknown) {
            throw this.describeTransportFailure(error, {
                method: request.method,
                url: target,
                timeoutSignal,
                callerSignal: request.signal,
                effectiveTimeout
            });
        }

        if (!response.ok) {
            throw new HttpError({
                kind: "response",
                status: response.status,
                body: await this.readErrorBody(response),
                message: `${request.method} ${target} respondió ${response.status} ${response.statusText}`,
                method: request.method,
                url: target
            });
        }

        return {
            data: await this.parseBody<TData>(response, request.responseAs ?? "json", {
                method: request.method,
                url: target
            }),
            status: response.status,
            headers: response.headers,
        };
    }


    /**
     * Traduce el fallo de `fetch` a un `kind` concreto.
     *
     * Se pregunta a las señales cuál se disparó en vez de adivinarlo por el
     * mensaje de la excepción, que además cambia entre navegadores.
     */
    private describeTransportFailure(
        error: unknown,
        context: {
            method: HttpMethod,
            url: string,
            timeoutSignal: AbortSignal | null,
            callerSignal: AbortSignal | undefined,
            effectiveTimeout: number
        }
    ): HttpError {
        const { method, url } = context;

        if (context.timeoutSignal?.aborted === true) {
            return new HttpError({
                kind: "timeout",
                message: `${method} ${url} superó los ${context.effectiveTimeout} ms`,
                method,
                url,
                cause: error
            });
        }

        if (context.callerSignal?.aborted === true) {
            return new HttpError({
                kind: "aborted",
                message: `${method} ${url} fue cancelada`,
                method,
                url,
                cause: error
            });
        }

        return new HttpError({
            kind: "network",
            message: `${method} ${url} no obtuvo respuesta del servidor`,
            method,
            url,
            cause: error
        });
    }


    /**
     * Quita las barras finales del origen.
     * 
     * Se hace una vez al construir el cliente, no en cada peticion.
     * `${baseUrl}${path}` nunca debe producir `//categories`, algunos
     * backends tratan como otra ruta.
     */
    private normalizeUrl(baseUrl: string | undefined): string {
        return baseUrl?.replace(/\/+$/, "") ?? "";
    };


    /** Une `baseUrl`, ruta y query string. Las URL absolutas pasan intactas. */
    private buildUrl(url: string, params?: QueryParams): string {
        const isAbsolute = /^[a-z][a-z\d+\-.]*:\/\//i.test(url);

        const path = isAbsolute
            ? url
            : `${this.baseUrl}${url.startsWith("/") ? url : `/${url}`}`;

        const search = this.serializeParams(params);

        if (search.length === 0) return path;

        return `${path}${path.includes("?") ? "&" : "?"}${search}`;
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
    private serializeParams(params?: QueryParams): string {
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


    /** Decide que se manda como cuerpo y si hay que declarar el `Content-Type`. */
    private serializeBody(body: unknown, headers: Headers): BodyInit | undefined {
        if (body === undefined) return undefined;

        const isNativeBody =
            typeof body === "string" ||
            body instanceof FormData ||
            body instanceof URLSearchParams ||
            body instanceof Blob ||
            body instanceof ArrayBuffer;

        if (isNativeBody) return body as BodyInit;

        if (!headers.has("Content-Type")) {
            headers.set("Content-Type", "application/json");
        };

        return JSON.stringify(body);
    };


    /**
     * Lee el cuerpo de una respuesta correcta.
     * 
     * Se lee como texto y luego se parsea, en vez de llamar a `response.json()`
     * directamente, asi el cuerpo crudo sigue disponible para meterlo en el error
     * cuando el parseo falla. Con `.json()` la excepción llega sin el texto que lo
     * provocóy no hay forma de saber qué mandó el servidor.
     */
    private async parseBody<TData>(
        response: Response,
        format: ResponseFormat,
        context: { method: HttpMethod; url: string }
    ): Promise<TData> {
        if (format === "blob") return (await response.blob()) as TData;
        if (format === "text") return (await response.text()) as TData;

        if (HTTP_EMPTY_STATUSES.includes(response.status)) return null as TData;

        const raw = await response.text();

        if (raw.trim().length === 0) return null as TData;

        try {
            return JSON.parse(raw) as TData;

        } catch (error: unknown) {
            throw new HttpError({
                kind: "parse",
                status: response.status,
                body: raw,
                message: `${context.method} ${context.url} devolvió un cuerpo que no es JSON váliido`,
                method: context.method,
                url: context.url,
                cause: error
            });
        };
    };


    /** Lee el texto de una respuesta de error. */
    private async readErrorBody(response: Response): Promise<unknown> {
        try {
            const raw = await response.text();

            if (raw.trim().length === 0) return null;

            try {
                return JSON.parse(raw) as unknown;
            } catch {
                return raw;
            };
        } catch {
            return null;
        };
    };
}