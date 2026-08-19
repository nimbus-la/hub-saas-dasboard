import { ApiEnvelopeStatus, ApiErrorFields, HttpErrorKind, HttpErrorOptions, HttpMethod } from "@/interfaces";
import { HTTP_RETRYABLE_STATUSES } from "@/utils";


/**
 * El único error que ve la aplicación
 * 
 * Todo lo que puede salir mal al hablar con el backend, sea cual sea la
 * implementación del cliente. La interfaz nunca ve un `TypeError: Failed to
 * fetch` ni un `AxiosError`; ve un `HttpError` con un `kind` que dice qué pasó.
 */
export class HttpError extends Error {
    public readonly kind: HttpErrorKind;
    public readonly method: HttpMethod;
    public readonly url: string;
    public readonly status: number | null;
    public readonly api: ApiErrorFields | null;
    public readonly body: unknown;

    constructor(options: HttpErrorOptions) {
        super(options.message, { cause: options.cause });

        this.kind = options.kind;
        this.method = options.method;
        this.url = options.url;
        this.status = options.status ?? null;
        this.api = options.api ?? null;
        this.body = options.body ?? null;
    }


    /** Código de negocio del backend `1923`, o null si no vino en sobre. */
    public get code(): string | null {
        return this.api?.code ?? null;
    }


    /** Estado declarado por el backend ("1923"), o null si no vino en el sobre. */
    public get apiStatus(): ApiEnvelopeStatus | null {
        return this.api?.apiStatus ?? null;
    }


    /** Texto crudo del backend. */
    public get apiMessage(): string | null {
        return this.api?.apiMessage ?? null;
    }


    /**
     * ¿El sobre y la respuesta real dicen códigos distintos?
     * 
     * Cuando esto es `true`, hay un desajuste entre lo que el backend cree que
     * respondió y lo que el navegador recibió de verdad (bug del backend).
     */
    public get hasStatusMismatch(): boolean {
        if (this.api === null || this.status === null) return false;

        return this.api.httpStatus !== this.status;
    }

    /** Sesión ausente o caducada */
    public get isUnauthorized(): boolean {
        return this.status === 401 || this.api?.httpStatus === 401;
    }


    /** Fallo del servidor. */
    public get isServerError(): boolean {
        return this.status !== null && this.status >= 500;
    }


    /** Envuelve cualquier excepción ajena para que nada escape del contrato. */
    public static fromUnknown(
        error: unknown,
        context: { method: HttpMethod; url: string }
    ): HttpError {
        if (error instanceof HttpError) return error;

        return new HttpError({
            kind: "network",
            message: error instanceof Error ? error.message : "Error de red desconocido",
            method: context.method,
            url: context.url,
            cause: error
        });
    }
}


/** Estrecha un `unknown` de un `catch` a HttpError */
export function isHttpError(value: unknown): value is HttpError {
    return value instanceof HttpError;
}


/**
 * Lo consume la política de reintentos de TanStack Query, se reintenta
 * lo que puede resolverse solo con el tiempo y nunca lo que va a fallar
 * igual, un 422 con los mismo datos se rechaza las veces que haga falta.
 */
export function isRetryableError(error: unknown): boolean {
    if (!isHttpError(error)) return false;

    if (error.kind === "network" || error.kind === "timeout") return true;
    if (error.kind !== "response") return false;

    return error.isServerError || HTTP_RETRYABLE_STATUSES.includes(error.status ?? 0);
}