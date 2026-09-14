import { RegisterOptions } from "react-hook-form";

/**
 * Una línea de la receta tal como la guarda el formulario.
 *
 * Solo se guarda el id del insumo y no el insumo completo, para que el costo
 * se calcule siempre con el precio que tenga el inventario en ese momento.
 */
export interface ProductRecipeFormValues {
    itemId: string;
    /** Lo que se escribió en el campo. Se guarda como texto para no perder lo que la persona está tecleando, como `1,`. */
    quantity: string;
    /** Marca un insumo que el cliente puede pedir sin él. No cambia el costo de la receta. */
    isOptional: boolean;
}


export interface ProductFormValues {
    name: string;
    categoryId: string;
    description: string;
    imageUrl: File | null;
    price: string;
    margin: string;
    recipe: ProductRecipeFormValues[];
}



/** Identificador de cada paso. */
export type ProductFormStepId = "basics" | "pricing" | "recipe";



export interface ProductFormStep {
    id: ProductFormStepId;
    title: string;
    subtitle: string;
    fields: readonly (keyof ProductFormValues)[];
}



export type ProductFieldRules<K extends keyof ProductFormValues> = RegisterOptions<
    ProductFormValues,
    K
>