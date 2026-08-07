import { cva } from "class-variance-authority";

import { genericButtonVariants } from "@/components/buttons/generic-button.style";
import {
    DURATION_CLASS,
    ELEVATION,
    RADIUS_SEMANTIC,
    SPACING_CLASS,
    SURFACE_SIZE,
    TYPOGRAPHY,
    Z_INDEX_CLASS,
} from "@/tokens";


/**
 * Estilos de Modal
 *
 * Traducción al sistema del `dialog` de shadcn. Lo que venía de fuera apuntaba
 * a variables que aquí no existen —`bg-popover`, `text-popover-foreground`,
 * `bg-muted/50`, `ring-foreground/10`— y escribía su propia escala: `p-4`,
 * `rounded-xl`, `text-sm` y `z-50` a mano. Ahora el panel sale de
 * `SURFACE_SIZE.xl`, el radio de `RADIUS_SEMANTIC.overlay`, la sombra de
 * `ELEVATION["2xl"]` y la capa de `Z_INDEX`.
 *
 * Dos cosas se decidieron aquí y no en los tokens:
 *
 * **El pie ya no es una banda gris a sangre.** El original se salía del panel
 * con `-mx-4 -mb-4` para pintar un fondo `bg-muted/50` de borde a borde. Eso
 * ata el pie al relleno exacto del panel: al cambiar `p-4` por `p-6` la banda
 * se descuadra y nadie se acuerda de por qué. Aquí los botones van dentro del
 * relleno, que es lo que hace el resto del panel.
 *
 * **El botón de cerrar vive en la cabecera, no flotando.** El original lo
 * colocaba en `absolute top-2 right-2`, lo que obliga a reservarle sitio con
 * un `pr` a ojo en el título para que el texto no le pase por debajo. Como
 * fila, el `gap` se encarga solo.
 */


/**
 * Velo de fondo.
 *
 * Va en la capa `modal` y no en `overlay` (40): ese escalón es el velo del
 * drawer, que tiene que quedar por debajo del sidebar en móvil. El velo de un
 * diálogo tapa también ese chrome. Comparte capa con el panel y queda debajo
 * por orden del DOM —se pinta antes dentro del mismo portal—, que es lo que
 * evita tener que inventarse un escalón intermedio.
 */
export const modalBackdropVariants = cva([
    "fixed inset-0 isolate",
    Z_INDEX_CLASS.modal,
    "bg-neutral-900/40 supports-backdrop-filter:backdrop-blur-xs",

    DURATION_CLASS.normal,
    "data-open:animate-in data-open:fade-in-0",
    "data-closed:animate-out data-closed:fade-out-0",
    "motion-reduce:animate-none motion-reduce:transition-none",
]);


/**
 * Panel del diálogo.
 *
 * La geometría del centrado va junta a propósito y no sale de la escala:
 * `w-[calc(100%-2rem)]` deja 16px (`SPACING.lg`) de margen a cada lado en
 * móvil —el panel es `fixed`, así que ese 100% es el ancho de la ventana— y
 * `max-h-[calc(100dvh-2rem)]` hace lo propio en vertical, con `dvh` para que
 * la barra del navegador móvil no recorte el pie. Sustituir cualquiera de los
 * dos por un escalón suelto descuadra el otro.
 *
 * El ancho máximo sí es una decisión con nombre: cuatro escalones de la escala
 * de contenedores de Tailwind, que es la que mide anchos de lectura.
 */
export const modalPopupVariants = cva(
    [
        "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
        Z_INDEX_CLASS.modal,

        "flex w-[calc(100%-2rem)] max-h-[calc(100dvh-2rem)] flex-col overflow-y-auto",
        SURFACE_SIZE.xl.paddingClass,
        SURFACE_SIZE.xl.gapClass,

        RADIUS_SEMANTIC.overlay,
        "border border-neutral-200 bg-white text-neutral-800",
        ELEVATION["2xl"].class,
        TYPOGRAPHY.bodyMd,

        // El panel recibe el foco al abrir cuando no hay nada tabulable
        // dentro; sin esto el navegador le pinta su propio contorno.
        "outline-none",

        DURATION_CLASS.normal,
        "data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95",
        "data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
        "motion-reduce:animate-none motion-reduce:transition-none",
    ],
    {
        variants: {
            size: {
                /** Confirmaciones y avisos de una sola frase. */
                sm: "max-w-sm",
                /** Por defecto: un formulario corto. */
                md: "max-w-md",
                /** Formularios de varios campos. */
                lg: "max-w-lg",
                /** Contenido con tabla o vista previa. */
                xl: "max-w-2xl",
            },
        },

        defaultVariants: { size: "md" },
    }
);


/** Cabecera: textos a la izquierda, botón de cerrar a la derecha. */
export const modalHeaderVariants = cva([
    "flex items-start justify-between",
    SPACING_CLASS.gap.lg,
]);


/** Columna de título y bajada. Forman un bloque, de ahí el `gap-1`. */
export const modalHeadingVariants = cva([
    "flex min-w-0 flex-col",
    SPACING_CLASS.gap.xs,
]);


/**
 * Título del diálogo.
 *
 * `h5` (18/26) y no el `text-base` de shadcn: es el escalón de la rampa que
 * corresponde a un encabezado de superficie, un punto por debajo del título de
 * pantalla (`h3`) para que un modal abierto no compita con la página.
 */
export const modalTitleVariants = cva([
    "text-neutral-800",
    TYPOGRAPHY.h5,
]);


/** Bajada: qué se va a hacer o qué consecuencia tiene aceptar. */
export const modalDescriptionVariants = cva([
    "text-neutral-600",
    TYPOGRAPHY.bodyMd,
]);


/**
 * Botón de cerrar.
 *
 * Se pinta con el `cva` de GenericButton en vez de duplicar sus clases. Va en
 * `sm`: es una salida, no una acción de la pantalla.
 */
export const modalCloseVariants = cva([
    genericButtonVariants({ variant: "ghost", size: "sm", iconOnly: true }),
    "shrink-0 text-neutral-500 hover:text-neutral-800",
]);


/** Cuerpo. El `min-w-0` deja que el contenido largo se encoja en vez de estirar el panel. */
export const modalBodyVariants = cva([
    "flex min-w-0 flex-col",
    SPACING_CLASS.gap.lg,
]);


/**
 * Pie de acciones.
 *
 * En móvil se apila en `column-reverse` para que la acción principal —la
 * última del DOM, que es el orden que espera un lector de pantalla— quede
 * arriba, junto al pulgar.
 */
export const modalFooterVariants = cva([
    "flex flex-col-reverse sm:flex-row sm:justify-end",
    SPACING_CLASS.gap.md,
]);
