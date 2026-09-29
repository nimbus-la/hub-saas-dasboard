"use client";

import React from "react";

import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";

import { useHttpClient } from "@/context";
import { useDebouncedValue } from "@/hooks";
import type { InputSelectorOption } from "@/interfaces";
import { toCategoryOptions } from "../mappers";
import type { CategoryFilters } from "../interfaces";
import { ACTIVE_CATEGORY_FILTERS, categoriesInfiniteQueryOptions, createCategoriesService } from "../services";

/**
 * Categorías activas listas para el selector del alta de producto. Llegan en
 * tandas que se piden al desplazar la lista, y lo que se escribe se busca en
 * el backend: con solo unas tandas cargadas, filtrar en el navegador
 * escondería las categorías que aún no han llegado.
 *
 * Sin búsqueda pide lo mismo que `useCategoryTabs`, así que comparten caché.
 * Las dos claves cuelgan de `categoryKeys.lists()`, de modo que crear o editar
 * una categoría también refresca estas opciones.
 */


/** Lista vacía fija para que el selector no reciba un arreglo nuevo en cada render. */
const NO_OPTIONS: InputSelectorOption[] = [];


export function useCategoryOptions() {
    const http = useHttpClient();

    const service = React.useMemo(() => createCategoriesService(http), [http]);

    const [search, setSearch] = React.useState("");

    // El texto se envía con retraso para no hacer una petición por cada tecla.
    const searchText = useDebouncedValue(search).trim();

    // Sin texto se usa la constante tal cual: es la clave de la precarga del
    // servidor y la que comparten las pestañas del listado.
    const filters: CategoryFilters = searchText
        ? { ...ACTIVE_CATEGORY_FILTERS, text: searchText }
        : ACTIVE_CATEGORY_FILTERS;

    const query = useInfiniteQuery({
        ...categoriesInfiniteQueryOptions(service, filters),

        // La caché guarda las páginas tal como llegan y aquí solo se convierten
        // para el selector. Así la precarga del servidor sirve sin cambios.
        select: toCategoryOptions,

        // Deja las opciones anteriores mientras llega la búsqueda nueva. Sin
        // esto `isLoading` volvería a `true` en cada búsqueda y el campo, que
        // se bloquea mientras carga, perdería el foco a mitad de escribir.
        placeholderData: keepPreviousData,
    });

    // La misma regla que en `useProducts`: solo con la consulta en reposo, y
    // una tanda que falló no se reintenta sola al seguir desplazando.
    const canLoadMore = query.hasNextPage && query.fetchStatus === "idle" && !query.isFetchNextPageError;

    return {
        options: query.data ?? NO_OPTIONS,
        isLoading: query.isLoading,
        setSearch,
        canLoadMore,
        isFetchingNextPage: query.isFetchingNextPage,
        fetchNextPage: query.fetchNextPage,
    };
}
