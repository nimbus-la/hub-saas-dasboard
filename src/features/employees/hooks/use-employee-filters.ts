"use client";

/**
 * Filtros del listado de empleados
 *
 * Guarda lo que el usuario elige en la barra —el texto del buscador y el estado
 * del selector— y lo entrega traducido a lo que se le pide al backend.
 *
 * La distinción que hace todo el trabajo es entre esos dos planos:
 *
 *   · **Lo que se escribe** (`query`, `status`) — cambia en cada tecla y es lo
 *     que pintan los controles. Si se retrasara, el campo se sentiría roto.
 *   · **Lo que se pide** (`params`) — cambia cuando el usuario para de escribir.
 *     Es lo que entra en la clave de la consulta y, por tanto, lo que decide
 *     cuántas veces se llama al servidor.
 *
 * El estado del selector no pasa por el retraso: elegir "Inactivos" es una sola
 * acción deliberada, no una ráfaga de once. Retrasarla sólo añadiría una espera
 * que no evita ninguna petición.
 */

import * as React from "react";

import { useDebouncedValue } from "@/hooks";

import type { EmployeeFilters } from "../interfaces";
import {
    DEFAULT_EMPLOYEE_STATUS_FILTER,
    getEmployeeFiltersKey,
    toEmployeeFilters,
    type EmployeeStatusFilter,
} from "../libs";


export interface EmployeeFiltersState {
    /** Lo que hay escrito en el buscador, sin retraso: es lo que pinta el campo. */
    query: string;
    setQuery: (value: string) => void;

    status: EmployeeStatusFilter;
    setStatus: (value: EmployeeStatusFilter) => void;

    /** Deja la barra como estaba. */
    clear: () => void;

    /**
     * Lo que viaja al backend, ya con el texto reposado.
     *
     * Va aparte de `query` a propósito: entre la última tecla y este valor hay
     * una pausa, y confundirlos es lo que convierte una búsqueda en once
     * peticiones.
     */
    params: EmployeeFilters;

    /** Huella de `params`, para que la paginación sepa cuándo volver a la 1. */
    key: string;
}


export function useEmployeeFilters(): EmployeeFiltersState {
    const [query, setQuery] = React.useState<string>("");
    const [status, setStatus] = React.useState<EmployeeStatusFilter>(
        DEFAULT_EMPLOYEE_STATUS_FILTER
    );


    /**
     * Aquí es donde se corta el chorro de peticiones. Ver `useDebouncedValue`:
     * TanStack Query no trae debounce porque su disparador es la clave, así que
     * el retraso tiene que estar antes de que el texto llegue a formar parte de
     * ella.
     */
    const searchText = useDebouncedValue(query);


    const params = React.useMemo<EmployeeFilters>(
        () => toEmployeeFilters(searchText, status),
        [searchText, status]
    );


    const clear = React.useCallback(() => {
        setQuery("");
        setStatus(DEFAULT_EMPLOYEE_STATUS_FILTER);
    }, []);


    /**
     * La huella se compone del texto **ya reposado**, no del que se está
     * tecleando. Si saliera de `query`, la vuelta a la primera página ocurriría
     * en la primera tecla —cuando el listado todavía es el de antes— y provocaría
     * una petición de la página 1 con el texto viejo que nadie llegó a pedir.
     */
    const key = React.useMemo(
        () => getEmployeeFiltersKey(searchText, status),
        [searchText, status]
    );


    return {
        query,
        setQuery,
        status,
        setStatus,
        clear,
        params,
        key,
    };
}