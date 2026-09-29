"use client";

import React from "react";

import { useQuery } from "@tanstack/react-query";

import { useHttpClient } from "@/context";
import type { Ingredient } from "@/lib/ingredients";

import { createInventoryService, inventoryQueryOptions } from "../services";


/** Lista vacía fija mientras el inventario llega. */
const NO_INGREDIENTS: Ingredient[] = [];


/**
 * Inventario de insumos para la receta.
 *
 * El paso de la receta y el de precio lo usan a la vez, pero comparten la
 * clave de caché, así que es una sola petición.
 */
export function useInventory() {
    const http = useHttpClient();

    const service = React.useMemo(() => createInventoryService(http), [http]);

    const query = useQuery(inventoryQueryOptions(service));

    const ingredients = query.data ?? NO_INGREDIENTS;

    // La receta guarda solo el id de cada insumo; con el mapa se encuentra el
    // de cada línea sin recorrer el inventario entero.
    const byId = React.useMemo(
        () => new Map(ingredients.map((ingredient) => [ingredient.id, ingredient])),
        [ingredients]
    );

    return {
        ingredients,
        byId,
        isLoading: query.isLoading,
    };
}
