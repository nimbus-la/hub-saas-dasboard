"use client";

import React from "react";

import { keepPreviousData, useInfiniteQuery, type InfiniteData } from "@tanstack/react-query";

import { useHttpClient } from "@/context";
import { useDebouncedValue, useInfiniteScroll } from "@/hooks";
import type { ApiResponseWithPagination } from "@/interfaces";
import { ALL_CATEGORIES, type Product } from "@/lib/products";

import type { ProductFilters } from "../interfaces";
import { createProductsService, productsInfiniteQueryOptions } from "../services";

/**
 * Catálogo de productos con su búsqueda, su categoría y su scroll infinito.
 * Los filtros forman la clave de las páginas, por eso viven juntos aquí y no
 * en la pantalla.
 */


/** Lista vacía fija para cuando todavía no hay datos. */
const NO_PRODUCTS: Product[] = [];


type ProductPages = InfiniteData<ApiResponseWithPagination<Product[]>>;


/** Fuera del hook para que la consulta reciba siempre la misma función. */
const selectTotal = (data: ProductPages): number => data.pages[0]?.total ?? 0;


export function useProducts() {
    const http = useHttpClient();

    const service = React.useMemo(() => createProductsService(http), [http]);

    const [query, setQuery] = React.useState("");
    const [categoryId, setCategoryId] = React.useState<string>(ALL_CATEGORIES);

    // El texto se envía con retraso para no hacer una petición por cada tecla.
    const searchText = useDebouncedValue(query).trim();

    const filters: ProductFilters = {
        ...(searchText ? { text: searchText } : {}),
        ...(categoryId !== ALL_CATEGORIES ? { categoryId } : {}),
    };

    // Cambiar un filtro cambia la clave, así que la lista vuelve sola a la
    // primera página sin tener que reiniciar nada a mano.
    const list = useInfiniteQuery({
        ...productsInfiniteQueryOptions(service, filters),

        // Deja lo anterior en pantalla mientras llega el resultado del filtro nuevo.
        placeholderData: keepPreviousData,
    });

    // Solo se pide más con la consulta en reposo. `isFetchingNextPage` no basta:
    // un reintento en pausa (pestaña oculta, sin conexión) lo deja en `false`,
    // y pedir otra vez cancelaría ese reintento para empezar uno nuevo.
    //
    // Una página que falló tampoco se reintenta sola al seguir en el fondo: se
    // quedaría pidiendo en bucle. El aviso ya sale de la caché y el pie ofrece
    // el botón para volver a intentarlo.
    const canLoadMore = list.hasNextPage && list.fetchStatus === "idle" && !list.isFetchNextPageError;

    const sentinelRef = useInfiniteScroll<HTMLDivElement>({
        enabled: canLoadMore,
        onLoadMore: list.fetchNextPage,
    });

    // La cabecera muestra el total del catálogo, que no cambia al filtrar. Sale
    // de la primera página sin filtros, que es la misma que se precarga, así
    // que solo se pide aparte cuando ya hay un filtro puesto.
    const catalog = useInfiniteQuery({
        ...productsInfiniteQueryOptions(service),
        select: selectTotal,
    });

    const clear = () => {
        setQuery("");
        setCategoryId(ALL_CATEGORIES);
    };

    const data = list.data?.pages.flatMap((page) => page.rows);

    return {
        /** Productos cargados hasta ahora, de todas las páginas pedidas. */
        data: data && data.length > 0 ? data : NO_PRODUCTS,

        /** Productos que cumplen los filtros, en todas las páginas. */
        total: list.data?.pages[0]?.total ?? 0,

        /** Productos del catálogo completo, sin filtros. */
        catalogTotal: catalog.data ?? 0,

        query,
        setQuery,
        categoryId,
        setCategoryId,
        clear,

        /** Ref del centinela que dispara la siguiente página al entrar en pantalla. */
        sentinelRef,
        hasNextPage: list.hasNextPage,
        isFetchingNextPage: list.isFetchingNextPage,
        isFetchNextPageError: list.isFetchNextPageError,
        fetchNextPage: list.fetchNextPage,
    };
}
