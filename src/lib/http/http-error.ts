import { ApiMeta, HttpErrorKind, HttpErrorOptions, HttpMethod } from "@/interfaces";


/**
 * El único error que ve la aplicación
 * 
 * Todo lo que puede salir mal al hablar con el backend, sea cual sea la
 * implementación del cliente. La interfaz nunca ve un `TypeError: Failed to
 * fetch` ni un `AxiosError`; ve un `HttpErro` con un `kind` que dice qué pasó
 * y, si el fallo venía en sobre, un `meta` que dice cómo comunicarlo.
 */
export class HttpError extends Error {
    public readonly kind: HttpErrorKind;
    public readonly method: HttpMethod;
    public readonly url: string;
    public readonly status: number | null; 
    public readonly meta: ApiMeta | null;
    public readonly body: unknown;

    constructor(options: HttpErrorOptions) {
        super(options.message, { cause: options.cause });

        this.kind = options.kind;
        this.method = options.method;
        this.url = options.url;
        this.status = options.status ?? null;
        this.meta = options.meta ?? null;
        this.body = options.body ?? null;
    }


    /** Código de negocio del backend `1923`, o null si no vino en sobre. */
    public get code(): string | null {
        return this.meta?.code ?? null;
    }


    /** 
     * Los estados se consultan por `meta.httpStatus`cuando existe y por
     * `status` cuando no.
     */
    private get effectiveStatus(): number | null {
        return this.meta?.httpStatus ?? this.status;
    }


    /** Sesión ausente o caducada */
    public get isUnauthorized(): boolean {
        return this.effectiveStatus === 401;
    }


    /** Autenticado pero sin permiso. */
    public get isForbidden(): boolean {
        return this.effectiveStatus === 403;
    }


    public get isNotFound(): boolean {
        return this.effectiveStatus === 404;
    }


    /** El backend rechazó los datos del formulario. */
    public get isValidation(): boolean {
        return this.effectiveStatus === 400 || this.effectiveStatus === 422;
    }


    /** Fallo del servidor. */
    public get isServerError(): boolean {
        const status = this.effectiveStatus;

        return status !== null && status >= 500;
    }


    /**
     * Copia este error añadiéndole la metadata del sobre.
     * 
     * Existe para que `EnvelopeHttpClient` pueda enriquecer un error que nació
     * en la capa de transporte, un 500 de verdad que traía un sobre dentro sin
     * que `FetchHttpClient`tenga que saber qué es un sobre.
     * 
     * Devuelve uno nuevo en vez de mutar porque los campos son `readonly` y
     * porque un error que cambia de contenido mientras sube por las capas es
     * imposible de razonar.
     */
    public withMeta(meta: ApiMeta): HttpError {
        return new HttpError({
            kind: this.kind,
            message: this.message,
            method: this.method,
            url: this.url,
            meta,
            ...(this.status !== null ? { status: this.status } : {}),
            body: this.body,
            cause: this.cause
        });
    }
}