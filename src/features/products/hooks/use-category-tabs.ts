"use client";

import React from "react";

import { useInfiniteQuery } from "@tanstack/react-query";

import { useHttpClient } from "@/context";
import type { FilterTabItem } from "@/interfaces";
import { toCategoryTabs } from "../mappers";
import { ACTIVE_CATEGORY_FILTERS, categoriesInfiniteQueryOptions, createCategoriesService } from "../services";

/**
 * Categorías activas listas para las pestañas del listado de productos, con
 * cuántos productos tiene cada una. Llegan en tandas: la siguiente se pide
 * cuando el carril de pestañas se acerca a su final, igual que la rejilla de
 * productos. Sin búsqueda, `useCategoryOptions` pide lo mismo, así que los dos
 * comparten la caché y solo cambia cómo se convierte.
 */


/** Lista vacía fija para que las pestañas no reciban un arreglo nuevo en cada render. */
const NO_TABS: FilterTabItem[] = [];


export function useCategoryTabs() {
    const http = useHttpClient();

    const service = React.useMemo(() => createCategoriesService(http), [http]);

    const query = useInfiniteQuery({
        ...categoriesInfiniteQueryOptions(service, ACTIVE_CATEGORY_FILTERS),
        select: toCategoryTabs,
    });

    // La misma regla que en `useProducts`: solo con la consulta en reposo, y
    // una tanda que falló no se reintenta sola al seguir desplazando o el
    // carril pediría en bucle. El aviso del fallo ya lo da la caché.
    const canLoadMore = query.hasNextPage && query.fetchStatus === "idle" && !query.isFetchNextPageError;

    return {
        tabs: query.data ?? NO_TABS,
        isLoading: query.isLoading,
        canLoadMore,
        isFetchingNextPage: query.isFetchingNextPage,
        fetchNextPage: query.fetchNextPage,
    };
}
