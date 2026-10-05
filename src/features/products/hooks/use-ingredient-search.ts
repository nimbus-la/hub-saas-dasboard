"use client";

import * as React from "react";

import { searchRecipeIngredients } from "../libs";
import { useInventory } from "./use-inventory";


/**
 * Estado del buscador de insumos de la receta.
 *
 * Guarda lo que se escribe y calcula los resultados con
 * `searchRecipeIngredients`. La búsqueda es local porque el backend no filtra
 * el inventario por texto: se trae entero una vez y se filtra aquí.
 *
 * Recibe los ids que ya están en la receta para no volver a ofrecerlos.
 */
export function useIngredientSearch(selectedIds: readonly string[]) {
    const [query, setQuery] = React.useState("");
    const { ingredients, isLoading } = useInventory();

    const search = React.useMemo(
        () => searchRecipeIngredients(query, selectedIds, ingredients, isLoading),
        [query, selectedIds, ingredients, isLoading]
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
