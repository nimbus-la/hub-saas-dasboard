"use client";

import React from "react";

import { useQuery } from "@tanstack/react-query";

import { useHttpClient } from "@/context";
import type { InputSelectorOption } from "@/interfaces";
import { toCategoryOptions } from "../mappers";
import { ACTIVE_CATEGORIES_PARAMS, categoriesQueryOptions, createCategoriesService } from "../services";

/**
 * Categorías activas listas para el selector del alta de producto. Usa la
 * misma clave de caché que la tabla de categorías, así que crear o editar una
 * categoría también refresca estas opciones.
 */


/** Lista vacía fija para que el selector no reciba un arreglo nuevo en cada render. */
const NO_OPTIONS: InputSelectorOption[] = [];


export function useCategoryOptions() {
    const http = useHttpClient();

    const service = React.useMemo(() => createCategoriesService(http), [http]);

    const query = useQuery({
        ...categoriesQueryOptions(service, ACTIVE_CATEGORIES_PARAMS),

        // La caché guarda la página tal como llega y aquí solo se convierte
        // para el selector. Así la precarga del servidor sirve sin cambios.
        select: toCategoryOptions,
    });

    return {
        options: query.data ?? NO_OPTIONS,
        isLoading: query.isLoading,
    };
}
