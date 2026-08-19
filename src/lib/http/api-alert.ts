import { AlertTone, ApiAlert, ApiEnvelope, ApiEnvelopeStatus } from "@/interfaces";
import { isApiEnvelope } from "@/lib/http/envelope";
import { HttpError, isHttpError } from "@/lib/http/http-error";
import { messages } from "@/messages";
import { ALERT_TONE_BY_API_STATUS, API_PRESENTABLE_STATUS } from "@/utils";

export function resolveApiAlert(source: unknown): ApiAlert | null {
    if (isHttpError(source)) return fromError(source);

    if (isApiEnvelope(source)) return fromEnvelope(source);

    // Cualquier otra excepción.
    if (source instanceof Error) {
        return { tone: "error", message: messages.errors.unexpected };
    }

    return null;
}


/** El texto del aviso, cuando sólo hace falta el texto. */
export const getApiErrorMessage = (error: unknown): string =>
    resolveApiAlert(error)?.message ?? messages.errors.unexpected;


const toneOf = (status: ApiEnvelopeStatus): AlertTone =>
    ALERT_TONE_BY_API_STATUS[status] ?? "info";


function fromEnvelope(envelope: ApiEnvelope): ApiAlert | null {
    const message = envelope.message?.trim() ?? "";

    if (message.length === 0) return null;

    return { tone: toneOf(envelope.status), message };
}


function fromError(error: HttpError): ApiAlert | null {
    if (error.kind === "aborted") return null;

    // Sin respuesta no hubo sobre, el texto lo pone la aplicación
    if (error.kind === "network") {
        return { tone: "error", message: messages.errors.http.network };
    }

    if (error.kind === "timeout") {
        return { tone: "error", message: messages.errors.http.timeout };
    }

    const { api } = error;

    const isPresentable =
        api !== null &&
        api.httpStatus === API_PRESENTABLE_STATUS &&
        error.status === API_PRESENTABLE_STATUS &&
        api.apiMessage.trim().length > 0;

    if (!isPresentable) {
        return { tone: "error", message: messages.errors.unexpected };
    }

    return { tone: toneOf(api.apiStatus), message: api.apiMessage.trim() };
}