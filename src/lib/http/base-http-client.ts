import type { ApiEnvelope, HttpClient, HttpRequest, HttpRequestConfig, HttpResponse } from "@/interfaces";


/**
 * Los verbos, escritos una sola vez.
 *
 * Cada método arma la petición y devuelve el sobre entero, no su `content`: el
 * llamante necesita `code` y `message` para las alertas, y quien sólo quiera los
 * datos los saca con un destructuring de una línea.
 *
 * El `data` que se destructura de la respuesta es el cuerpo del transporte —lo
 * que viajó por el cable—, y ese cuerpo es el sobre completo. Se le pone nombre
 * `envelope` para que no se confunda con el `content` que va dentro.
 */
export abstract class BaseHttpClient implements HttpClient {
    public abstract request<TData>(request: HttpRequest): Promise<HttpResponse<TData>>;


    public async get<TContent>(url: string, config?: HttpRequestConfig): Promise<ApiEnvelope<TContent>> {
        const { data: envelope } = await this.request<ApiEnvelope<TContent>>({
            ...config,
            method: "GET",
            url
        });

        return envelope;
    }


    public async post<TContent>(
        url: string,
        body?: unknown,
        config?: HttpRequestConfig
    ): Promise<ApiEnvelope<TContent>> {
        const { data: envelope } = await this.request<ApiEnvelope<TContent>>({
            ...config,
            method: "POST",
            url,
            body
        });

        return envelope;
    }


    public async put<TContent>(
        url: string,
        body?: unknown,
        config?: HttpRequestConfig
    ): Promise<ApiEnvelope<TContent>> {
        const { data: envelope } = await this.request<ApiEnvelope<TContent>>({
            ...config,
            method: "PUT",
            url,
            body
        });

        return envelope;
    }


    public async patch<TContent>(
        url: string,
        body?: unknown,
        config?: HttpRequestConfig
    ): Promise<ApiEnvelope<TContent>> {
        const { data: envelope } = await this.request<ApiEnvelope<TContent>>({
            ...config,
            method: "PATCH",
            url,
            body
        });

        return envelope;
    }


    public async delete<TContent>(
        url: string,
        config?: HttpRequestConfig
    ): Promise<ApiEnvelope<TContent>> {
        const { data: envelope } = await this.request<ApiEnvelope<TContent>>({
            ...config,
            method: "DELETE",
            url,
        });

        return envelope;
    }
}
