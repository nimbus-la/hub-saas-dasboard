import { AlertTone, ApiAlert, ApiEnvelope, ApiEnvelopeStatus } from "@/interfaces";
import { isApiEnvelope } from "@/lib/http/envelope";
import { HttpError, isHttpError } from "@/lib/http/http-error";
import { messages } from "@/messages";
import { ALERT_TONE_BY_API_STATUS, API_SILENT_CODES, HTTP_SILENT_STATUSES } from "@/utils";

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

    if (isSilentError(error)) return null;

    // Un 5xx suele traer el texto de una excepción interna, que al usuario no
    // le sirve de nada. Se queda en el error para quien revise el registro.
    const isServerFailure = (error.effectiveStatus ?? 0) >= 500;

    const { api } = error;
    const message = api?.apiMessage.trim() ?? "";

    if (api === null || isServerFailure || message.length === 0) {
        return { tone: "error", message: messages.errors.unexpected };
    }

    // Con cualquier otro estado, un 400 o un 404, el backend ya redactó el
    // motivo para el usuario y se enseña tal cual.
    return { tone: toneOf(api.apiStatus), message };
}


/**
 * ¿Este error se calla en toda la aplicación?
 *
 * Se exporta para que quien atrape un error a mano, por ejemplo un modal que
 * guarda, pueda saltarse el aviso con el mismo criterio que la caché.
 */
export function isSilentError(error: HttpError): boolean {
    if (error.code !== null && API_SILENT_CODES.includes(error.code)) return true;

    return error.effectiveStatus !== null && HTTP_SILENT_STATUSES.includes(error.effectiveStatus);
}
