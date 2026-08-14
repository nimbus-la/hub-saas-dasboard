import { ApiEnvelope, ApiErrorFields, HttpClient, HttpRequest, HttpResponse } from "@/interfaces";
import { BaseHttpClient } from "./base-http-client";
import { HttpError, isHttpError } from "./http-error";
import { API_SUCCESS_CODE } from "@/utils";

export class EnvelopeHttpClient extends BaseHttpClient {
    constructor(private readonly inner: HttpClient) {
        super();
    }


    override async request<TData>(request: HttpRequest): Promise<HttpResponse<TData>> {
        let response: HttpResponse<unknown>;

        try {
            response = await this.inner.request<unknown>(request);

        } catch (error: unknown) {
            // Un 400 o un 500 de verdad también traen sobre. Se le adjuntan sus
            // campos aquí, y no en el transporte, porque el transporte no sabe
            // qué es un sobre y no debe aprenderlo.
            throw this.enrichError(error);
        }

        if (!isApiEnvelope(response.data)) {
            return { ...response, data: response.data as TData }
        }

        const envelope = response.data;

        if (envelope.code !== API_SUCCESS_CODE) {
            throw new HttpError({
                kind: "response",
                status: response.status,
                api: toApiErrorFields(envelope, response.status),
                body: envelope,
                message: `${request.method} ${request.url} respondió con el código ${envelope.code}`,
                method: request.method,
                url: request.url
            });
        }

        return {
            data: envelope.data as TData,
            status: response.status,
            headers: response.headers,
        }
    }


    private enrichError(error: unknown): unknown {
        if (!isHttpError(error) || error.api !== null) return error;
        if (!isApiEnvelope(error.body)) return error;

        return new HttpError({
            kind: error.kind,
            message: error.message,
            method: error.method,
            url: error.url,
            api: toApiErrorFields(error.body, error.status ?? 0),
            body: error.body,
            cause: error.cause,
            ...(error.status !== null ? { status: error.status } : {})
        });
    }
}



/**
 * ¿Esto es un sobre?
 * 
 * Se comprueban `code` y la presencia de `data`, que son los dos campos de los
 * que dependen el desenvuelto. No exige `status` ni `message`, un sobre al que
 * le falte uno de esos sigue siendo desenvolvible.
 */
function isApiEnvelope(value: unknown): value is ApiEnvelope {
    if (typeof value !== "object" || value === null) return false;

    const candidate = value as Record<string, unknown>;

    return typeof candidate["code"] === "string" && "data" in candidate;
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
function toApiErrorFields(envelope: ApiEnvelope, realStatus: number): ApiErrorFields {
    return {
        code: envelope.code,
        apiStatus: envelope.status ?? "ERROR",
        apiMessage: typeof envelope.message === "string" ? envelope.message : "",
        httpStatus: typeof envelope.httpStatus === "number" ? envelope.httpStatus : realStatus
    };
}