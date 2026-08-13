import { HttpMethod, ResponseFormat } from "@/interfaces";
import { HTTP_EMPTY_STATUSES } from "@/utils";

/** Decide que se manda como cuerpo y si hay que declarar el `Content-Type`. */
export function resolveRequestBody(body: unknown, headers: Headers): BodyInit | undefined {
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
export async function parseResponseBody<TData>(
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
        return error as TData;
        // TODO: Agregar httpError.
    };
};



/** Lee el texto de una respuesta de error. */
export async function readErrorBody(response: Response): Promise<unknown> {
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