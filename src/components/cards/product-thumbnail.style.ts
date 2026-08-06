import { cva } from "class-variance-authority";

import { TYPOGRAPHY } from "@/tokens";


/**
 * Estilos de ProductThumbnail
 *
 * Dos capas superpuestas: las iniciales abajo, siempre, y la foto encima
 * cuando existe y carga. El eje `dimmed` apaga la foto de un producto no
 * vendible sin tocar el texto de la tarjeta.
 */


/** Capa que ocupa el marco de la foto. */
export const productThumbnailVariants = cva([
    "absolute inset-0 flex items-center justify-center",
]);


/**
 * Iniciales — respaldo cuando no hay foto y marcador mientras carga.
 *
 * `text-h2` da los 30px de la rampa; el `tracking-wide` se mantiene por encima
 * porque el tracking negativo del titular junta demasiado dos letras sueltas.
 */
export const productThumbnailFallbackVariants = cva(
    [
        "flex items-center justify-center select-none",
        TYPOGRAPHY.h2,
        "tracking-wide",
    ],
    {
        variants: {
            dimmed: {
                true: "text-neutral-600",
                false: "text-neutral-700",
            },
        },
        defaultVariants: { dimmed: false },
    }
);


/**
 * Foto.
 *
 * `cover` y no `contain`: son fotos de plato, y el recorte se lee mejor que
 * dos franjas de fondo.
 */
export const productThumbnailImageVariants = cva(["object-cover"], {
    variants: {
        dimmed: {
            true: "opacity-60 grayscale",
            false: "",
        },
    },
    defaultVariants: { dimmed: false },
});
