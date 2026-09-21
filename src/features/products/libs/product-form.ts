// ── El alta de un producto ──────────────────────────────────────────────────
// Los pasos del formulario, los límites de cada campo y las reglas que dicen
// si un valor sirve. Vive fuera de la pantalla por el mismo motivo que
// `products.ts`: cuando el alta la valide también el backend, las dos partes
// tienen que estar mirando los mismos números, y una constante compartida es
// más barata de sincronizar que un `if` repetido en dos sitios.
//
// Aquí no hay una sola clase de Tailwind ni un solo componente: es texto y
// reglas. La pantalla decide cómo se pintan.

import type { FieldErrors } from "react-hook-form";

import { BRANCHES } from "@/lib/branches";
import { formatMessage, messages } from "@/messages";

import type {
    ProductBranchFormValues,
    ProductFieldRules,
    ProductFormStep,
    ProductFormValues,
} from "../interfaces";


const message = messages.products.create;



/**
 * Una línea por sucursal, todas heredando.
 *
 * Se siembran desde el principio y no al marcar el interruptor porque así la
 * tarjeta de cada sucursal escribe siempre en la misma posición del formulario,
 * sin depender del orden en que se personalizaron.
 */
const buildDefaultBranchValues = (): ProductBranchFormValues[] =>
    BRANCHES.map((branch) => ({
        branchId: branch.id,
        isCustom: false,
        price: null,
        isAvailable: true,
    }));


export const DEFAULT_PRODUCT_FORM_VALUES: ProductFormValues = {
    name: "",
    categoryId: "",
    description: "",
    imageUrl: null,
    margin: null,
    price: null,
    isAvailable: true,
    recipe: [],
    branches: buildDefaultBranchValues()
}



export const BASICS_STEP: ProductFormStep = {
    id: "basics",
    title: message.steps.basics.label,
    subtitle: message.steps.basics.hint,
    fields: ["name", "categoryId", "description", "imageUrl"]
}



export const PRICING_STEP: ProductFormStep = {
    id: "pricing",
    title: message.steps.pricing.label,
    subtitle: message.steps.pricing.hint,
    fields: ["margin", "price", "isAvailable", "branches"]
}



export const RECIPE_STEP: ProductFormStep = {
    id: "recipe",
    title: message.steps.recipe.label,
    subtitle: message.steps.recipe.hint,
    fields: ["recipe"]
}



export const PRODUCT_FORM_STEPS: readonly ProductFormStep[] = [
    BASICS_STEP,
    RECIPE_STEP,
    PRICING_STEP,
]



export const PRODUCT_FORM_STEP_LENGTH = PRODUCT_FORM_STEPS.length;



export const PRODUCT_VALIDATION = {
    name: { min: 3, max: 60 },
    description: { min: 0, max: 280 }
} as const;



export const PRODUCT_FORM_RULES = {
    name: {
        required: message.validation.nameRequired,
        maxLength: {
            value: PRODUCT_VALIDATION.name.max,
            message: formatMessage(message.validation.nameMax, {
                max: PRODUCT_VALIDATION.name.max
            }),
        },

        validate: (value: string) =>
            value.trim().length >= PRODUCT_VALIDATION.name.min ||
            formatMessage(message.validation.nameMin, {
                min: PRODUCT_VALIDATION.name.min
            })
    } satisfies ProductFieldRules<"name">,

    category: {
        required: message.validation.categoryRequired
    } satisfies ProductFieldRules<"categoryId">,

    description: {
        maxLength: {
            value: PRODUCT_VALIDATION.description.max,
            message: formatMessage(message.validation.descriptionMax, {
                max: PRODUCT_VALIDATION.description.max
            }),
        },
    } satisfies ProductFieldRules<"description">
} as const;


/* -------------------------------------------------------------------------- */
/*  Moverse entre pasos                                                        */
/* -------------------------------------------------------------------------- */




/** 
 * Devuelve el paso del formulario correspondiente a una posición.
 * 
 * El índice se acota al rango válido de `PRODUCT_FORM_STEPS` para evitar
 * accesos fuera de los límites del array:
 * - Un índice negativo devuelve el primer paso.
 * - Un índice mayor al último devuelve el último paso.
 * 
 * De esta forma, quien la use recibe siempre  un `ProductFormStep` válido
 * sin tener que comprobar previamente si el índice está dentro del rango.
 * 
 * @param index - Posición del paso que se quiere obtener
 * @returns El paso correspondiente al índice, ajustado al rango válido
 */
export function getProductFormStep(index: number): ProductFormStep {
    const firstIndex: number = 0;
    const lastIndex: number = PRODUCT_FORM_STEP_LENGTH - 1;

    const safeIndex = Math.min(
        Math.max(index, firstIndex),
        lastIndex
    );

    return PRODUCT_FORM_STEPS[safeIndex] ?? BASICS_STEP;
}


/**
 * El primer paso que tiene algún campo en error.
 *
 * Al guardar se revisa el formulario entero, y si algo quedó mal puede estar
 * en un paso que ya no se ve. Devolver aquí su posición evita el callejón de
 * un botón que no hace nada y un error escondido dos pantallas atrás.
 */
export function findFirstInvalidStep(errors: FieldErrors<ProductFormValues>): number {
    const index = PRODUCT_FORM_STEPS.findIndex((step) =>
        step.fields.some((field) => errors[field] !== undefined)
    );

    return index === -1 ? PRODUCT_FORM_STEP_LENGTH - 1 : index;
}


/** `Paso 1 de 3` - para el resumen accesible y las pantallas estrechas */
export const formatStepPosition = (index: number): string =>
    formatMessage(message.stepPosition, {
        current: String(index + 1),
        total: String(PRODUCT_FORM_STEP_LENGTH)
    })