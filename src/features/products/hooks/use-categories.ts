"use client";

import React from "react";

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useHttpClient } from "@/context";
import { useClampedPage, usePagination } from "@/hooks";
import { CategoriesService, CategoryList, CreateCategoryParams, UpdateCategoryParams } from "../interfaces";
import { DEFAULT_CATEGORIES_PAGINATION, categoriesQueryOptions, categoryKeys, createCategoriesService } from "../services";
import { useCategoryFilters } from "./use-category-filters";


/**
 * Listado de categorías: filtrado y paginado por el backend, con su alta y su
 * edición.
 *
 * Los filtros y la paginación viven **dentro** del hook y no en la pantalla a
 * propósito: los tres —texto, estado y página— forman una sola pregunta al
 * servidor, y repartirlos abre la ventana en la que la tabla enseña una
 * respuesta y los controles describen otra. La pantalla recibe `filters` y
 * `pagination` ya montados y sólo los enchufa a la barra y al pie.
 *
 * El orden de los pasos es el que impone la dependencia entre ellos, y no se
 * puede barajar:
 *
 *   1. Los filtros, que además publican su huella (`filters.key`).
 *   2. La página, que vuelve a la 1 en cuanto esa huella cambia.
 *   3. La consulta, que necesita las dos cosas para saber qué pedir.
 *   4. El ajuste de la página, que necesita el `total` que devuelve la consulta.
 */


/**
 * La lista vacía es una constante y no un `[]` literal.
 *
 * Se devuelve mientras no hay datos, y un array nuevo en cada render rompería la
 * igualdad por referencia de todo lo que la reciba: los `useCallback` de la
 * pantalla y el modelo de filas de la tabla se recrearían sin que hubiera
 * cambiado nada.
 */
const NO_CATEGORIES: CategoryList[] = [];


export function useProductsCategories() {
    const http = useHttpClient();
    const queryClient = useQueryClient();


    const service = React.useMemo<CategoriesService>(
        () => createCategoriesService(http),
        [http]
    );


    const filters = useCategoryFilters();


    /*
     * `resetKey` es lo que evita quedarse en la página 4 de un resultado que
     * ahora tiene una sola. Se pasa la huella de los filtros y no un efecto que
     * llame a `pagination.reset()`: el hook la compara durante el render, así
     * que la vuelta a la página 1 y el cambio de filtro entran en la **misma**
     * consulta en lugar de en dos. Ver `usePagination`.
     */
    const pagination = usePagination({
        initialPageSize: DEFAULT_CATEGORIES_PAGINATION.pageSize,
        resetKey: filters.key,
    });


    const query = useQuery({
        ...categoriesQueryOptions(http, { ...pagination.params, ...filters.params }),

        /*
         * Al cambiar de página se mantiene en pantalla lo anterior mientras
         * llega lo nuevo.
         *
         * Sin esto, cada clic en el pie vacía la tabla y la vuelve a llenar: la
         * altura del bloque salta y el estado vacío —"todavía no hay
         * categorías"— aparece durante un instante diciendo algo que es falso.
         */
        placeholderData: keepPreviousData,
    });


    // La última página puede desaparecer bajo los pies: al borrar el único
    // elemento que quedaba en ella, o al subir el tamaño de página.
    useClampedPage(pagination, query.data?.total);


    /**
     * Se invalidan **todas** las páginas del listado, no sólo la actual.
     *
     * Crear una categoría reordena la colección entera: lo que estaba en la
     * página 2 pasa a la 3. Refrescar sólo la que se está viendo dejaría a las
     * demás en caché con datos que ya no son.
     */
    const invalidate = () =>
        queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });


    const createCategory = useMutation({
        mutationFn: (params: CreateCategoryParams) => service.create(params),
        onSuccess: invalidate,
        meta: { alertOnSuccess: true }
    });


    const updateCategory = useMutation({
        mutationFn: ({ id, params }: { id: string, params: UpdateCategoryParams }) =>
            service.update(id, params),

        onSuccess: invalidate,
        meta: { alertOnSuccess: true }
    })


    return {
        /** Las categorías de la página actual, ya mapeadas y ya filtradas. */
        data: query.data?.data ?? NO_CATEGORIES,

        /**
         * Cuántas cumplen los filtros, en todas las páginas. Lo dice el backend.
         * Con la barra vacía es el catálogo entero.
         */
        total: query.data?.total ?? 0,

        /** Estado de la barra: texto, estado y sus manejadores. */
        filters,

        /** Estado del pie: página, tamaño y sus manejadores. */
        pagination,

        error: query.error,
        isLoading: query.isLoading,
        isPending: query.isPending,
        isError: query.isError,

        create: createCategory,
        update: updateCategory
    }
};
