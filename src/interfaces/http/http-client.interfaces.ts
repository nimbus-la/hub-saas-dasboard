import { HttpRequest, HttpRequestConfig, HttpResponse } from "./http-core.interfaces";


/**
 * Se ejecuta antes de cada petición y devuelve la petición a enviar.
 * 
 * Punto de entrada del id de correlación para trazas o de la sucursal activa.
 * Puede ser asíncrono.
 */
export type RequestInterceptor = (
    request: HttpRequest
) => HttpRequest | Promise<HttpRequest>;



/** Se ejecuta ante cualquier fallo, antes de que el error se propague. */
export type ErrorInterceptor = (
    error: unknown,
    request: HttpRequest
) => void | Promise<void>;



/**
 * Contrato del cliente HTTP
 * 
 * Las comunicación de la aplicación con el mundo exterior. Todo lo que hable con el 
 * backend depende de esta interfaz y nunca de una implementación concreta.
 * Cambiar `fetch` por axios es escribir una clase de cumpla con esto y registrarla
 * en `src/lib/http/index.ts`, sin tocar ni una patanlla.
 * 
 * Estos métodos lanzan ante cualquier fallo, incluido un 4xx, 5xx y un `code`
 * distinto de `"0000"`. Nadie comprueba `response.ok` en los componentes.
 */
export interface HttpClient {
    request<TData>(
        request: HttpRequest
    ): Promise<HttpResponse<TData>>;

    get<TData>(
        url: string,
        config?: HttpRequestConfig
    ): Promise<TData>;

    post<TData>(
        url: string,
        body?: unknown,
        config?: HttpRequestConfig
    ): Promise<TData>;

    put<TData>(
        url: string,
        body?: unknown,
        config?: HttpRequestConfig
    ): Promise<TData>;

    patch<TData>(
        url: string,
        body?: unknown,
        config?: HttpRequestConfig
    ): Promise<TData>;

    delete<TData>(
        url: string,
        config?: HttpRequestConfig
    ): Promise<TData>;
};