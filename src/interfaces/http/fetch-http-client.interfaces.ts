import { ErrorInterceptor, RequestInterceptor } from "./http-client.interfaces";


/** Opciones de una implementación concreta. */
export interface FetchHttpClientOptions {
    /** Prefijo de toda ruta relativa. */
    baseUrl?: string;

    /** Cabeceras fijas de todas las peticiones. */
    headers?: Record<string, string>;

    /** Tiempo máximo por defecto, en ms. `0` lo desactiva. */
    timeoutMs?: number;

    /** Envío de cookies por defecto. */
    credentials?: RequestCredentials;

    onRequest?: RequestInterceptor;

    onError?: ErrorInterceptor;
};