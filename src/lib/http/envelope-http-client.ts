import { HttpClient, HttpRequest, HttpResponse } from "@/interfaces";
import { BaseHttpClient } from "./base-http-client";
import { isApiEnvelope, isSuccessCode, toApiMeta } from "./api-envelope";
import { isHttpError } from "./http-error.helpers";
import { HttpError } from "./http-error";

export class EnvelopeHttpClient extends BaseHttpClient {
    constructor(private readonly inner: HttpClient) {
        super();
    }


    override async request<TData>(request: HttpRequest): Promise<HttpResponse<TData>> {
        let response: HttpResponse<unknown>;

        try {
            response = await this.inner.request<unknown>(request);

        } catch (error: unknown) {
            throw this.enrichWithEnvelope(error);
        }

        if (!isApiEnvelope(response.data)) {
            return { ...response, data: response.data as TData }
        }

        const envelope = response.data;
        const meta = toApiMeta(envelope, response.status)

        if (!isSuccessCode(meta.code)) {
            throw new HttpError({
                kind: "response",
                status: meta.httpStatus,
                meta,
                body: envelope,
                message: `${request.method} ${request.url} respondió con el código ${meta.code}`,
                method: request.method,
                url: request.url
            });
        }

        return {
            data: envelope.data as TData,
            status: response.status,
            headers: response.headers,
            meta
        }
    }


    private enrichWithEnvelope(error: unknown): unknown {
        if (!isHttpError(error) || error.meta !== null) return error;
        if (!isApiEnvelope(error.body)) return error;

        return error.withMeta(toApiMeta(error.body, error.status ?? 0));
    }
}