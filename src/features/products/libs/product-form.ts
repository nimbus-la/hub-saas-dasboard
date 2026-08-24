// ── Dominio: alta de un producto ────────────────────────────────────────────
// Los pasos del formulario, los límites de cada campo y las reglas que dicen
// si un valor sirve. Vive fuera de la pantalla por el mismo motivo que
// `products.ts`: cuando el alta la valide también el backend, las dos partes
// tienen que estar mirando los mismos números, y una constante compartida es
// más barata de sincronizar que un `if` repetido en dos sitios.
//
// Aquí no hay una sola clase de Tailwind ni un solo componente: es texto y
// reglas. La pantalla decide cómo se pintan.

import type { RegisterOptions } from "react-hook-form";

import { PRODUCT_CATEGORIES } from "@/lib/products";
import { formatMessage, messages } from "@/messages";

/** Atajo al bloque del catálogo que da nombre a todo lo de este archivo. */
const copy = messages.products.create;

/* -------------------------------------------------------------------------- */
/*  Valores del formulario                                                     */
/* -------------------------------------------------------------------------- */

/**
 * Lo que el formulario tiene en la mano en cada momento.
 *
 * `image` es el `File` recién elegido, no una URL: la subida ocurre al guardar
 * el producto entero, no al soltar el archivo. Hasta entonces la foto sólo
 * existe en memoria y se previsualiza con un objeto de blob.
 */
export interface ProductFormValues {
    name: string;
    category: string;
    description: string;
    image: File | null;
}


/* -------------------------------------------------------------------------- */
/*  Reglas de validación                                                       */
/* -------------------------------------------------------------------------- */

/**
 * Límites de los campos de texto.
 *
 * El nombre cabe en la tarjeta del catálogo a dos líneas y en la comanda de
 * cocina a una; la descripción es un párrafo corto de carta, no una ficha
 * técnica. Se declaran aquí para que el contador del campo y la regla no
 * puedan discrepar.
 */
export const PRODUCT_NAME_LIMITS = { min: 3, max: 60 } as const;
export const PRODUCT_DESCRIPTION_MAX = 280;

/** Opciones del selector de categoría, en el orden de la carta. */
export const PRODUCT_CATEGORY_OPTIONS = PRODUCT_CATEGORIES.map((category) => ({
    label: category,
    value: category,
}));

type FieldRules<K extends keyof ProductFormValues> = RegisterOptions<
    ProductFormValues,
    K
>;

/**
 * Reglas de cada campo, en el formato que espera react-hook-form.
 *
 * Van juntas y fuera de los componentes por dos motivos. Uno, el mensaje y el
 * número que lo provoca tienen que viajar en el mismo sitio: un `minLength: 3`
 * en el componente y un "al menos tres caracteres" en otro archivo se
 * desincronizan al primer cambio. Y dos, cuando el alta también se valide en
 * el servidor, esto es lo que hay que portar.
 *
 * Los mensajes dicen siempre qué falta y qué hacer. "Campo obligatorio" no es
 * un mensaje de error, es una etiqueta.
 */
export const PRODUCT_FORM_RULES = {
    name: {
        required: copy.validation.nameRequired,
        maxLength: {
            value: PRODUCT_NAME_LIMITS.max,
            message: formatMessage(copy.validation.nameMax, {
                max: PRODUCT_NAME_LIMITS.max,
            }),
        },
        // Se valida sobre el texto sin espacios de los extremos: tres espacios
        // seguidos cumplen cualquier `minLength` y no son un nombre.
        validate: (value: string) =>
            value.trim().length >= PRODUCT_NAME_LIMITS.min ||
            formatMessage(copy.validation.nameMin, {
                min: PRODUCT_NAME_LIMITS.min,
            }),
    } satisfies FieldRules<"name">,

    category: {
        required: copy.validation.categoryRequired,
    } satisfies FieldRules<"category">,

    description: {
        maxLength: {
            value: PRODUCT_DESCRIPTION_MAX,
            message: formatMessage(copy.validation.descriptionMax, {
                max: PRODUCT_DESCRIPTION_MAX,
            }),
        },
    } satisfies FieldRules<"description">,
} as const;

/* -------------------------------------------------------------------------- */
/*  Imagen                                                                     */
/* -------------------------------------------------------------------------- */

/**
 * Qué se acepta como foto del producto.
 *
 * Formatos web: nada de HEIC ni TIFF, que el navegador no sabe previsualizar
 * y acabarían en una tarjeta vacía. El tope de 5 MB es holgado para una foto
 * de plato ya recortada y corta de raíz las que vienen directas de la cámara
 * sin comprimir.
 */
export const PRODUCT_IMAGE_TYPES = [
    "image/png",
    "image/jpeg",
    "image/webp",
] as const;

export const PRODUCT_IMAGE_MAX_BYTES = 5 * 1024 * 1024;

/** Valor del atributo `accept` del `<input type="file">`. */
export const PRODUCT_IMAGE_ACCEPT = PRODUCT_IMAGE_TYPES.join(",");

/** `PNG, JPG o WEBP` — la misma lista, en prosa. */
export const PRODUCT_IMAGE_FORMATS_LABEL = copy.image.formats;

/** `4,2 MB` · `860 KB` — peso del archivo elegido. */
export function formatFileSize(bytes: number): string {
    const megabytes = bytes / (1024 * 1024);

    if (megabytes >= 1) {
        return `${megabytes.toFixed(1).replace(".", ",")} MB`;
    }

    return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

/**
 * ¿Sirve este archivo como foto del producto?
 *
 * Devuelve el motivo del rechazo, no un booleano: el mensaje tiene que decir
 * qué pasó y cómo arreglarlo, y quien llama no debería tener que redactarlo.
 *
 * Queda fuera de `PRODUCT_FORM_RULES` porque no es una regla del formulario
 * sino del archivo: se comprueba al elegirlo, y un archivo rechazado nunca
 * llega a ser el valor del campo. La foto en sí es opcional.
 */
export function validateProductImage(file: File): string | null {
    const isAllowedType = (PRODUCT_IMAGE_TYPES as readonly string[]).includes(
        file.type
    );

    if (!isAllowedType) {
        return formatMessage(copy.image.invalidType, {
            formats: PRODUCT_IMAGE_FORMATS_LABEL,
        });
    }

    if (file.size > PRODUCT_IMAGE_MAX_BYTES) {
        return formatMessage(copy.image.tooLarge, {
            size: formatFileSize(file.size),
            max: formatFileSize(PRODUCT_IMAGE_MAX_BYTES),
        });
    }

    return null;
}
