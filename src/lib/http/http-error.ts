import { ApiEnvelopeStatus, ApiErrorFields, HttpErrorKind, HttpErrorOptions, HttpMethod } from "@/interfaces";
import { messages } from "@/messages";
import { API_PRESENTABLE_STATUS, HTTP_RETRYABLE_STATUSES } from "@/utils";


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


/**
 * El mensaje que se le enseña al usuario.
 *
 * El `message` del backend se muestra **sólo si los dos estados dicen 200**: el
 * real y el que declara el sobre. Con esa combinación, el backend está hablando
 * de una regla de negocio ("Ya existe una categoría con ese nombre") y redactó
 * el texto para que lo lea una persona.
 *
 * Cualquier otra cosa cae al genérico:
 *
 * · Un `400`/`422` es una **validación del servidor** —falta un campo, un tipo
 *   no cuadra—, lo que significa que el front mandó mal la petición. El usuario
 *   no puede arreglarlo y enseñárselo sólo le confunde.
 * · Un `500` es una excepción interna: su texto suele ser técnico y además
 *   filtraría detalles del backend a cualquiera que mire la pantalla.
 * · Sin respuesta no hay `message` que leer, así que lo pone la aplicación.
 *
 * ¿Por qué se exigen los dos y no sólo el del sobre?
 *
 * Porque se ha visto al backend declarar un `httpStatus` distinto del que
 * termina recibiendo el navegador. Exigir que coincidan no bloquea ningún caso
 * legítimo —cuando es 200 siempre coinciden— y cierra el escenario feo: un 500
 * real cuyo sobre dice `200` acabaría enseñando el texto de una excepción
 * interna. Con la doble condición cae al genérico solo, y `hasStatusMismatch`
 * deja el desajuste marcado para los registros.
 *
 * **Nunca** devuelve `error.message`, que lleva método y URL dentro y no se le
 * enseña a nadie.
 */
export function getApiErrorMessage(error: unknown): string {
    if (!isHttpError(error)) return messages.errors.unexpected;


    // Sin respuesta no hubo sobre, el texto lo pone la aplicación
    if (error.kind === "network") return messages.errors.http.network;
    if (error.kind === "timeout") return messages.errors.http.timeout;

    const { api } = error;

    if (api === null) return messages.errors.unexpected;

    const isPresentable =
        api.httpStatus === API_PRESENTABLE_STATUS &&
        error.status === API_PRESENTABLE_STATUS;

    if (isPresentable && api.apiMessage.trim().length > 0) return api.apiMessage;

    return messages.errors.unexpected;
}