import type { RegisterOptions, UseFieldArrayProps } from "react-hook-form";

import type { Ingredient } from "@/lib/ingredients";

import type { ProductFormValues } from "./products.interface";


/* -------------------------------------------------------------------------- */
/*  Reglas del formulario                                                      */
/* -------------------------------------------------------------------------- */

/**
 * Ruta del campo de cantidad de una línea, por ejemplo `recipe.2.quantity`.
 * react-hook-form necesita la ruta exacta para tipar bien las reglas y el
 * valor del `Controller`.
 */
export type ProductRecipeQuantityPath = `recipe.${number}.quantity`;


/** Reglas del campo de cantidad de una línea. */
export type ProductRecipeQuantityRules = RegisterOptions<
    ProductFormValues,
    ProductRecipeQuantityPath
>;


/** Reglas de la receta completa, las que recibe `useFieldArray`. */
export type ProductRecipeRules = NonNullable<
    UseFieldArrayProps<ProductFormValues, "recipe">["rules"]
>;


/* -------------------------------------------------------------------------- */
/*  Receta resuelta                                                            */
/* -------------------------------------------------------------------------- */

/**
 * Una línea de la receta con su insumo ya buscado en el inventario.
 *
 * El formulario solo guarda el id del insumo y la cantidad tal como se
 * escribió. Esta interfaz junta eso con los datos del insumo y con lo que
 * cuesta la cantidad indicada.
 *
 * `quantity` y `cost` quedan en `null` mientras lo escrito no sea una cantidad
 * válida, así sabemos si el total ya se puede dar por bueno.
 */
export interface RecipeLine {
    /**
     * Posición de la línea dentro de `recipe` en el formulario. Con ella se
     * nombra el campo de cantidad y se quita la línea, y se guarda aquí porque
     * una línea cuyo insumo ya no existe no se muestra y las posiciones de la
     * lista dejan de coincidir con las del formulario.
     */
    index: number;
    ingredient: Ingredient;
    quantity: number | null;
    cost: number | null;
    isOutOfStock: boolean;
}


/**
 * Lo que cuesta la receta.
 *
 * `isComplete` es falso cuando alguna línea todavía no tiene una cantidad
 * válida. En ese caso el total solo suma las líneas que sí la tienen.
 */
export interface RecipeCost {
    total: number;
    isComplete: boolean;
}


/* -------------------------------------------------------------------------- */
/*  Provisionales                                                              */
/* -------------------------------------------------------------------------- */

/**
 * Insumo de los datos de prueba que usa hoy la tabla de la receta.
 *
 * Se elimina junto con `MockRecipeLine` cuando la tabla lea la receta del
 * formulario y use `RecipeLine`.
 */
export interface MockRecipeIngredient {
    id: string;
    name: string;
    sku: string;
    stock: number;
    /** Abreviatura de la unidad, como `g`, `ml` o `und`. */
    unit: string;
    /** Nombre de la unidad para la etiqueta accesible, como `gramos`. */
    unitName: string;
    isPerishable: boolean;
}


/** Línea de los datos de prueba que usa hoy la tabla de la receta. */
export interface MockRecipeLine {
    index: number;
    ingredient: MockRecipeIngredient;
    quantity: string;
    isOutOfStock: boolean;
}
