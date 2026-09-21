"use client";

import React from "react";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { useHttpClient } from "@/context";
import { useClampedPage, useDebouncedValue, usePagination } from "@/hooks";
import type { ApiResponseWithPagination } from "@/interfaces";
import { ALL_CATEGORIES, type Product } from "@/lib/products";

import type { ProductFilters } from "../interfaces";
import { DEFAULT_PRODUCTS_PARAMS, createProductsService, productsQueryOptions } from "../services";

/**
 * Catálogo de productos con su búsqueda, su categoría y su paginación. Los
 * tres forman una sola petición al backend, por eso viven juntos aquí y no
 * en la pantalla.
 */


/** Lista vacía fija para cuando todavía no hay datos. */
const NO_PRODUCTS: Product[] = [];


/** Fuera del hook para que la consulta reciba siempre la misma función. */
const selectTotal = (page: ApiResponseWithPagination<Product[]>): number => page.total;


export function useProducts() {
    const http = useHttpClient();

    const service = React.useMemo(() => createProductsService(http), [http]);

    const [query, setQuery] = React.useState("");
    const [categoryId, setCategoryId] = React.useState<string>(ALL_CATEGORIES);

    // El texto se envía con retraso para no hacer una petición por cada tecla.
    const searchText = useDebouncedValue(query).trim();

    const filters: ProductFilters = {
        ...(searchText ? { text: searchText } : {}),
        ...(categoryId !== ALL_CATEGORIES ? { productCategoryId: categoryId } : {}),
    };

    // Al cambiar un filtro se vuelve a la primera página en el mismo render.
    const pagination = usePagination({
        initialPageSize: DEFAULT_PRODUCTS_PARAMS.pageSize,
        resetKey: `${searchText}|${categoryId}`,
    });

    const list = useQuery({
        ...productsQueryOptions(service, { ...pagination.params, ...filters }),

        // Deja la página anterior en pantalla mientras llega la nueva.
        placeholderData: keepPreviousData,
    });

    useClampedPage(pagination, list.data?.total);

    // La cabecera muestra el total del catálogo, que no cambia al filtrar. Sale
    // de la primera página sin filtros, que es la misma que se precarga, así
    // que solo se pide aparte cuando ya hay un filtro puesto.
    const catalog = useQuery({
        ...productsQueryOptions(service),
        select: selectTotal,
    });

    const clear = () => {
        setQuery("");
        setCategoryId(ALL_CATEGORIES);
    };

    return {
        /** Productos de la página actual. */
        data: list.data?.rows ?? NO_PRODUCTS,

        /** Productos que cumplen los filtros, en todas las páginas. */
        total: list.data?.total ?? 0,

        /** Productos del catálogo completo, sin filtros. */
        catalogTotal: catalog.data ?? 0,

        query,
        setQuery,
        categoryId,
        setCategoryId,
        clear,
        pagination,
    };
}
