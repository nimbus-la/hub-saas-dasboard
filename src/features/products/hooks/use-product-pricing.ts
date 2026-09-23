"use client";

// ── El precio dentro del formulario ─────────────────────────────────────────
// Enlaza el margen con el precio de venta y resuelve lo que ve el paso 3: el
// costo que trae la receta, la ganancia por unidad y qué termina cobrando cada
// sucursal.

import * as React from "react";
import { useFormContext, useWatch } from "react-hook-form";

import type {
    ProductFormValues,
    ProductRecipeFormValues,
    RecipeCost,
} from "../interfaces";
import {
    countCustomBranches,
    getMarginFromPrice,
    getPriceFromMargin,
    getRecipeCost,
    resolveBranchPricing,
    resolveGlobalPricing,
    resolveRecipeLines,
} from "../libs";


/** Fuera del hook para que `useWatch` reciba siempre la misma función. */
const computeRecipeCost = (
    recipe: ProductRecipeFormValues[] | undefined
): RecipeCost => getRecipeCost(resolveRecipeLines(recipe ?? []));


export function useProductPricing() {
    const { control, getValues, setValue } = useFormContext<ProductFormValues>();

    // El costo se recalcula desde la receta y no se guarda en el formulario:
    // si los insumos suben de precio, el paso tiene que mostrar el costo de
    // hoy y no el del momento en que se escribió la receta.
    const cost = useWatch({ control, name: "recipe", compute: computeRecipeCost });

    const margin = useWatch({ control, name: "margin" });
    const price = useWatch({ control, name: "price" });
    const isAvailable = useWatch({ control, name: "isAvailable" });
    const branches = useWatch({ control, name: "branches" });

    // Se puede volver al paso de la receta y cambiarla, y entonces el par
    // margen/precio quedaría calculado sobre un costo que ya no existe. Al
    // entrar se rehace el precio desde el margen, no al revés: el margen es lo
    // que la persona decidió ganar y el precio es su consecuencia.
    const syncedCost = React.useRef<number | null>(null);

    React.useEffect(() => {
        if (syncedCost.current === cost.total) return;

        syncedCost.current = cost.total;

        if (margin === null) return;

        setValue("price", getPriceFromMargin(cost.total, margin), {
            shouldValidate: true,
        });
    }, [cost.total, margin, setValue]);

    // Escribir uno rellena el otro. El campo avisa de sus cambios también
    // cuando el valor le llega por props, así que al rellenar el de al lado el
    // aviso vuelve como si alguien hubiera tecleado y los dos se quedarían
    // corrigiéndose. Si lo que llega es lo que ya está guardado, es ese eco.
    //
    // Funciona porque las dos cuentas devuelven el número ya redondeado a los
    // decimales del campo, y entonces el eco repite exactamente lo escrito.
    const isEcho = React.useCallback(
        (field: "margin" | "price", value: number | null) => value === getValues(field),
        [getValues]
    );

    const handleMarginChange = React.useCallback(
        (value: number | null) => {
            if (isEcho("margin", value)) return;

            setValue("margin", value, { shouldValidate: true, shouldDirty: true });
            setValue("price", getPriceFromMargin(cost.total, value), {
                shouldValidate: true,
                shouldDirty: true,
            });
        },
        [cost.total, isEcho, setValue]
    );

    const handlePriceChange = React.useCallback(
        (value: number | null) => {
            if (isEcho("price", value)) return;

            setValue("price", value, { shouldValidate: true, shouldDirty: true });
            setValue("margin", getMarginFromPrice(cost.total, value), {
                shouldValidate: true,
                shouldDirty: true,
            });
        },
        [cost.total, isEcho, setValue]
    );

    const global = resolveGlobalPricing(
        cost.total,
        cost.isComplete,
        price,
        margin,
        isAvailable
    );

    const branchRows = resolveBranchPricing(branches, global);

    return {
        global,
        branchRows,
        customCount: countCustomBranches(branchRows),
        onMarginChange: handleMarginChange,
        onPriceChange: handlePriceChange,
    };
}
