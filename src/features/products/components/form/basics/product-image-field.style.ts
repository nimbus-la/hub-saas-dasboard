import { cva } from "class-variance-authority";

import {
    AVATAR_SIZE,
    CONTROL_SIZE,
    RADIUS_FULL_CLASS,
    RADIUS_SEMANTIC,
    SPACING_CLASS,
    TRANSITION,
    TYPOGRAPHY,
} from "@/tokens";


/**
 * Estilos de ProductImageField
 *
 * El campo tiene dos caras —zona de suelta y ficha del archivo elegido— y las
 * dos comparten radio de superficie y borde de un píxel, para que cambiar de
 * una a otra no parezca cambiar de componente. Lo único que las distingue es
 * el trazo: discontinuo mientras no hay nada, continuo cuando ya lo hay.
 *
 * La etiqueta, el texto de ayuda y el mensaje de error copian los valores de
 * `text-field.style.ts` en su escalón `md`: puesto debajo del resto de campos,
 * este tiene que enmarcarse igual aunque su interior no se parezca en nada.
 */


/** Pila del campo: etiqueta, ayuda, caja y mensaje. */
export const productImageFieldVariants = cva(["w-full"]);


/** Etiqueta superior — mismo tamaño y separación que los demás campos. */
export const productImageLabelVariants = cva([
    "mb-1 block select-none text-neutral-800",
    TYPOGRAPHY.labelSm,
]);


/**
 * Ayuda del campo.
 *
 * Va encima de la caja y no debajo: aquí explica qué se acepta antes de que
 * alguien arrastre un archivo de 12 MB, y un texto que llega después del
 * intento ya no es ayuda, es consuelo.
 */
export const productImageHintVariants = cva([
    "mb-2 text-neutral-600",
    TYPOGRAPHY.caption,
]);


/**
 * Zona de suelta.
 *
 * El anillo de foco no sale de `FOCUS_RING`: no lo dispara este elemento sino
 * el botón que lleva dentro, así que se hereda con `has-*`, igual que hacen
 * los campos de texto con su `<input>`.
 */
export const productImageDropzoneVariants = cva(
    [
        "flex w-full cursor-pointer flex-col items-center justify-center text-center",
        "border-2 border-dashed bg-white",
        RADIUS_SEMANTIC.surface,
        SPACING_CLASS.gap.md,
        "px-6 py-8",
        TRANSITION.input,
        "has-[button:focus-visible]:ring-2 has-[button:focus-visible]:ring-primary-main/15",
    ],
    {
        variants: {
            /* Mientras el archivo sobrevuela la zona: el borde confirma que se
               puede soltar aquí y no dos centímetros más allá. */
            dragging: {
                true: "border-primary-main bg-primary-lighter/30",
                false: "",
            },
            invalid: {
                true: "border-error-main",
                false: "",
            },
        },
        compoundVariants: [
            {
                dragging: false,
                invalid: false,
                class: "border-neutral-300 hover:border-primary-light hover:bg-neutral-100",
            },
        ],
        defaultVariants: { dragging: false, invalid: false },
    }
);


/**
 * Círculo del icono.
 *
 * 48px — el lado del avatar `lg`. Marca el centro de la zona sin convertirse
 * en el protagonista: lo que hay que leer es la frase que va debajo.
 */
export const productImageIconVariants = cva([
    "flex items-center justify-center bg-neutral-200 text-neutral-600",
    AVATAR_SIZE.lg.sizeClass,
    RADIUS_FULL_CLASS,
]);


/** Bloque de texto de la zona de suelta. */
export const productImageDropzoneTextVariants = cva([
    "flex max-w-sm flex-col",
    SPACING_CLASS.gap.xs,
]);


/** Frase principal: qué hacer. */
export const productImageDropzoneTitleVariants = cva([
    "text-neutral-800",
    TYPOGRAPHY.subtitleMd,
]);


/** Condiciones del archivo. */
export const productImageDropzoneCaptionVariants = cva([
    "text-neutral-600",
    TYPOGRAPHY.caption,
]);


/**
 * Ficha del archivo elegido.
 *
 * Envuelve antes que apretar: en móvil las acciones bajan a su propia línea en
 * lugar de estrujar el nombre del archivo hasta dejarlo en tres letras.
 */
export const productImagePreviewVariants = cva([
    "flex flex-wrap items-center border border-neutral-300 bg-white",
    RADIUS_SEMANTIC.surface,
    SPACING_CLASS.gap.lg,
    SPACING_CLASS.padding.lg,
]);


/**
 * Miniatura de la foto.
 *
 * Cuadrada y de 80px, el avatar `2xl`: es el mismo recorte 1:1 con el que la
 * tarjeta del catálogo publica la imagen, así que lo que se ve aquí es lo que
 * se verá allí.
 */
export const productImageThumbnailVariants = cva([
    "relative shrink-0 overflow-hidden bg-neutral-200",
    AVATAR_SIZE["2xl"].sizeClass,
    AVATAR_SIZE["2xl"].radiusClass,
]);


/** Columna con el nombre y el peso del archivo. */
export const productImagePreviewTextVariants = cva([
    "flex min-w-0 flex-1 flex-col",
    SPACING_CLASS.gap.xs,
]);


/**
 * Nombre del archivo.
 *
 * `break-all` y no `truncate`: el final de un nombre de archivo es lo que lo
 * identifica ("plato-final-v3.jpg"), y cortarlo por ahí deja tres versiones
 * indistinguibles.
 */
export const productImageFileNameVariants = cva([
    "break-all text-neutral-800",
    TYPOGRAPHY.subtitleSm,
]);


/** Peso del archivo. Cifras tabulares: la fila no baila al cambiar de foto. */
export const productImageFileMetaVariants = cva([
    "text-neutral-600 tabular-nums",
    TYPOGRAPHY.caption,
]);


/** Acciones sobre la foto elegida. */
export const productImagePreviewActionsVariants = cva([
    "flex shrink-0 items-center",
    CONTROL_SIZE.sm.gapClass,
]);


/**
 * Mensaje de error del campo.
 *
 * Mismo tamaño y separación que el texto de ayuda del resto de campos, para
 * que el formulario tenga una sola línea de base para sus mensajes.
 */
export const productImageErrorVariants = cva([
    "mt-1 text-error-dark",
    TYPOGRAPHY.caption,
]);
