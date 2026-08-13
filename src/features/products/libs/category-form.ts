// ── Dominio: alta y edición de una categoría ────────────────────────────────
// Los campos del formulario, sus límites y las reglas que dicen si un valor
// sirve. Vive fuera de la pantalla por el mismo motivo que `product-form.ts`:
// cuando el backend valide lo mismo, las dos partes tienen que estar mirando
// los mismos números.
//
// Aquí no hay una sola clase de Tailwind ni un solo componente: es texto y
// reglas. El modal decide cómo se pintan.

import type { RegisterOptions } from "react-hook-form";

import { formatMessage, messages } from "@/messages";

import { CategoryFormValues } from "../interfaces";

/** Atajo al bloque del catálogo que da nombre a todo lo de este archivo. */
const copy = messages.products.categories;

/* -------------------------------------------------------------------------- */
/*  Reglas de validación                                                       */
/* -------------------------------------------------------------------------- */

/**
 * Límites de los campos.
 *
 * El nombre es un rótulo de sección de la carta y una pestaña del catálogo:
 * pasado de 40 caracteres deja de caber en las dos. La descripción es una
 * frase de apoyo, no un párrafo — 160 es lo que se lee de un vistazo en una
 * celda de tabla.
 */
export const CATEGORY_NAME_LIMITS = { min: 3, max: 40 } as const;
export const CATEGORY_DESCRIPTION_MAX = 160;

type FieldRules<K extends keyof CategoryFormValues> = RegisterOptions<
    CategoryFormValues,
    K
>;

/**
 * Reglas de cada campo, en el formato que espera react-hook-form.
 *
 * Los mensajes dicen qué falta y qué hacer. "Campo obligatorio" no es un
 * mensaje de error, es una etiqueta.
 *
 * La unicidad del nombre no está aquí: depende del resto de categorías, que el
 * formulario no conoce. La comprueba la pantalla, que sí las tiene, y la
 * inyecta como una regla más al montar el modal.
 */
export const CATEGORY_FORM_RULES = {
    name: {
        required: copy.validation.nameRequired,
        maxLength: {
            value: CATEGORY_NAME_LIMITS.max,
            message: formatMessage(copy.validation.nameMax, {
                max: CATEGORY_NAME_LIMITS.max,
            }),
        },
        // Se valida sobre el texto sin espacios de los extremos: tres espacios
        // seguidos cumplen cualquier `minLength` y no son un nombre.
        validate: (value: string) =>
            value.trim().length >= CATEGORY_NAME_LIMITS.min ||
            formatMessage(copy.validation.nameMin, {
                min: CATEGORY_NAME_LIMITS.min,
            }),
    } satisfies FieldRules<"name">,

    description: {
        maxLength: {
            value: CATEGORY_DESCRIPTION_MAX,
            message: formatMessage(copy.validation.descriptionMax, {
                max: CATEGORY_DESCRIPTION_MAX,
            }),
        },
    } satisfies FieldRules<"description">,
} as const;

/** Mensaje del nombre repetido. Se compone aquí para no redactarlo dos veces. */
export const duplicateCategoryNameMessage = (name: string): string =>
    formatMessage(copy.validation.nameTaken, { name: name.trim() });

/* -------------------------------------------------------------------------- */
/*  Textos                                                                     */
/* -------------------------------------------------------------------------- */

/**
 * Los dos modos del modal.
 *
 * Comparten campos y reglas, y se diferencian solo en lo que dicen y en si
 * enseñan el interruptor. Tenerlos en una tabla evita el `isEdit ? … : …`
 * repetido cinco veces dentro del JSX.
 */
export const CATEGORY_MODAL_COPY = {
    create: copy.form.create,
    edit: copy.form.edit,
} as const;

export type CategoryModalMode = keyof typeof CATEGORY_MODAL_COPY;

/** Aviso del interruptor. Explica qué pasa con los productos al desactivar. */
export const CATEGORY_ACTIVE_HINT = copy.form.activeHint;
