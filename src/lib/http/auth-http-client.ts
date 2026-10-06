import type { HttpClient, HttpRequest, HttpResponse } from "@/interfaces";
import type { SessionManager } from "@/lib/auth/session-manager";
import { HttpError, isHttpError } from "./http-error";
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
        const sentWithToken = this.session.getAccessToken();

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

            // Si mientras esta petición viajaba otra ya renovó la sesión, basta
            // con repetirla con el token nuevo. Renovar otra vez rotaría la
            // cookie sin necesidad: pasa siempre al recargar, cuando la primera
            // consulta sale sin token y su 401 llega después de la renovación
            // programada. Si la renovación falla, el gestor ya decidió si cerrar
            // la sesión.
            const currentToken = this.session.getAccessToken();
            const token = currentToken && currentToken !== sentWithToken
                ? currentToken
                : await this.session.refreshAccessToken();

            try {
                return await this.inner.request<TData>({
                    ...request,
                    authRetry: true,
                    headers: {
                        ...request.headers,
                        Authorization: `Bearer ${token}`,
                    },
                });
            } catch (retryError) {
                // Un 401 con un token recién emitido sí significa que la sesión
                // no vale. Cualquier otro fallo es de la petición —un 422, un
                // 503— y cerrar la sesión por él sacaría al usuario sin motivo.
                if (isHttpError(retryError) && retryError.isUnauthorized) this.session.clearSession();

                throw retryError;
            }
        }
    }
}
