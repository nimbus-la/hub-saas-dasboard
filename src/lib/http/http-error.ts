import type { HttpErrorKind, HttpErrorOptions, HttpMethod } from "@/interfaces";
import { messages } from "@/messages";
import { HTTP_ERROR_MESSAGE_KEYS, HTTP_RETRYABLE_STATUSES } from "@/utils";


/**
 * Error de transporte
 * 
 * Un único tipo de error para todo lo que puede salir mal al hablar con el
 * backend, sea cual sea la implementación del cliente. La interfaz de usuario
 * nunca ve un `TypeError: Failed to fetch` ni un `AxiosError`: ve un
 * `HttpError` con un `kind` que dice qué pasó.
 *
 * Esa clasificación no es cosmética: decide el comportamiento. Un `timeout`
 * merece reintento, un 422 no; un `aborted` ni siquiera debería pintar un
 * mensaje, porque lo provocó el propio usuario al cambiar de pantalla.
 */


export class HttpError extends Error {
    override readonly name = "HttpError";

    readonly kind: HttpErrorKind;
    readonly method: HttpMethod;

    /** URL final, ya con `baseUrl` y query string resueltos. */
    readonly url: string;

    /** Código HTTP, o `null` si nunca hubo respuesta. */
    readonly status: number | null;

    /** Cuerpo del error del backend. `unknown` a propósito: no es de fiar. */
    readonly body: unknown;

    constructor(options: HttpErrorOptions) {
        super(options.message, { cause: options.cause });

        this.kind = options.kind;
        this.method = options.method;
        this.url = options.url;
        this.status = options.status ?? null;
        this.body = options.body ?? null;
    }

    /** Sesión ausente o caducada. Normalmente lleva al login. */
    get isUnauthorized(): boolean {
        return this.status === 401;
    }

    /** Autenticado, pero sin permiso. No sirve reintentar ni volver a entrar. */
    get isForbidden(): boolean {
        return this.status === 403;
    }

    get isNotFound(): boolean {
        return this.status === 404;
    }

    /** El backend rechazó los datos del formulario. En `body` suele venir el detalle. */
    get isValidation(): boolean {
        return this.status === 400 || this.status === 422;
    }

    /** Fallo del servidor: no es culpa de quien lo usa, y suele valer reintentar. */
    get isServerError(): boolean {
        return this.status !== null && this.status >= 500;
    }

    /**
     * Envuelve cualquier excepción ajena para que nada escape del contrato.
     *
     * Se usa como red de seguridad: un fallo dentro de un interceptor, o un
     * error inesperado de la implementación concreta, también sale de aquí
     * como `HttpError`.
     */
    static fromUnknown(
        error: unknown,
        context: { method: HttpMethod; url: string }
    ): HttpError {
        if (error instanceof HttpError) return error;

        return new HttpError({
            kind: "network",
            message: error instanceof Error ? error.message : "Error de red desconocido",
            method: context.method,
            url: context.url,
            cause: error,
        });
    }
}

/** Estrecha un `unknown` de un `catch` a `HttpError`. */
export function isHttpError(value: unknown): value is HttpError {
    return value instanceof HttpError;
}

/**
 * ¿Vale la pena reintentar?
 *
 * Lo consume la política de reintentos de React Query
 * (`src/lib/query/query-client.ts`). La regla es simple: se reintenta lo que
 * puede resolverse solo con el tiempo, y nunca lo que va a fallar igual.
 *
 * · 408 y 504 son tiempos de espera del propio HTTP.
 * · 425 es "lo mandaste demasiado pronto", literalmente una invitación a repetir.
 * · 429 es límite de peticiones: se reintenta, pero con espera creciente.
 * · Un 422 se reintentaría idéntico y volvería a fallar idéntico.
 *
 * Los errores que no son `HttpError` devuelven `false` a propósito: casi
 * siempre son fallos de programación (un `undefined` en el `select` de una
 * query), y reintentarlos sólo los repite tres veces y retrasa el error real.
 */
export function isRetryableError(error: unknown): boolean {
    if (!isHttpError(error)) return false;

    if (error.kind === "network" || error.kind === "timeout") return true;
    if (error.kind !== "response") return false;

    return error.isServerError || HTTP_RETRYABLE_STATUSES.includes(error.status ?? 0);
}

/**
 * Mensaje presentable para el usuario.
 *
 * Prefiere lo que diga el backend —"Ya existe una categoría con ese nombre"
 * es infinitamente mejor que "Error 409"— y cae al texto de reserva cuando no
 * hay nada legible. Nunca devuelve el `message` técnico del `HttpError`, que
 * lleva método y URL dentro y no se le enseña a nadie.
 *
 * @param fallback Qué decir cuando el backend no explica nada.
 */
export function getApiErrorMessage(error: unknown, fallback: string): string {
    if (!isHttpError(error)) return fallback;

    if (error.kind === "network") return messages.errors.http.network;
    if (error.kind === "timeout") return messages.errors.http.timeout;

    const { body } = error;

    if (typeof body === "string" && body.trim().length > 0) return body;

    if (typeof body === "object" && body !== null) {
        const record = body as Record<string, unknown>;

        // El `messages` del sobre puede ser una lista. Se unen todas en una
        // frase en vez de quedarse con la primera: cuando el backend rechaza
        // un formulario suele mandar una por campo, y enseñar sólo una deja al
        // usuario corrigiendo de uno en uno.
        const listed = record["messages"];

        if (Array.isArray(listed)) {
            const texts = listed.filter(
                (item): item is string => typeof item === "string" && item.trim().length > 0
            );

            if (texts.length > 0) return texts.join(" ");
        }

        for (const key of HTTP_ERROR_MESSAGE_KEYS) {
            const value = record[key];

            if (typeof value === "string" && value.trim().length > 0) return value;
        }
    }

    return fallback;
}
