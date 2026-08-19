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

import { CategoryFormValues, CategoryList } from "../interfaces";

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

/**
 * La descripción es opcional, así que su mínimo solo aplica **si hay texto**:
 * la ausencia es válida, la descripción a medias —una letra suelta— no.
 */
export const CATEGORY_DESCRIPTION_LIMITS = { min: 3, max: 160 } as const;


/**
 * Caracteres admitidos.
 *
 * El nombre de una categoría es lenguaje, no un identificador: letras —con sus
 * tildes y su ñ, de ahí `\p{L}` en lugar de `a-z`—, cifras, espacios y los
 * cuatro signos que de verdad aparecen en la carta: la coma, el punto, el
 * ampersand y el guion, más el apóstrofo de "d'Angelo". Todo lo demás —`<`,
 * `{`, `#`, emojis— entra pegado desde otro sitio o por error, y termina
 * impreso en el rótulo de una sección.
 */
const NAME_ALLOWED_CHARS = /^[\p{L}\p{N} .,&'’-]+$/u;

/** La descripción es una frase, así que además admite la puntuación de una. */
const DESCRIPTION_ALLOWED_CHARS = /^[\p{L}\p{N} .,;:()¿?¡!%\/&'’"-]+$/u;

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

        // Las dos comprobaciones van en un objeto y no en una función suelta
        // para que el modal pueda añadirle la unicidad sin reescribirlas: son
        // reglas con nombre, y react-hook-form las mezcla por clave.
        validate: {
            // Se valida sobre el texto sin espacios de los extremos: tres
            // espacios seguidos cumplen cualquier `minLength` y no son un nombre.
            length: (value: string) =>
                value.trim().length >= CATEGORY_NAME_LIMITS.min ||
                formatMessage(copy.validation.nameMin, {
                    min: CATEGORY_NAME_LIMITS.min,
                }),

            charset: (value: string) =>
                value.trim().length === 0 ||
                NAME_ALLOWED_CHARS.test(value.trim()) ||
                copy.validation.nameChars,
        },
    } satisfies FieldRules<"name">,

    description: {
        maxLength: {
            value: CATEGORY_DESCRIPTION_LIMITS.max,
            message: formatMessage(copy.validation.descriptionMax, {
                max: CATEGORY_DESCRIPTION_LIMITS.max,
            }),
        },

        // Vacía es válida —el campo es opcional—, y por eso las dos reglas
        // salen antes de mirar nada más: sin ese primer `||`, dejar la
        // descripción en blanco fallaría por "muy corta".
        validate: {
            length: (value: string) =>
                value.trim().length === 0 ||
                value.trim().length >= CATEGORY_DESCRIPTION_LIMITS.min ||
                formatMessage(copy.validation.descriptionMin, {
                    min: CATEGORY_DESCRIPTION_LIMITS.min,
                }),

            charset: (value: string) =>
                value.trim().length === 0 ||
                DESCRIPTION_ALLOWED_CHARS.test(value.trim()) ||
                copy.validation.descriptionChars,
        },
    } satisfies FieldRules<"description">,
} as const;


/* -------------------------------------------------------------------------- */
/*  Cambios respecto a lo guardado                                             */
/* -------------------------------------------------------------------------- */

/**
 * ¿Lo que hay en el formulario difiere de la categoría guardada?
 *
 * Es lo que decide si "Guardar cambios" está disponible al editar: sin ningún
 * cambio, el botón manda una petición que deja todo exactamente igual.
 *
 * Se compara **recortado**, y no con el `isDirty` de react-hook-form, porque
 * ese marca sucio el formulario en cuanto se escribe un espacio al final del
 * nombre — un cambio que el mapper elimina antes de enviarlo y que por tanto no
 * cambia nada. Basta con que difiera un campo: no hay que tocarlos los tres.
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


/**
 * Ayudas de cada campo, con sus límites ya dentro.
 *
 * El mínimo se anuncia **antes** de escribir y no solo al fallar: un campo que
 * recibe "Té" y lo rechaza sin haber avisado de que pedía dos caracteres se
 * lee como un error de la aplicación. Los números salen de las constantes de
 * arriba, así que el texto y la regla no pueden discrepar.
 */
export const CATEGORY_FIELD_HINTS = {
    name: formatMessage(copy.form.name.helper, {
        min: CATEGORY_NAME_LIMITS.min,
        max: CATEGORY_NAME_LIMITS.max,
    }),
    description: formatMessage(copy.form.description.helper, {
        min: CATEGORY_DESCRIPTION_LIMITS.min,
        max: CATEGORY_DESCRIPTION_LIMITS.max,
    }),
} as const;

/** Aviso del interruptor. Explica qué pasa con los productos al desactivar. */
export const CATEGORY_ACTIVE_HINT = copy.form.activeHint;
