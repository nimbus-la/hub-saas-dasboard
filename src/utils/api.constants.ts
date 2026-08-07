/**
 * Constantes de la capa de datos
 *
 * Reúne los números y literales que gobiernan cómo la aplicación habla con el
 * backend: cuánto se espera, qué se reintenta y cuánto vive un dato en caché.
 * Estaban repartidos entre `src/lib/http` y `src/lib/query`, donde eran
 * invisibles: nadie sabía que existían hasta abrir el archivo, y ajustar el
 * comportamiento de la aplicación obligaba a recordar en cuál de ellos estaba
 * cada valor.
 *
 * Todo lo de aquí es un valor decidido por el equipo, no un dato del entorno.
 * La URL del backend no está en este archivo a propósito: sale de variables de
 * entorno y cambia entre desarrollo y producción, así que vive donde se
 * construye el cliente (`src/lib/http/index.ts`).
 *
 * Los nombres van con prefijo (`HTTP_`, `QUERY_`) porque salen al barril
 * `@/utils`, que es un espacio compartido con el resto de utilidades: un
 * `DEFAULT_TIMEOUT_MS` suelto ahí no diría de qué es el tiempo de espera.
 */



// ── Transporte HTTP ─────────────────────────────────────────────────────────

/**
 * Tiempo máximo por defecto de una petición, en milisegundos.
 *
 * Veinte segundos es holgado para una API de panel y suficientemente corto
 * para que un backend caído no deje la interfaz colgada. Los informes pesados
 * pueden pedir más con `timeoutMs` en la llamada concreta.
 *
 * `fetch` no tiene límite propio: sin esto, una petición contra un servidor
 * que no responde deja el spinner girando indefinidamente.
 */
export const HTTP_DEFAULT_TIMEOUT_MS = 20_000;


/**
 * Códigos de respuesta que por definición no traen cuerpo.
 *
 * Se comprueban antes de intentar parsear: un `DELETE` que contesta `204 No
 * Content` es un éxito, y tratar su cuerpo vacío como JSON inválido lo
 * convertiría en un error de parseo inventado.
 */
export const HTTP_EMPTY_STATUSES = [204, 205];


/**
 * Códigos de error que merecen otro intento.
 *
 * Los 5xx entran por su cuenta (ver `isRetryableError`); ésta es la lista de
 * los 4xx que, pese a ser errores del cliente, se resuelven repitiendo:
 *
 * · `408 Request Timeout` — el servidor se cansó de esperar la petición.
 * · `425 Too Early`       — literalmente "lo mandaste demasiado pronto".
 * · `429 Too Many Requests` — límite de peticiones; se repite, con espera mayor.
 *
 * El resto de 4xx no está aquí porque volvería a fallar idéntico: un `422` con
 * los mismos datos se rechaza las veces que haga falta.
 */
export const HTTP_RETRYABLE_STATUSES = [408, 425, 429];


/**
 * Código de resultado correcto del sobre de respuesta.
 *
 * Cualquier otro valor es un fallo, aunque la respuesta HTTP haya sido `200`.
 * Es una cadena porque los ceros a la izquierda son significativos: como número
 * sería `0` y dejaría de coincidir.
 */
export const API_SUCCESS_CODE = "0000";


/**
 * Claves donde los backends suelen poner el mensaje legible de un error.
 *
 * Se prueban en orden hasta encontrar una cadena con contenido. No hay un
 * estándar para esto, así que la lista es empírica: se amplía cuando aparezca
 * un backend que use otra.
 *
 * `messages` va primero porque es la del sobre de este backend, y en él puede
 * llegar como lista además de como texto suelto — ese caso lo resuelve aparte
 * `getApiErrorMessage`.
 */
export const HTTP_ERROR_MESSAGE_KEYS = [
    "messages",
    "message",
    "error",
    "detail",
    "title",
] as const;


/**
 * Mensajes de reserva para los fallos que el backend no puede explicar.
 *
 * Cuando no hubo respuesta no hay cuerpo del que sacar un texto, así que lo
 * pone la aplicación. Están redactados en términos de lo que le pasa a quien
 * lee —no "ERR_CONNECTION_REFUSED"— y sugieren la acción siguiente.
 */
export const HTTP_ERROR_COPY = {
    network: "No se pudo conectar con el servidor. Revisa tu conexión.",
    timeout: "El servidor tardó demasiado en responder. Vuelve a intentarlo.",
} as const;



// ── Caché de consultas ──────────────────────────────────────────────────────

/**
 * Cuánto tiempo un dato recién traído se considera fresco, en milisegundos.
 *
 * Con `0` —el valor por defecto de la librería— React Query vuelve a pedir el
 * dato en cuanto se monta otro componente que lo use, y en una aplicación
 * renderizada en el servidor eso significa repetir en el navegador todo lo que
 * el servidor ya trajo. Un minuto es un punto de partida sensato para un panel
 * de gestión.
 *
 * Los datos que cambian rápido (comandas, métricas del día) bajan este número
 * en su propio hook; no se toca aquí.
 */
export const QUERY_DEFAULT_STALE_TIME_MS = 60_000;


/** Cuánto sobrevive en memoria un dato que ya nadie está mirando. */
export const QUERY_DEFAULT_GC_TIME_MS = 5 * 60_000;


/** Reintentos de una consulta fallida, sin contar el intento original. */
export const QUERY_MAX_RETRIES = 2;


/**
 * Espera antes del primer reintento, en milisegundos.
 *
 * Se duplica en cada intento siguiente (1s, 2s, 4s…) hasta tocar
 * `QUERY_MAX_RETRY_DELAY_MS`. El crecimiento exponencial le da margen al
 * servidor a recuperarse en vez de rematarlo con reintentos inmediatos.
 */
export const QUERY_RETRY_BASE_DELAY_MS = 1_000;


/** Techo de la espera entre reintentos: crece exponencial, pero no sin límite. */
export const QUERY_MAX_RETRY_DELAY_MS = 15_000;
