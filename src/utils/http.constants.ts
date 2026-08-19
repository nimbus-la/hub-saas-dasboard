/**
 * Constantes de la capa de datos.
 * 
 * Los número y literales que gobiernan cómo la aplicación habla con el 
 * backend, cuánto se espera, qué se reintenta y qué código significa
 * éxito.
 */


// ---- Transporte -----------------------------------------------------------------------

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


// ---- Sobre del backend ---------------------------------------------------------------------

/**
 * Código de resultado correcto.
 * 
 * La operación hizo lo que se le pidió y `data` trae lo que se esperaba.
 */
export const API_SUCCESS_CODE = "0000";


/**
 * La consulta salió bien y no hay nada que devolver.
 * 
 * El backend lo manda con `status: "INFO"`, `httpStatus: 200` y una página
 * vacía pero completa: `{ data: [], pageNumber, pageSize, total: 0 }`.
 * 
 * Tiene código propio —y no `0000`— porque para el backend "no hay resultados"
 * es una respuesta con matiz, no un éxito raso. Para la interfaz **no es un
 * fallo**: una búsqueda sin coincidencias es exactamente lo que el usuario
 * acaba de preguntar, contestado.
 */
export const API_EMPTY_RESULT_CODE = "0001";


/**
 * Los códigos que no son un fallo.
 * 
 * La frontera lanza ante cualquier otro, así que esta lista es lo que separa
 * "el backend contestó" de "el backend no pudo". Que sea una lista y no una
 * comparación con `0000` es lo que evita el fallo que estuvo un rato en
 * pantalla: al tratar el vacío como error, una búsqueda sin coincidencias tiraba
 * los datos que la tabla estaba enseñando y los sustituía por un aviso de avería
 * — cuando lo único que pasaba es que no había nada que enseñar.
 */
export const API_NON_FAILURE_CODES: readonly string[] = [
    API_SUCCESS_CODE,
    API_EMPTY_RESULT_CODE,
];


/** El único `httpStatus` cuyo `message` se le enseña al usuario. */
export const API_PRESENTABLE_STATUS = 200;