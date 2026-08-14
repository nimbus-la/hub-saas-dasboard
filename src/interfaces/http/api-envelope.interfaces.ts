/**
 * El sobre de respuesta del backend.
 * 
 * El backend nunca devuelve un objeto plano, lo envuelve junto 
 * a un estado, código y mensaje. 
 */


/**
 * Estado de la respuesta del backend.
 * 
 * El backend devuelve un estado de respuesta que puede ser:
 * - `SUCCESS`: La operación fue exitosa.
 * - `ERROR`: La operación falló.
 * - `WARNING`: La operación fue exitosa pero con advertencias.
 * - `INFO`: La operación fue exitosa pero con información adicional.
 * 
 * Sirve para que el frontend pueda manejar el tipo de respuesta y mostrar 
 * mensajes adecuados al usuario. No decide si la operación fue exitosa o 
 * no, eso lo decide el "code" de la respuesta.
 */
export type ApiEnvelopeStatus = 'SUCCESS' | 'ERROR' | 'WARNING' | 'INFO';



/**
 * Interfaz que define la estructura del sobre de respuesta del backend.
 * El backend nunca devuelve un objeto plano, lo envuelve junto a un 
 * estado, código y mensaje.
 */
export interface ApiEnvelope<TData = unknown> {
    /** Ver `ApiEnvelopeStatus` es lo que elige el tono de la alerta. */
    status: ApiEnvelopeStatus;

    /**
     * Código interno del sistema que indica el resultado de la operación. 
     * "0000" es el código de éxito, cualquier otro código indica un error 
     * o advertencia.
     */
    code: string;

    /** Código HTTP que el backend considera adecuado para la respuesta. */
    httpStatus: number;

    /** Texto ya redactado que describe la respuesta. */
    message: string;

    /** Datos de la respuesta. */
    data: TData;
};
