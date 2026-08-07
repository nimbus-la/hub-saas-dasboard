// ── Dominio: alta y edición de una categoría ────────────────────────────────
// Los campos del formulario, sus límites y las reglas que dicen si un valor
// sirve. Vive fuera de la pantalla por el mismo motivo que `product-form.ts`:
// cuando el backend valide lo mismo, las dos partes tienen que estar mirando
// los mismos números.
//
// Aquí no hay una sola clase de Tailwind ni un solo componente: es texto y
// reglas. El modal decide cómo se pintan.

import type { RegisterOptions } from "react-hook-form";
import { CategoryFormValues } from "../interfaces";

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
        required: "Escribe el nombre con el que aparecerá en la carta.",
        maxLength: {
            value: CATEGORY_NAME_LIMITS.max,
            message: `El nombre no puede pasar de ${CATEGORY_NAME_LIMITS.max} caracteres.`,
        },
        // Se valida sobre el texto sin espacios de los extremos: tres espacios
        // seguidos cumplen cualquier `minLength` y no son un nombre.
        validate: (value: string) =>
            value.trim().length >= CATEGORY_NAME_LIMITS.min ||
            `El nombre necesita al menos ${CATEGORY_NAME_LIMITS.min} caracteres.`,
    } satisfies FieldRules<"name">,

    description: {
        maxLength: {
            value: CATEGORY_DESCRIPTION_MAX,
            message: `La descripción supera los ${CATEGORY_DESCRIPTION_MAX} caracteres.`,
        },
    } satisfies FieldRules<"description">,
} as const;

/** Mensaje del nombre repetido. Se compone aquí para no redactarlo dos veces. */
export const duplicateCategoryNameMessage = (name: string): string =>
    `Ya existe una categoría llamada "${name.trim()}". Usa otro nombre.`;

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
    create: {
        title: "Nueva categoría",
        description:
            "Agrupa productos de la carta bajo un nombre. Podrás asignarle productos después.",
        submit: "Crear categoría",
    },
    edit: {
        title: "Editar categoría",
        description:
            "Cambia el nombre, la descripción o retírala de la carta sin perder sus productos.",
        submit: "Guardar cambios",
    },
} as const;

export type CategoryModalMode = keyof typeof CATEGORY_MODAL_COPY;

/** Aviso del interruptor. Explica qué pasa con los productos al desactivar. */
export const CATEGORY_ACTIVE_HINT = {
    on: "Se muestra en la carta y en el filtro del catálogo.",
    off: "Se oculta de la carta. Sus productos no se borran.",
} as const;
