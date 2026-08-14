import { ErrorInterceptor, FetchHttpClientOptions, HttpMethod, HttpRequest, HttpResponse, RequestInterceptor } from "@/interfaces";
import { BaseHttpClient } from "./base-http-client";
import { buildRequestUrl, normalizeUrl } from "./url-http";
import { HTTP_DEFAULT_TIMEOUT_MS } from "@/utils";
import { HttpError } from "./http-error";
import { parseResponseBody, readErrorBody, resolveRequestBody } from "./body-http";

export class FetchHttpClient extends BaseHttpClient {
    private readonly baseUrl: string;
    private readonly defaultHeaders: Record<string, string>;
    private readonly timeoutMs: number;
    private readonly credentials: RequestCredentials | undefined;
    private readonly onRequest: RequestInterceptor | undefined;
    private readonly onError: ErrorInterceptor | undefined;


    constructor(options: FetchHttpClientOptions) {
        super();

        this.baseUrl = normalizeUrl(options.baseUrl);
        this.defaultHeaders = options.headers ?? { };
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
        const target = buildRequestUrl(this.baseUrl, request.url, request.params);
        const headers = this.buildHeaders(request.headers);
        const payload = resolveRequestBody(request.body, headers);

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
                body: await readErrorBody(response),
                message: `${request.method} ${target} respondió ${response.status} ${response.statusText}`,
                method: request.method,
                url: target
            });
        }

        return {
            data: await parseResponseBody<TData>(response, request.responseAs ?? "json", {
                method: request.method,
                url: target
            }),
            status: response.status,
            headers: response.headers,
            meta: null
        };
    }


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