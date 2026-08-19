"use client";

/**
 * Estado de paginación
 *
 * Quién es la página actual y cómo se cambia. No sabe qué se está paginando ni
 * de dónde salen los datos: recibe cero props del dominio y devuelve dos
 * números y tres manejadores. Por eso sirve igual para categorías, para ventas
 * o para cualquier listado que venga después.
 *
 * El reparto con las otras dos piezas de paginación es:
 *
 *   · `@/lib/pagination`  → las cuentas (cuántas páginas, acotar una página).
 *   · `usePagination`     → el estado y las reglas de cuándo cambia.
 *   · `<Pagination />`    → cómo se ve.
 *
 * Uso típico, con el listado paginado en el servidor:
 *
 *     const pagination = usePagination();
 *     const query = useQuery(listQueryOptions(pagination.params));
 *
 *     useClampedPage(pagination, query.data?.total);
 *
 * El orden importa y no es casual: la consulta necesita la página para pedirla
 * y el ajuste necesita el total para saber si esa página existe. Por eso el
 * ajuste es un hook aparte y no un argumento de `usePagination` — sería pedirle
 * un dato que en ese punto del render todavía no ha llegado.
 */

import * as React from "react";

import type {
    PaginationParams,
    PaginationState,
    UsePaginationOptions,
} from "@/interfaces";
import { DEFAULT_PAGE_SIZE, FIRST_PAGE, getTotalPages } from "@/lib/pagination";


export function usePagination({
    initialPageSize = DEFAULT_PAGE_SIZE,
}: UsePaginationOptions = {}): PaginationState {
    const [pageNumber, setPageNumber] = React.useState<number>(FIRST_PAGE);
    const [pageSize, setPageSize] = React.useState<number>(initialPageSize);


    /**
     * El tope de arriba no se comprueba aquí: quién es la última página lo sabe
     * el servidor, no este hook. De eso se encarga `useClampedPage`, que sí
     * tiene el total delante.
     */
    const goToPage = React.useCallback((page: number) => {
        setPageNumber(Math.max(page, FIRST_PAGE));
    }, []);


    /**
     * Cambiar el tamaño de página vuelve a la primera.
     *
     * La página 3 de 8 en 8 no contiene lo mismo que la página 3 de 24 en 24:
     * conservar el número mueve al usuario a un sitio de la colección que él no
     * ha pedido. Volver al principio es lo único que se puede prometer.
     */
    const changePageSize = React.useCallback((size: number) => {
        setPageSize(size);
        setPageNumber(FIRST_PAGE);
    }, []);


    /** Para cuando cambia un filtro: los resultados son otros y la página 4 de los anteriores no significa nada. */
    const reset = React.useCallback(() => {
        setPageNumber(FIRST_PAGE);
    }, []);


    const params = React.useMemo<PaginationParams>(
        () => ({ pageNumber, pageSize }),
        [pageNumber, pageSize]
    );


    // El objeto entero se memoiza porque las pantallas lo pasan como
    // dependencia de sus propios `useCallback` —un manejador que resetea la
    // página, por ejemplo—: uno nuevo en cada render los recrearía todos.
    return React.useMemo<PaginationState>(
        () => ({
            pageNumber,
            pageSize,
            params,
            goToPage,
            changePageSize,
            reset,
        }),
        [pageNumber, pageSize, params, goToPage, changePageSize, reset]
    );
}


/**
 * Devuelve la página al rango cuando la colección encoge.
 *
 * Estar en la página 7 y que el listado pase a tener 3 no es un caso raro: se
 * llega borrando el último elemento de la última página, aplicando un filtro
 * que deja cuatro resultados o subiendo el tamaño de página. En todos ellos el
 * servidor devuelve una página vacía, que se lee como "se perdieron mis datos".
 *
 * Se hace con un efecto y no durante el render porque el total llega **después**
 * de pedir la página: hasta que la respuesta no está, no hay forma de saber que
 * la página se salió de rango. Mientras el total sea `undefined` —primera carga,
 * o error— no se toca nada: corregir con un total que no se conoce mandaría a
 * todo el mundo a la primera página cada vez que la consulta falla.
 */
export function useClampedPage(
    pagination: PaginationState,
    total: number | undefined
): void {
    const { pageNumber, pageSize, goToPage } = pagination;

    React.useEffect(() => {
        if (total === undefined) return;

        const lastPage = getTotalPages(total, pageSize);

        if (pageNumber > lastPage) goToPage(lastPage);
    }, [total, pageNumber, pageSize, goToPage]);
}
