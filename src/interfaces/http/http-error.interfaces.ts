import { ApiEnvelopeStatus } from "./api-envelope.interfaces";
import { HttpMethod } from "./http.interfaces";


/**
 * Contrato del error de transporte
 * 
 * Describe la forma de `HttpError`, el único error que la petición ve cuando
 * algo falla al hablar con el backend. Nadie debería atrapar un 
 * `TypeError: Failed to fetch`, un `AxiosError` ni un `DOMException`, todos
 * se traducen a esta forma antes de salir del cliente.
 */


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


/**
 * Campos del sobre que sobreviven a un fallo.
 * 
 * Se guardan siempre que el sobre llegue, se muestren o no. El `message` de
 * un 500 no se le enseña a nadie, pero es exactamente lo que hay que mirar
 * cuando alguien reporta que algo no funciona.
 */
export interface ApiErrorFields {
    /** Código de negocio del backend: "1923" */
    code: string;

    /** Estado declarado. */
    apiStatus: ApiEnvelopeStatus;

    /** Texto del backend. */
    apiMessage: string;

    /** El código HTTP que declara el sobre. */
    httpStatus: number;
}


/** Datos con los que se construye un HttpError. */
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
    api?: ApiErrorFields;

    /** Cuerpo del error tal como lo mando el servidor. */
    body?: unknown;

    cause?: unknown;
};