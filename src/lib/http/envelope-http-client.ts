import { HttpClient, HttpRequest, HttpResponse } from "@/interfaces";
import { API_NON_FAILURE_CODES } from "@/utils";

import { BaseHttpClient } from "./base-http-client";
import { isApiEnvelope, toApiErrorFields } from "./envelope";
import { HttpError, isHttpError } from "./http-error";

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
            throw new HttpError({
                kind: "parse",
                status: response.status,
                body: response.data,
                message: `${request.method} ${request.url} respondió sin el sobre esperado`,
                method: request.method,
                url: request.url
            });
        }

        const envelope = response.data;

        // Se pregunta por la lista de códigos que **no** son un fallo, y no por
        // el de éxito: "no se encontraron resultados" llega con código propio,
        // HTTP 200 y una página vacía válida dentro. Tratarlo como error haría
        // perder unos datos que el backend sí mandó. Ver `API_NON_FAILURE_CODES`.
        if (!API_NON_FAILURE_CODES.includes(envelope.code)) {
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

        return { ...response, data: envelope as TData };
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