import { ApiEnvelope, ApiMeta } from "@/interfaces";
import { API_SUCCESS_CODE } from "@/utils";



/**
 * ¿Esto es un sobre?
 * 
 * Se comprueban `code` y la presencia de `data`, que son los dos campos de los
 * que dependen el desenvuelto. No exige `status` ni `message`, un sobre al que
 * le falte uno de esos sigue siendo desenvolvible.
 */
export function isApiEnvelope(value: unknown): value is ApiEnvelope {
    if (typeof value !== "object" || value === null) return false;

    const candidate = value as Record<string, unknown>;

    return typeof candidate["code"] === "string" && "data" in candidate;
}



/**
 * Saca la metadata del sobre. normalizando lo que falte.
 * 
 * Los valores por defecto existen para que `ApiMeta` sea un tipo sin campos
 * opcionales, quien lo consume lee `meta.message` y `meta.status` sin un solo
 * `?.` ni un `??`. Toda la incertidumbre sobre lo que manda el backend se
 * resuelve aquí, una vez, en la frontera.
 * 
 * `httpStatus` cae al de la respuesta real cuando el sobre no lo trae, porque
 * un `HttpError`sin `status` obligaria a comprobarlo antes de cada uso.
 */
export function toApiMeta(
    envelope: ApiEnvelope,
    fallbackHttpStatus: number
): ApiMeta {
    return {
        status: envelope.status ?? "ERROR",
        code: envelope.code,
        message: typeof envelope.message === "string" ? envelope.message : "",
        httpStatus:
            typeof envelope.httpStatus === "number"
                ? envelope.httpStatus
                : fallbackHttpStatus
    };
}



/** ¿El sobre dice que la operación salió bien? */
export function isSuccessCode(code: string): boolean {
    return code === API_SUCCESS_CODE;
}