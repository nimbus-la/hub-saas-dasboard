import type { ApiEnvelope, HttpClient, HttpRequest, HttpRequestConfig, HttpResponse } from "@/interfaces";


export abstract class BaseHttpClient implements HttpClient {
    public abstract request<TData>(request: HttpRequest): Promise<HttpResponse<TData>>;


    public async get<TData>(url: string, config?: HttpRequestConfig): Promise<ApiEnvelope<TData>> {
        const { data } = await this.request<ApiEnvelope<TData>>({
            ...config,
            method: "GET",
            url
        });

        return data;
    }


    public async post<TData>(
        url: string,
        body?: unknown,
        config?: HttpRequestConfig
    ): Promise<ApiEnvelope<TData>> {
        const { data } = await this.request<ApiEnvelope<TData>>({
            ...config,
            method: "POST",
            url,
            body
        });

        return data;
    }


    public async put<TData>(
        url: string,
        body?: unknown,
        config?: HttpRequestConfig
    ): Promise<ApiEnvelope<TData>> {
        const { data } = await this.request<ApiEnvelope<TData>>({
            ...config,
            method: "PUT",
            url,
            body
        });

        return data;
    }


    public async patch<TData>(
        url: string,
        body?: unknown,
        config?: HttpRequestConfig
    ): Promise<ApiEnvelope<TData>> {
        const { data } = await this.request<ApiEnvelope<TData>>({
            ...config,
            method: "PATCH",
            url,
            body
        });

        return data;
    }


    public async delete<TData>(
        url: string,
        config?: HttpRequestConfig
    ): Promise<ApiEnvelope<TData>> {
        const { data } = await this.request<ApiEnvelope<TData>>({
            ...config,
            method: "PUT",
            url,
        });

        return data;
    }
}