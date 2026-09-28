"use client";

import React from "react";

import { useQuery } from "@tanstack/react-query";

import { useHttpClient } from "@/context";
import type { FilterTabItem } from "@/interfaces";
import { toCategoryTabs } from "../mappers";
import { ACTIVE_CATEGORIES_PARAMS, categoriesQueryOptions, createCategoriesService } from "../services";

/**
 * Categorías activas listas para las pestañas del listado de productos, con
 * cuántos productos tiene cada una. Pide lo mismo que `useCategoryOptions`,
 * así que las dos comparten la caché y solo cambia cómo se convierte.
 */


/** Lista vacía fija para que las pestañas no reciban un arreglo nuevo en cada render. */
const NO_TABS: FilterTabItem[] = [];


export function useCategoryTabs() {
    const http = useHttpClient();

    const service = React.useMemo(() => createCategoriesService(http), [http]);

    const query = useQuery({
        ...categoriesQueryOptions(service, ACTIVE_CATEGORIES_PARAMS),
        select: toCategoryTabs,
    });

    return {
        tabs: query.data ?? NO_TABS,
        isLoading: query.isLoading,
    };
}
