"use client";

import * as React from "react";

import { searchRecipeIngredients } from "../libs";


/**
 * Estado del buscador de insumos de la receta.
 *
 * Guarda lo que se escribe y calcula los resultados con
 * `searchRecipeIngredients`. Hoy busca en los datos de prueba, y cuando exista
 * el endpoint de inventario solo tiene que cambiar este hook, sin tocar el
 * componente.
 *
 * Recibe los ids que ya están en la receta para no volver a ofrecerlos.
 */
export function useIngredientSearch(selectedIds: readonly string[]) {
    const [query, setQuery] = React.useState("");

    const search = React.useMemo(
        () => searchRecipeIngredients(query, selectedIds),
        [query, selectedIds]
    );

    const clear = React.useCallback(() => setQuery(""), []);

    return {
        query,
        setQuery,
        clear,
        /** Lo escrito sin espacios al inicio ni al final. */
        term: query.trim(),
        ...search,
    };
}
