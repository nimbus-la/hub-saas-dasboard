import { cva } from "class-variance-authority";

import { genericButtonVariants } from "@/components/buttons/generic-button.style";
import {
    RADIUS_SEMANTIC,
    SPACING_CLASS,
    TYPOGRAPHY,
} from "@/tokens";


/**
 * Estilos de la pantalla de alta de producto
 *
 * Mismo esqueleto que la lista: `gap-6` entre el encabezado y el cuerpo, que
 * son dos bloques distintos. Lo que cambia es que aquí el cuerpo es un panel
 * cerrado —cabecera, contenido y pie— en vez de una pila abierta: un
 * formulario por pasos necesita un marco que diga dónde empieza y dónde acaba
 * lo que se está editando.
 */


/**
 * Contenedor de la pantalla.
 *
 * Ocupa todo el ancho que le deje el armazón, igual que la lista de productos:
 * el encabezado es un título de página y tiene que empezar donde empiezan los
 * de las demás pantallas. El tope de ancho no vive aquí sino en el panel, que
 * es lo único que lo necesita.
 */
export const createProductPageVariants = cva([
    "flex w-full flex-col",
    SPACING_CLASS.gap.xl,
]);


/**
 * Panel del formulario.
 *
 * Se separa del fondo con borde y no con sombra: es una superficie estática, y
 * la elevación del sistema está reservada a lo que flota por encima del
 * contenido.
 *
 * Aquí sí hay tope —`max-w-4xl`, 896px— y va centrado con `mx-auto`. Sin él el
 * formulario se estiraría a los 1440px del armazón y el ojo tendría que
 * recorrer media pantalla entre la etiqueta y el final del campo.
 *
 * Y ese tope no lo pone el campo más ancho sino el indicador de pasos: tres
 * rótulos con su descripción necesitan unos 240px cada uno, y por debajo de
 * 896px las descripciones empiezan a cortarse con puntos suspensivos. Se midió
 * a 768px, donde "Precio de venta y estado en la carta" llegaba hasta
 * "estado…" — un texto de ayuda truncado no ayuda, ocupa.
 */
export const createProductPanelVariants = cva([
    "flex w-full max-w-4xl flex-col",
    "mx-auto border border-neutral-200 bg-white",
    RADIUS_SEMANTIC.surface,
]);


/**
 * Contenido del paso.
 *
 * El relleno sube a 24px a partir de `sm`. En móvil el ancho es el recurso
 * escaso y cada píxel de relleno se le quita al campo.
 */
export const createProductBodyVariants = cva([
    "px-4 py-6 sm:px-6",
    "focus-visible:outline-none",
]);


/**
 * Pie de acciones.
 *
 * Envuelve antes que apretar: en móvil la nota baja a su propia línea en lugar
 * de estrujar los botones. La separación entre botones es `gap-3`, un escalón
 * por debajo del que los separa de la nota — se leen como un grupo.
 */
export const createProductFooterVariants = cva([
    "flex flex-wrap items-center justify-between",
    "gap-x-4 gap-y-3",
    "border-t border-neutral-200 px-4 py-4 sm:px-6",
]);


/** Nota del pie: qué falta o qué es obligatorio. */
export const createProductFooterNoteVariants = cva([
    "text-neutral-600",
    TYPOGRAPHY.caption,
]);


/** Botones del pie, siempre pegados al margen derecho. */
export const createProductActionsVariants = cva([
    "flex items-center",
    SPACING_CLASS.gap.md,
    "ms-auto",
]);


/**
 * Salida del formulario.
 *
 * Enlace con aspecto de botón terciario, por lo mismo que la flecha del
 * encabezado: cancelar es volver a la lista, y volver es navegar.
 */
export const createProductCancelVariants = cva([
    genericButtonVariants({ variant: "ghost", size: "md" }),
]);
