import { RegisterOptions } from "react-hook-form";

import type { InputSelectorOption } from "@/interfaces";

/**
 * Una línea de la receta tal como la guarda el formulario.
 *
 * Solo se guarda el id del insumo y no el insumo completo, para que el costo
 * se calcule siempre con el precio que tenga el inventario en ese momento.
 */
export interface ProductRecipeFormValues {
    itemId: string;
    /** Cantidad en la unidad del insumo, o `null` mientras el campo esté vacío. */
    quantity: number | null;
    /** Marca un insumo que el cliente puede pedir sin él. No cambia el costo de la receta. */
    isOptional: boolean;
}


/**
 * La configuración propia de una sucursal.
 *
 * Hay una entrada por sucursal desde el principio, aunque no se haya tocado
 * nada: así la tarjeta sabe a qué posición del formulario escribir sin tener
 * que crear la línea al vuelo.
 */
export interface ProductBranchFormValues {
    branchId: string;
    /** En `false` el precio y la disponibilidad salen de la configuración global. */
    isCustom: boolean;
    /** Precio propio de la sucursal, o `null` mientras el campo esté vacío. */
    price: number | null;
    isAvailable: boolean;
}


export interface ProductFormValues {
    name: string;
    categoryId: string;
    description: string;
    imageUrl: File | null;
    /** Lo que cuesta preparar una porción. Lo escribe la persona. */
    cost: number | null;
    /** Precio de venta global, en pesos. */
    price: number | null;
    /**
     * Parte del precio que es ganancia, en porcentaje de 0 a menos de 100.
     * Es sobre el precio, como lo mide el backend, y no sobre el costo.
     */
    margin: number | null;
    /** Si el producto se publica en la carta. Cada sucursal puede cambiarlo. */
    isAvailable: boolean;
    /**
     * Estacionados: la receta y las sucursales no se piden ni se envían. Se
     * quedan en el formulario con sus valores por defecto para que sus piezas
     * sigan compilando y vuelvan sin rehacerlas.
     */
    recipe: ProductRecipeFormValues[];
    branches: ProductBranchFormValues[];
}



/**
 * Lo que necesita el asistente para funcionar en cualquier modo: con qué
 * valores empieza y qué hacer al guardar. El alta lo arranca vacío y la
 * edición con el producto cargado.
 */
export interface ProductFormOptions {
    defaultValues: ProductFormValues;
    /** Recibe el formulario entero, ya validado. */
    onSave: (values: ProductFormValues) => void;
    /** Mientras sea `true`, el botón de guardar se bloquea. */
    isSaving: boolean;
    /**
     * Bloquea el botón de guardar mientras el formulario siga igual a como
     * empezó. Lo usa la edición; en el alta no tiene sentido, porque se parte
     * de un formulario vacío que igual hay que llenar.
     */
    requireChanges?: boolean | undefined;
}


/**
 * Los mensajes que cambian entre crear y editar. Tienen la misma forma que
 * los bloques `create` y `edit` de `messages.products`, así que la pantalla
 * recibe el bloque tal cual.
 */
export interface ProductFormMessages {
    title: string;
    subtitle: string;
    backLabel: string;
    submit: string;
}


export interface ProductFormLayoutProps extends ProductFormOptions {
    formMessages: ProductFormMessages;

    /**
     * La categoría con su nombre, solo al editar. El formulario guarda el id y
     * el selector necesita la etiqueta, que puede no estar entre las cargadas.
     */
    currentCategory?: InputSelectorOption | undefined;
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