import type { HttpClient, HttpRequest, HttpResponse, SessionManager } from "@/interfaces";
import { isHttpError } from "./http-error";
import { BaseHttpClient } from "./base-http-client";


/** Renueva una sesión caducada y repite una única vez la petición original. */
export class AuthHttpClient extends BaseHttpClient {
    public constructor(
        private readonly inner: HttpClient,
        private readonly session: SessionManager,
    ) {
        super();
    }

    public async request<TData>(request: HttpRequest): Promise<HttpResponse<TData>> {
        try {
            return await this.inner.request<TData>(request);

        } catch (error: unknown) {
            if (
                !isHttpError(error) ||
                !error.isUnauthorized ||
                request.skipAuthRefresh ||
                request.authRetry
            ) {
                throw error;
            }

            // Si la renovación falla, el gestor ya decidió si cerrar la sesión.
            await this.session.refreshSession();

            try {
                return await this.inner.request<TData>({ ...request, authRetry: true });

            } catch (retryError) {
                // Un 401 con un token recién emitido sí significa que la sesión
                // no vale. Cualquier otro fallo es de la petición —un 422, un
                // 503— y cerrar la sesión por él sacaría al usuario sin motivo.
                if (isHttpError(retryError) && retryError.isUnauthorized) void this.session.expireSession();

                throw retryError;
            }
        }
    }
}
