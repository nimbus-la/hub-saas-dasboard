/**
 * Constantes de la caché de estado de servidor
 *
 * Separadas de `http.constants` porque son otro motivo de cambio. Aquéllas
 * describen CÓMO se habla con el backend (cuánto se espera, qué se reintenta);
 * éstas, CUÁNDO (cuánto dura un dato antes de volver a pedirlo). Ajustar la
 * frescura de los datos no debería obligar a abrir el archivo de los timeouts.
 */


/**
 * Cuánto tiempo un dato recién traído se considera fresco, en milisegundos.
 *
 * Con `0` TanStack Query vuelve a pedir el dato en cuanto se monta otro 
 * componente que lo use, y en una aplicación renderizada en el servidor 
 * eso significa repetir en el navegador todo lo que el servidor ya trajo.
 *
 * Un minuto es un punto de partida sensato para un panel de gestión. Los datos
 * que cambian rápido (comandas, métricas del día) bajan este número en su propio
 * hook; no se toca aquí.
 */
export const QUERY_DEFAULT_STALE_TIME_MS = 60_000;


/**
 * Cuánto sobrevive en memoria un dato que ya nadie está mirando.
 *
 * Es lo que hace que volver a una pantalla que visitaste hace dos minutos pinte
 * al instante con lo que había, mientras se refresca por detrás. Cinco minutos
 * cubre el ir y venir normal por el panel sin retener memoria de más.
 */
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