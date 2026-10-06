import type { HttpClient, HttpRequest, HttpResponse } from "@/interfaces";
import { HttpError } from "./http-error";
import { BaseHttpClient } from "./base-http-client";

type RefreshAccessToken = () => Promise<string>;
type ClearSession = () => void;

/** Renueva una sesión caducada y repite una única vez la petición original. */
export class AuthHttpClient extends BaseHttpClient {
    public constructor(
        private readonly inner: HttpClient,
        private readonly refreshAccessToken: RefreshAccessToken,
        private readonly clearSession: ClearSession,
    ) {
        super();
    }

    public async request<TData>(request: HttpRequest): Promise<HttpResponse<TData>> {
        try {
            return await this.inner.request<TData>(request);
        } catch (error) {
            if (
                !(error instanceof HttpError) ||
                !error.isUnauthorized ||
                request.skipAuthRefresh ||
                request.authRetry
            ) {
                throw error;
            }

            try {
                const token = await this.refreshAccessToken();

                return await this.inner.request<TData>({
                    ...request,
                    authRetry: true,
                    headers: {
                        ...request.headers,
                        Authorization: `Bearer ${token}`,
                    },
                });
            } catch (refreshError) {
                this.clearSession();
                throw refreshError;
            }
        }
    }
}
