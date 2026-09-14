import { ApiEnvelope, ApiErrorFields } from "@/interfaces";

/**
 * ¿Esto es un sobre?
 * 
 * Se comprueban `code` y la presencia de `content`, que son los dos campos de
 * los que dependen el desenvuelto. No exige `status` ni `message`, un sobre al
 * que le falte uno de esos sigue siendo desenvolvible.
 *
 * Se pregunta por la presencia de la clave y no por su valor porque `content`
 * llega a `null` en las operaciones que no devuelven cuerpo —un borrado, un
 * alta— y eso sigue siendo un sobre válido.
 */
export function isApiEnvelope(value: unknown): value is ApiEnvelope {
    if (typeof value !== "object" || value === null) return false;

    const candidate = value as Record<string, unknown>;

    return typeof candidate["code"] === "string" && "content" in candidate;
}



/**
 * Saca del sobre lo que sobrevive a un fallo, normalizando lo que falte.
 *
 * Los valores por defecto existen para que `ApiErrorFields` sea un tipo **sin
 * campos opcionales**: quien lo consume lee `api.apiMessage` sin un `?.` ni un
 * `??` de por medio. Toda la incertidumbre sobre lo que manda el backend se
 * resuelve aquí, una vez, en la frontera.
 *
 * `httpStatus` cae al real cuando el sobre no lo trae. Es el valor prudente:
 * hace que `hasStatusMismatch` dé `false` y evita inventar un desajuste que
 * nadie ha declarado.
 */
export function toApiErrorFields(envelope: ApiEnvelope, realStatus: number): ApiErrorFields {
    return {
        code: envelope.code,
        apiStatus: envelope.status ?? "ERROR",
        apiMessage: typeof envelope.message === "string" ? envelope.message : "",
        httpStatus: typeof envelope.httpStatus === "number" ? envelope.httpStatus : realStatus
    };
}