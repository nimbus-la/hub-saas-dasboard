/**
 * Paginación — el vocabulario compartido
 *
 * Dos tipos y una regla: quién pide una página (`PaginationParams`, lo que
 * viaja al backend) y quién la recuerda (`PaginationState`, lo que devuelve
 * `usePagination`).
 *
 * Están juntos y fuera de los dos porque son el punto donde se encuentran: el
 * hook produce exactamente lo que el servicio consume. Si cada lado declarara
 * su propia forma, renombrar `pageNumber` en el backend compilaría igual y la
 * petición saldría sin página.
 */


/**
 * Lo que se le pide al backend.
 *
 * Los nombres son los suyos —`pageNumber`, `pageSize`— y no `page`/`limit`: se
 * escriben tal cual en la query string, así que traducirlos aquí solo añadiría
 * un mapeo más que mantener.
 */
export interface PaginationParams {
    /** Página pedida. Empieza en 1, no en 0: es la que se ve en pantalla. */
    pageNumber: number;

    /** Cuántos elementos caben en una página. */
    pageSize: number;
}


export interface UsePaginationOptions {
    /**
     * Tamaño de página del primer render.
     *
     * Es un valor inicial y no uno controlado: a partir de ahí manda el
     * selector del pie. Tiene que coincidir con el que use la precarga del
     * servidor, o la primera consulta del navegador pedirá una página distinta
     * a la que ya está en caché y la precarga se desperdicia.
     */
    initialPageSize?: number;
}


/**
 * Estado de la paginación, listo para las dos cosas que hacen falta con él:
 * pedir la página (`params`) y pintar el pie (`pageNumber`, `pageSize` y los
 * manejadores).
 */
export interface PaginationState extends PaginationParams {
    /**
     * Los mismos dos números, agrupados y con identidad estable entre renders.
     *
     * Existe para pasárselo de una pieza al servicio y a la clave de caché sin
     * construir un objeto nuevo en cada render, que es lo que dispararía otra
     * vez cualquier `useMemo` o `useEffect` que dependa de ellos.
     */
    params: PaginationParams;

    /** Ir a una página concreta. Nunca baja de la primera. */
    goToPage: (page: number) => void;

    /** Cambiar el tamaño de página. Devuelve a la primera. */
    changePageSize: (pageSize: number) => void;

    /** Volver a la primera página. Para cuando cambia un filtro. */
    reset: () => void;
}
