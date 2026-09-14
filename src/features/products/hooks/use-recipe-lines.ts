"use client";

import * as React from "react";
import { useFieldArray, useFormContext, useFormState, useWatch } from "react-hook-form";

import type { Ingredient } from "@/lib/ingredients";

import type { ProductFormValues, ProductRecipeFormValues, RecipeLine } from "../interfaces";
import { RECIPE_RULES, resolveRecipeLines, resolveRecipeRows } from "../libs";
import { DEFAULT_RECIPE_LINE_VALUES } from "../utils";


/**
 * Convierte la receta del formulario en líneas con su costo.
 *
 * Está fuera del hook para que `useWatch` reciba siempre la misma función.
 */
const computeRecipeLines = (
    recipe: ProductRecipeFormValues[] | undefined
): RecipeLine[] => resolveRecipeLines(recipe ?? []);


/**
 * Maneja la receta del producto dentro del formulario.
 *
 * Tiene que usarse dentro del `FormProvider` del alta. Devuelve dos listas
 * parecidas con usos distintos:
 *
 * - `rows` sale de `fields` y es la que pinta la tabla. `fields` cambia en el
 *   mismo render en que se quita una línea, así que cada campo de cantidad
 *   siempre apunta a la posición correcta.
 * - `lines` sale de `useWatch` y trae las cantidades al día para calcular el
 *   costo. Se actualiza un render después de quitar o añadir, y por eso no se
 *   usa para pintar los campos. Si se usara, en ese render intermedio el campo
 *   de la fila quitada volvería a escribir su cantidad en el formulario y
 *   dejaría una línea fantasma sin insumo.
 */
export function useRecipeLines() {
    const { control, register } = useFormContext<ProductFormValues>();

    const { fields, append, remove } = useFieldArray({
        control,
        name: "recipe",
        rules: RECIPE_RULES,
    });

    // `useFieldArray` registra las reglas durante el render, pero al limpiar su
    // efecto las marca como desmontadas. En desarrollo React monta, limpia y
    // vuelve a montar los efectos para detectar errores, y en esa segunda vuelta
    // las reglas quedaban desmontadas, así que react-hook-form no las validaba y
    // el botón de continuar se habilitaba con la receta vacía. Registrarlas
    // otra vez en un efecto las deja activas mientras el paso esté en pantalla.
    React.useEffect(() => {
        register("recipe", RECIPE_RULES);
    }, [register]);

    const rows = React.useMemo(() => resolveRecipeRows(fields), [fields]);

    // Las líneas se calculan dentro de `useWatch` con `compute`. Si se
    // calcularan después con el valor que devuelve `useWatch`, el total podría
    // quedarse quieto, porque react-hook-form modifica ese arreglo sin crear
    // uno nuevo y React no se entera del cambio.
    const lines = useWatch({
        control,
        name: "recipe",
        compute: computeRecipeLines,
    });

    const { errors } = useFormState({ control, name: "recipe" });

    const selectedIds = React.useMemo(
        () => fields.map((field) => field.itemId),
        [fields]
    );

    // `shouldFocus: false` deja el foco en el buscador para poder añadir
    // varios insumos seguidos. Sin esto, react-hook-form lo mueve al campo de
    // cantidad de la línea nueva.
    const addIngredient = React.useCallback(
        (ingredient: Ingredient) => {
            append(
                { itemId: ingredient.id, ...DEFAULT_RECIPE_LINE_VALUES },
                { shouldFocus: false }
            );
        },
        [append]
    );

    const removeLine = React.useCallback(
        (index: number) => remove(index),
        [remove]
    );

    return {
        /** Filas de la tabla. */
        rows,
        /** Líneas con cantidad y costo, para el resumen. */
        lines,
        /** Ids de los insumos que ya están en la receta. */
        selectedIds,
        addIngredient,
        removeLine,
        /** Error de la receta completa, por ejemplo cuando se quita el último insumo. */
        error: errors.recipe?.root?.message,
    };
}
