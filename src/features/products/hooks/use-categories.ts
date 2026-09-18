"use client";

import React from "react";

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useHttpClient } from "@/context";
import { useClampedPage, usePagination } from "@/hooks";
import { CategoryList, CreateCategoryParams, UpdateCategoryParams } from "../interfaces";
import { DEFAULT_CATEGORIES_PAGINATION, categoriesQueryOptions, categoryKeys, createCategoriesService } from "../services";
import { useCategoryFilters } from "./use-category-filters";

/**
 * Listado de categorías con sus filtros, su paginación, la creación y la
 * edición. Los filtros y la página viven aquí y no en la pantalla, porque
 * juntos forman una sola petición al backend y así la tabla nunca muestra
 * datos distintos a los que indican los controles.
 */


/**
 * Lista vacía fija para cuando todavía no hay datos. Un arreglo nuevo en cada
 * render haría que la tabla y la pantalla se recalcularan sin necesidad.
 */
const NO_CATEGORIES: CategoryList[] = [];


export function useProductsCategories() {
    const http = useHttpClient();
    const queryClient = useQueryClient();

    // Una sola instancia del servicio para la consulta y las mutaciones.
    const service = React.useMemo(() => createCategoriesService(http), [http]);

    const filters = useCategoryFilters();

    // Al cambiar un filtro se vuelve a la primera página en el mismo render,
    // así no se hace una petición de más con la página anterior.
    const pagination = usePagination({
        initialPageSize: DEFAULT_CATEGORIES_PAGINATION.pageSize,
        resetKey: filters.key,
    });

    const query = useQuery({
        ...categoriesQueryOptions(service, { ...pagination.params, ...filters.params }),

        // Mantiene la página anterior en pantalla mientras llega la nueva, para
        // que la tabla no se vacíe ni muestre el estado vacío por un instante.
        placeholderData: keepPreviousData,
    });

    // Si la página actual deja de existir, por ejemplo al subir el tamaño de
    // página, se pasa a la última que sí tenga datos.
    useClampedPage(pagination, query.data?.total);

    // Se refrescan todas las páginas y no solo la visible, porque crear o
    // editar una categoría puede mover filas de una página a otra.
    const invalidate = () =>
        queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });

    const createCategory = useMutation({
        mutationFn: (params: CreateCategoryParams) => service.create(params),
        onSuccess: invalidate,
        meta: { alertOnSuccess: true },
    });

    const updateCategory = useMutation({
        mutationFn: (params: UpdateCategoryParams) => service.update(params),
        onSuccess: invalidate,
        meta: { alertOnSuccess: true },
    });

    return {
        /** Categorías de la página actual. */
        data: query.data?.rows ?? NO_CATEGORIES,

        /** Cantidad de categorías que cumplen los filtros, en todas las páginas. */
        total: query.data?.total ?? 0,

        filters,
        pagination,

        error: query.error,
        isLoading: query.isLoading,
        isPending: query.isPending,
        isError: query.isError,

        create: createCategory,
        update: updateCategory,
    };
}
