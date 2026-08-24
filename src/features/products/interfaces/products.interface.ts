import { RegisterOptions } from "react-hook-form";

export interface ProductRecipeFormValues {
    itemId: string;
    quantity: string;
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