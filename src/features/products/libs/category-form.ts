import type { RegisterOptions } from "react-hook-form";

import { formatMessage, messages } from "@/messages";

import { CategoryFormValues, CategoryList } from "../interfaces";

/**
 * Reglas y textos del formulario de categoría, para crear y para editar. Aquí
 * no hay estilos ni componentes, el modal decide cómo se muestran.
 */


const categoryMessages = messages.products.categories;


/**
 * Límites del nombre. Pasados los 40 caracteres el nombre ya no cabe bien en
 * la carta ni en las pestañas del catálogo.
 */
export const CATEGORY_NAME_LIMITS = { min: 3, max: 40 } as const;


/**
 * Límites de la descripción. Es opcional, así que el mínimo solo aplica si se
 * escribe algo. 160 caracteres se leen de un vistazo en la tabla.
 */
export const CATEGORY_DESCRIPTION_LIMITS = { min: 3, max: 160 } as const;


/**
 * Caracteres permitidos en el nombre. Acepta letras con tildes y ñ, números,
 * espacios y los signos que suelen aparecer en una carta, como la coma, el
 * punto, el ampersand, el guion y el apóstrofo. Lo demás casi siempre llega
 * por error al pegar texto.
 */
const NAME_ALLOWED_CHARS = /^[\p{L}\p{N} .,&'’-]+$/u;


/** La descripción es una frase, así que también admite signos de puntuación. */
const DESCRIPTION_ALLOWED_CHARS = /^[\p{L}\p{N} .,;:()¿?¡!%\/&'’"-]+$/u;


type FieldRules<K extends keyof CategoryFormValues> = RegisterOptions<
    CategoryFormValues,
    K
>;


/**
 * Reglas de cada campo para react-hook-form. Los mensajes explican qué falta
 * y cómo corregirlo.
 */
export const CATEGORY_FORM_RULES = {
    name: {
        required: categoryMessages.validation.nameRequired,
        maxLength: {
            value: CATEGORY_NAME_LIMITS.max,
            message: formatMessage(categoryMessages.validation.nameMax, {
                max: CATEGORY_NAME_LIMITS.max,
            }),
        },

        // Cada regla tiene nombre para poder agregar otra sin reescribir estas.
        validate: {
            // Se mide sin los espacios de los extremos, porque tres espacios
            // cumplirían el mínimo sin ser un nombre.
            length: (value: string) =>
                value.trim().length >= CATEGORY_NAME_LIMITS.min ||
                formatMessage(categoryMessages.validation.nameMin, {
                    min: CATEGORY_NAME_LIMITS.min,
                }),

            charset: (value: string) =>
                value.trim().length === 0 ||
                NAME_ALLOWED_CHARS.test(value.trim()) ||
                categoryMessages.validation.nameChars,
        },
    } satisfies FieldRules<"name">,

    description: {
        maxLength: {
            value: CATEGORY_DESCRIPTION_LIMITS.max,
            message: formatMessage(categoryMessages.validation.descriptionMax, {
                max: CATEGORY_DESCRIPTION_LIMITS.max,
            }),
        },

        // Las dos reglas aceptan el campo vacío primero, porque la descripción
        // es opcional y dejarla en blanco no debe marcarse como muy corta.
        validate: {
            length: (value: string) =>
                value.trim().length === 0 ||
                value.trim().length >= CATEGORY_DESCRIPTION_LIMITS.min ||
                formatMessage(categoryMessages.validation.descriptionMin, {
                    min: CATEGORY_DESCRIPTION_LIMITS.min,
                }),

            charset: (value: string) =>
                value.trim().length === 0 ||
                DESCRIPTION_ALLOWED_CHARS.test(value.trim()) ||
                categoryMessages.validation.descriptionChars,
        },
    } satisfies FieldRules<"description">,
} as const;


/**
 * Indica si el formulario tiene cambios respecto a la categoría guardada. Si
 * no los tiene, el botón de guardar se deshabilita. Se compara sin espacios
 * en los extremos porque el isDirty de react-hook-form contaría un espacio al
 * final como cambio, aunque el mapper lo quite antes de enviar.
 */
export function hasCategoryChanges(
    values: CategoryFormValues,
    category: CategoryList
): boolean {
    return (
        values.name.trim() !== category.name.trim() ||
        values.description.trim() !== category.description.trim() ||
        values.isActive !== category.isActive
    );
}


/**
 * Textos del modal en cada modo. Tenerlos juntos evita repetir la misma
 * condición de crear o editar en cada texto del modal.
 */
export const CATEGORY_MODAL_COPY = {
    create: categoryMessages.form.create,
    edit: categoryMessages.form.edit,
} as const;


export type CategoryModalMode = keyof typeof CATEGORY_MODAL_COPY;


/**
 * Ayudas de cada campo con sus límites. Se muestran antes de escribir para
 * que el mínimo no sorprenda a nadie, y los números salen de las constantes
 * de arriba para que el texto y la regla siempre coincidan.
 */
export const CATEGORY_FIELD_HINTS = {
    name: formatMessage(categoryMessages.form.name.helper, {
        min: CATEGORY_NAME_LIMITS.min,
        max: CATEGORY_NAME_LIMITS.max,
    }),
    description: formatMessage(categoryMessages.form.description.helper, {
        min: CATEGORY_DESCRIPTION_LIMITS.min,
        max: CATEGORY_DESCRIPTION_LIMITS.max,
    }),
} as const;


/** Ayuda del interruptor de estado. Explica qué pasa con los productos al desactivar. */
export const CATEGORY_ACTIVE_HINT = categoryMessages.form.activeHint;
