import { cva } from "class-variance-authority";

import { genericButtonVariants } from "@/components/buttons/generic-button.style";
import {
    DURATION_CLASS,
    ELEVATION,
    RADIUS_SEMANTIC,
    SPACING_CLASS,
    TYPOGRAPHY,
    Z_INDEX_CLASS,
} from "@/tokens";


/**
 * Estilos de Modal
 *
 * Traducción al sistema del `dialog` de shadcn. Lo que venía de fuera apuntaba
 * a variables que aquí no existen —`bg-popover`, `text-popover-foreground`,
 * `bg-muted/50`, `ring-foreground/10`— y escribía su propia escala: `p-4`,
 * `rounded-xl`, `text-sm` y `z-50` a mano. Ahora el panel sale de los tokens
 * del sistema: el ritmo vertical del escalón `xl` de la superficie (24px en
 * los extremos), el radio de `RADIUS_SEMANTIC.overlay`, la sombra de
 * `ELEVATION["2xl"]` y la capa de `Z_INDEX`.
 *
 * Tres cosas se decidieron aquí y no en los tokens:
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
 *
 * **El scroll vive en el cuerpo, no en el panel.** El panel original lo
 * desplazaba entero: en un formulario largo, bajar para escribir los últimos
 * campos se llevaba por delante el título y el botón de guardar. Aquí se
 * reparte en tres franjas —cabecera fija, cuerpo con scroll propio, pie fijo—,
 * separadas con el borde que el sistema reserva para separadores, y el pie con
 * sus acciones queda siempre a la vista. Los dos formularios del panel
 * comparten esta estructura desde que nació: la necesitó primero categorías y
 * empleados la pidió en el mismo formato.
 *
 * El reparto vertical usa el ritmo del panel: `24px` en los extremos (el
 * escalón `xl` de la superficie) y `16px` en los bordes interiores (el `lg`
 * de la escala, que es el que separa elementos de un mismo grupo).
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
 *
 * El panel no hace scroll por su cuenta: sin `overflow-y-auto` aquí, ese papel
 * le toca a `modalBodyVariants`. Es lo que deja la cabecera y el pie fijos
 * mientras se mueve sólo el formulario. `overflow-hidden` acompaña al radio
 * del panel y recorta las franjas que quedan dentro.
 */
export const modalPopupVariants = cva(
    [
        "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
        Z_INDEX_CLASS.modal,

        "flex w-[calc(100%-2rem)] max-h-[calc(100dvh-2rem)] flex-col overflow-hidden",

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


/**
 * Cabecera: textos a la izquierda, botón de cerrar a la derecha.
 *
 * `shrink-0` la fija: es la primera franja y no le toca entregar sitio al
 * formulario cuando este crece. El borde bajo la describe la separa del cuerpo
 * y permanece a la vista con el título aunque el contenido se mueva.
 */
export const modalHeaderVariants = cva([
    "flex shrink-0 items-start justify-between",
    SPACING_CLASS.gap.lg,
    SPACING_CLASS.paddingX.xl,
    "pt-6 pb-4",
    "border-b border-neutral-200",
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


/**
 * Cuerpo.
 *
 * Es la única franja que se mueve, y por eso es la que hace scroll: `flex-1`
 * le da todo el sitio que libran las otras dos y `overflow-y-auto` convierte
 * ese sitio en su propio carril. `min-h-0` es la pieza que lo vuelve posible —
 * un hijo `flex` no puede encogerse debajo de su contenido sin él, y entonces
 * el desborde saldría por el panel en vez de quedarse dentro.
 *
 * El `min-w-0` deja que el contenido largo se encoja en vez de estirar el
 * panel. El relleno vertical de `16px` es el que separa el formulario de los
 * dos bordes visibles: la primera y la última posición de cada lista no deben
 * tocar la línea que la cierra.
 */
export const modalBodyVariants = cva([
    "flex min-h-0 min-w-0 flex-1 flex-col",
    SPACING_CLASS.gap.lg,
    SPACING_CLASS.paddingX.xl,
    SPACING_CLASS.paddingY.lg,
    "overflow-y-auto",
]);


/**
 * Pie de acciones.
 *
 * `shrink-0` lo fija, igual que a la cabecera: las acciones de un formulario
 * largo no pueden quedar fuera de vista mientras se escribe el último campo;
 * eso sería tener que guardar a ciegas. El borde lo separa del cuerpo.
 *
 * En móvil se apila en `column-reverse` para que la acción principal —la
 * última del DOM, que es el orden que espera un lector de pantalla— quede
 * arriba, junto al pulgar.
 */
export const modalFooterVariants = cva([
    "flex shrink-0 flex-col-reverse sm:flex-row sm:justify-end",
    SPACING_CLASS.gap.md,
    SPACING_CLASS.paddingX.xl,
    "pt-4 pb-6",
    "border-t border-neutral-200",
]);
