import { cva } from "class-variance-authority";

import {
    CONTROL_SIZE,
    DURATION_CLASS,
    ELEVATION,
    RADIUS_SEMANTIC,
    SPACING_CLASS,
    SPACING_SEMANTIC,
    TYPOGRAPHY,
    Z_INDEX_CLASS,
} from "@/tokens";


/**
 * Estilos de ConfirmDialog
 *
 * Traducción al sistema del `alert-dialog` de shadcn. El original resolvía la
 * cabecera con una rejilla de tres filas y cuatro variantes cruzadas
 * (`has-data-[slot=…]:grid-rows-[auto_auto_1fr]`,
 * `sm:group-data-[size=default]/alert-dialog-content:place-items-start`…) para
 * que el icono se pusiera al lado del texto en escritorio y encima en móvil.
 * Aquí el diálogo tiene un único formato porque es un componente cerrado y no
 * un juego de piezas: la decisión ya está tomada, y con ella se va la mitad
 * del CSS.
 *
 * El formato es **centrado**: medallón arriba, pregunta debajo, y el pie
 * separado por una línea a sangre. Es el de una pregunta, no el de un panel de
 * trabajo, y esa es la diferencia que interesa: el diálogo no continúa la
 * pantalla, la interrumpe. El eje central lo dice antes de leer nada.
 *
 * La línea del pie separa decir de hacer: arriba, lo que va a pasar; abajo, la
 * decisión. El panel no lleva relleno propio —lo pone cada sección—, que es lo
 * que permite que esa línea llegue de borde a borde sin el `-mx-4 -mb-4` con el
 * que shadcn sacaba el pie fuera del panel, un truco que se descuadra en cuanto
 * cambia el relleno.
 */


/** Velo de fondo. Mismo criterio de capa que el Modal: ver `modal.style.ts`. */
export const confirmDialogBackdropVariants = cva([
    "fixed inset-0 isolate",
    Z_INDEX_CLASS.modal,
    "bg-neutral-900/40 supports-backdrop-filter:backdrop-blur-xs",

    DURATION_CLASS.normal,
    "data-open:animate-in data-open:fade-in-0",
    "data-closed:animate-out data-closed:fade-out-0",
    "motion-reduce:animate-none motion-reduce:transition-none",
]);


/**
 * Panel.
 *
 * `max-w-sm` fijo y sin eje de tamaño: una confirmación que no cabe en un
 * panel estrecho es que está explicando de más, y en un formato centrado el
 * ancho corto es además lo que mantiene cortas las líneas. La geometría del
 * centrado en pantalla es la misma del Modal y por el mismo motivo,
 * documentado allí.
 *
 * Sin relleno: lo ponen el cuerpo y el pie, que es lo que deja la línea a
 * sangre. El `overflow-hidden` recorta el fondo del pie contra el radio de las
 * esquinas.
 */
export const confirmDialogPopupVariants = cva([
    "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
    Z_INDEX_CLASS.modal,

    "flex w-[calc(100%-2rem)] max-w-sm max-h-[calc(100dvh-2rem)] flex-col overflow-hidden",

    RADIUS_SEMANTIC.overlay,
    "border border-neutral-200 bg-white text-neutral-800",
    ELEVATION["2xl"].class,
    TYPOGRAPHY.bodyMd,
    "outline-none",

    DURATION_CLASS.normal,
    "data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95",
    "data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
    "motion-reduce:animate-none motion-reduce:transition-none",
]);


/**
 * Cuerpo: medallón arriba, textos debajo, todo sobre el eje central.
 *
 * Es la única parte que crece, así que es la que scrollea si la descripción se
 * alarga; el pie se queda quieto y las acciones nunca se van de la vista.
 */
export const confirmDialogBodyVariants = cva([
    "flex min-h-0 flex-col items-center overflow-y-auto text-center",
    SPACING_SEMANTIC.card,
    SPACING_CLASS.gap.lg,
]);


