"use client";

import * as React from "react";

import { useDebouncedValue } from "@/hooks";

import type { CategoryFilters } from "../interfaces";
import {
    DEFAULT_CATEGORY_STATUS_FILTER,
    getCategoryFiltersKey,
    toCategoryFilters,
    type CategoryStatusFilter,
} from "../libs";

/**
 * Filtros del listado de categorías. Guarda el texto del buscador y el estado
 * elegido, y los entrega listos para enviarse al backend. El texto se envía
 * con un pequeño retraso para no hacer una petición por cada tecla. El estado
 * se envía al momento porque se elige con un solo clic.
 */


export interface CategoryFiltersState {
    /** Texto del buscador tal como se está escribiendo. */
    query: string;
    setQuery: (value: string) => void;

    status: CategoryStatusFilter;
    setStatus: (value: CategoryStatusFilter) => void;

    /** Deja los filtros como al inicio. */
    clear: () => void;

    /**
     * Filtros que se envían al backend. Usan el texto con retraso y no el que
     * se está escribiendo, para no disparar una petición por cada tecla.
     */
    params: CategoryFilters;

    /** Cambia cuando cambian los filtros, para que la tabla vuelva a la primera página. */
    key: string;
}


export function useCategoryFilters(): CategoryFiltersState {
    const [query, setQuery] = React.useState("");
    const [status, setStatus] = React.useState<CategoryStatusFilter>(DEFAULT_CATEGORY_STATUS_FILTER);

    // El retraso va antes de armar los filtros, porque TanStack Query hace una
    // petición cada vez que cambia la clave y no trae retraso propio.
    const searchText = useDebouncedValue(query);

    const clear = () => {
        setQuery("");
        setStatus(DEFAULT_CATEGORY_STATUS_FILTER);
    };

    return {
        query,
        setQuery,
        status,
        setStatus,
        clear,
        params: toCategoryFilters(searchText, status),

        // Sale del texto con retraso. Si saliera del que se escribe, la tabla
        // volvería a la primera página con la búsqueda anterior y haría una
        // petición que nadie pidió.
        key: getCategoryFiltersKey(searchText, status),
    };
}
