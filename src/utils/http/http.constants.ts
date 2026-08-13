

/**
 * Tiempo máximo por defecto de una petición, en milisegundos.
 * 
 * Veinte segundos es holgado para una API de panel y corto para que un backend
 * caído no deje la interfaz colgada. Los informes pesados pide más con `timeoutMs`
 * en la llamada concreta.
 * 
 * `fetch` no tiene límite propio, sin esto, una petición contra un servidor que
 * no responde deje el "loader" indefinidamente.
 */
export const HTTP_DEFAULT_TIMEOUT_MS = 20_000;



/**
 * Códigos que por definición no traen cuerpo.
 * 
 * Se comprueban antes de parsear. Un `DELETE` que contesta `204 No Content` es
 * un éxito, y tratar su cuerpo vacío como JSON inválido lo convertiría en un
 * error de parseo inventado.
 */
export const HTTP_EMPTY_STATUSES: readonly number[] = [204, 205];



/**
 * Códigos de error que merecen otro intento.
 * 
 * Los 5xx entran por su cuenta (ver `isRetryableError`); está lista de
 * los 4xx que, pese a ser errores del cliente, se resuelve repitiendo:
 * 
 * - `408 Request Timeout`:     El servidor se canso de esperar la petición.
 * - `425 Too Early`:           Literalmente lo mandaste demasiado pronto.
 * - `429 Too Many Requests`:   Límite de peticiones; se repite, con más espera.
 */
export const HTTP_RETRYABLE_STATUSES: readonly number[] = [408, 425, 429];



/**
 * Claves donde otros backends suelen poner el mensaje legible.
 * 
 * Es la red de seguridad para cuando el fallo NO viene en sobre, un 502 
 * del balanceador, un servicio de terceros. Se prueban en orden hasta 
 * encontrar una cadena con contenido. No hay estándar para esto, así
 * que la lista es empírica y se amplía cuando aparezca un backend
 * que use otra.
 */
export const HTTP_ERROR_MESSAGE_KEYS: readonly string[] = [
    "message",
    "error",
    "detail",
    "title"
];