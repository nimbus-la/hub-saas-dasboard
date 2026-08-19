"use client";

import React from "react";

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useHttpClient } from "@/context";
import { useClampedPage, usePagination } from "@/hooks";
import { CategoriesService, CategoryList, CreateCategoryParams, UpdateCategoryParams } from "../interfaces";
import { DEFAULT_CATEGORIES_PAGINATION, categoriesQueryOptions, categoryKeys, createCategoriesService } from "../services";


/**
 * Listado paginado de categorías, con su alta y su edición.
 *
 * La paginación vive **dentro** del hook y no en la pantalla a propósito: el
 * número de página y la consulta que lo usa tienen que moverse a la vez, y
 * dejarlos separados abre la ventana en la que la tabla enseña una página y el
 * pie marca otra. La pantalla recibe `pagination` ya montada y sólo la enchufa
 * al pie.
 *
 * El orden de los tres pasos es el que impone la dependencia entre ellos:
 * primero la página, con ella la consulta, y con el total que devuelve la
 * consulta el ajuste de la página. Ver `usePagination`.
 */


/**
 * La lista vacía es una constante y no un `[]` literal.
 *
 * Se devuelve mientras no hay datos, y un array nuevo en cada render invalidaría
 * el `useMemo` del filtro de la pantalla en cada uno de ellos.
 */
const NO_CATEGORIES: CategoryList[] = [];


export function useProductsCategories() {
    const http = useHttpClient();
    const queryClient = useQueryClient();


    const service = React.useMemo<CategoriesService>(
        () => createCategoriesService(http),
        [http]
    );


    const pagination = usePagination({
        initialPageSize: DEFAULT_CATEGORIES_PAGINATION.pageSize,
    });


    const query = useQuery({
        ...categoriesQueryOptions(http, pagination.params),

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
        /** Las categorías de la página actual, ya mapeadas. */
        data: query.data?.data ?? NO_CATEGORIES,

        /** Cuántas hay en total, en todas las páginas. Lo dice el backend. */
        total: query.data?.total ?? 0,

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
