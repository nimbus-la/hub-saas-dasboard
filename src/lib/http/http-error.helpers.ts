import { AlertTone } from "@/interfaces";
import { messages } from "@/messages";
import { API_FALLBACK_TONE, API_STATUS_TONE, HTTP_ERROR_MESSAGE_KEYS, HTTP_RETRYABLE_STATUSES } from "@/utils";
import { HttpError } from "./http-error";


/** Estrecha un `unknown` de un `catch` a `HttpError` */
export function isHttpError(value: unknown): value is HttpError {
    return value instanceof HttpError;
}



export function isRetryableError(error: unknown): boolean {
    if (!isHttpError(error)) return false;

    if (error.kind === "network" || error.kind === "timeout") return true;
    if (error.kind !== "response") return false;

    return (
        error.isServerError ||
        HTTP_RETRYABLE_STATUSES.includes(error.meta?.httpStatus ?? error.status ?? 0)
    );
}



export function shouldNotifyError(error: unknown): boolean {
    if (!isHttpError(error)) return true;

    return error.kind !== "aborted";
}



/** Mesaje presentable para el usuario. */
export function getApiErrorMessage(error: unknown, fallback: string): string {
    if (!isHttpError(error)) return fallback;

    const envelopeMessage = error.meta?.message.trim();

    if (envelopeMessage) return envelopeMessage;

    if (error.kind === "network") return messages.errors.http.network;
    if (error.kind === "timeout") return messages.errors.http.timeout;

    const { body } = error;

    if (typeof body === "string" && body.trim().length > 0) return body;

    if (typeof body === "object" && body !== null) {
        const record = body as Record<string, unknown>;

        for (const key of HTTP_ERROR_MESSAGE_KEYS) {
            const value = record[key];

            if (typeof value === "string" && value.trim().length > 0) return value;
        }
    }

    return fallback;
}



/** Tono del aviso. */
export function getApiErrorTone(error: unknown): AlertTone {
    if (!isHttpError(error) || error.meta === null) return API_FALLBACK_TONE;

    return API_STATUS_TONE[error.meta.status];
}