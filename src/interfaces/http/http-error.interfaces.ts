import { ApiMeta } from "./api-envelope.interfaces";
import { HttpMethod } from "./http-core.interfaces";

/**
 * Qué falló.
 * 
 * - `response`: El servidor contestó con un error.
 * - `network`: Nunca hubo respuesta (DNS, CORS, sin conexión, servidor caído).
 * - `timeout`: Se agotó la espera.
 * - `aborted`: Lo canceló el llamante.
 * - `parse`: Respuesta correcta pero el cuerpo no es el formato esperado.
 */
export type HttpErrorKind = "response" | "network" | "timeout" | "aborted" | "parse";


export interface HttpErrorOptions {
    kind: HttpErrorKind;

    /** Descripción técnica para registros y trazas. */
    message: string;

    /** Verbo de la petición que fallo */
    method: HttpMethod;

    /** URL final, ya con `baseUrl` y query string resueltos. */
    url: string;

    /** Código HTTP */
    status?: number;

    /** Metadata del sobre, cuendo el fallo venía en uno */
    meta?: ApiMeta;

    /** Cuerpo del error tal como lo mando el servidor. */
    body?: unknown;

    cause?: unknown;
};