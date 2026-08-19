import { ErrorInterceptor, RequestInterceptor } from "./http.interfaces";



/** 
 * Opciones de una implementación concreta. 
 * 
 * A diferencia de `http.interfaces.ts`, que describe el contrato que cumple
 * cualquier cliente, esto desbrime cómo se configura `FetchHttpClient`.
 */
export interface FetchHttpClientOptions {
    /** 
     * Prefijo de toda ruta relativa.
     * 
     * Vacío significa "mismo origen", útil para pegarle a los Route Handlers del
     * propio Next. Si se pasa con barra final el cliente la quita:
     * `${baseUrl}${path}` nunca debe producir `//categories`.
     */
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