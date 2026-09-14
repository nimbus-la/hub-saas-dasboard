// ── Dominio: alta de un producto ────────────────────────────────────────────
// Los pasos del formulario, los límites de cada campo y las reglas que dicen
// si un valor sirve. Vive fuera de la pantalla por el mismo motivo que
// `products.ts`: cuando el alta la valide también el backend, las dos partes
// tienen que estar mirando los mismos números, y una constante compartida es
// más barata de sincronizar que un `if` repetido en dos sitios.
//
// Aquí no hay una sola clase de Tailwind ni un solo componente: es texto y
// reglas. La pantalla decide cómo se pintan.


import { formatMessage, messages } from "@/messages";

/** Atajo al bloque del catálogo que da nombre a todo lo de este archivo. */
const copy = messages.products.create;



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