/**
 * Medallón del icono.
 *
 * Círculo de 56px con el icono a 24 dentro: el aro de color es lo primero que
 * se ve al abrir y dice de qué va la pregunta antes de leer el título. El lado
 * sale de `CONTROL_SIZE["2xl"]` —la caja más grande del sistema— y el icono,
 * de su propio `iconSize`, así que los dos crecen juntos si la escala cambia.
 *
 * El tono no es el rojo sólido del botón que confirma: un fondo suave con el
 * glifo oscuro avisa sin gritar, y deja que el único elemento saturado del
 * diálogo sea el botón que ejecuta la acción.
 */
export const confirmDialogMediaVariants = cva(
    [
        "flex shrink-0 items-center justify-center",
        CONTROL_SIZE["2xl"].squareClass,
        RADIUS_SEMANTIC.pill,
    ],
    {
        variants: {
            tone: {
                danger: "bg-error-lighter text-error-dark",
                primary: "bg-primary-main/10 text-primary-dark",
            },
        },

        defaultVariants: { tone: "danger" },
    }
);


/** Columna de título y descripción. */
export const confirmDialogHeadingVariants = cva([
    "flex w-full min-w-0 flex-col",
    SPACING_CLASS.gap.sm,
]);


/** Título: la pregunta, en una línea. */
export const confirmDialogTitleVariants = cva([
    "text-neutral-800",
    TYPOGRAPHY.h5,
]);


/**
 * Descripción: qué se borra y qué se pierde con ello.
 *
 * `text-balance` reparte las líneas para que la última no quede con una sola
 * palabra, que en un texto centrado y corto se nota mucho.
 */
export const confirmDialogDescriptionVariants = cva([
    "text-balance text-neutral-600",
    TYPOGRAPHY.bodyMd,
]);


/**
 * Pie de acciones.
 *
 * La línea superior es el separador, y llega de borde a borde porque el
 * relleno vive aquí y no en el panel. El fondo hundido no es decoración: marca
 * que esta banda es la decisión y no más texto que leer.
 *
 * Las dos acciones reparten el ancho a partes iguales, que es lo que mantiene
 * el eje central del diálogo: una fila de botones pegada a un lado lo rompería
 * justo debajo de un texto centrado. En móvil se apilan con "Cancelar" abajo,
 * más cerca del pulgar: la salida es lo que debe quedar a mano, no el borrado.
 */
export const confirmDialogFooterVariants = cva([
    "flex shrink-0 flex-col-reverse sm:flex-row sm:items-center sm:justify-center",
    "border-t border-neutral-200 bg-neutral-100",
    SPACING_CLASS.paddingX.xl,
    SPACING_CLASS.paddingY.lg,
    SPACING_CLASS.gap.md,
]);


/**
 * Botones del pie.
 *
 * A ancho completo en móvil y a mitad de fila en escritorio: ninguno de los
 * dos pesa más por tamaño, el peso lo pone el color.
 *
 * El borde del "Cancelar" es la única clase que se sale del `cva` del botón, y
 * hace falta: sobre el gris del pie, un botón sin borde ni fondo se lee como
 * texto suelto y no como algo que se pulsa.
 *
 * El "Cancelar" va en `ghost` y no en `secondary` por contraste: la etiqueta de
 * `secondary` es `neutral-500`, que sobre este fondo da 2,7:1 y no llega al
 * 4,5:1 que pide una etiqueta de control. La de `ghost` es `neutral-600` —
 * 4,9:1— y además su fondo transparente ya se lee como blanco sobre una banda
 * casi blanca, así que no hace falta pintarlo. Corregirlo con una clase de
 * color encima habría dejado dos `text-*` compitiendo, y cuál gana lo decide el
 * orden del stylesheet, no este archivo.
 */
export const confirmDialogActionVariants = cva(["w-full sm:flex-1"], {
    variants: {
        role: {
            cancel: "border border-neutral-300",
            confirm: "",
        },
    },

    defaultVariants: { role: "confirm" },
});
