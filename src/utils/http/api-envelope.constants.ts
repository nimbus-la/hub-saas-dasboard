import { AlertTone, ApiEnvelopeStatus } from "@/interfaces";


/** Constantes del sobre.*/


/**
 * Código de resultado correcto.
 * 
 * Cualquier otro valor es un fallo, aunque la respuesta HTTP haya sido `200`.
 */
export const API_SUCCESS_CODE = "0000";



/** 
 * Del estado del backend al tono del aviso. 
 * 
 * Esta tabla es toda la traducción entre el protocolo y la interfaz.
 * Es un `Record` con las cuatro claves obligatorias, asi que si el backend
 * añade un `ApiEnvelopeStatus` nuevo esto deja de compilar hasta que se decida
 * que tono le toca.
 */
export const API_STATUS_TONE: Record<ApiEnvelopeStatus, AlertTone> = {
    SUCCESS: "success",
    ERROR: "error",
    WARNING: "warning",
    INFO: "info"
};



/**
 * Tono de reserva cuando no hay sobre del que leer el estado.
 * 
 * Se usa en los fallos de red y de tiempo donde no hubo respuesta,
 * así que no hay `ApiEnvelopeStatus`, pero el usuario tiene que
 * enterarse igual.
 */
export const API_FALLBACK_TONE: AlertTone = "error";