import { cva } from "class-variance-authority";

import { genericButtonVariants } from "@/components/buttons/generic-button.style";
import {
    RADIUS_SEMANTIC,
    SPACING_CLASS,
    TYPOGRAPHY,
} from "@/tokens";


/**
 * Estilos de la pantalla del producto, la misma para crear y para editar.
 *
 * Mismo esqueleto que la lista: `gap-6` entre el encabezado y el cuerpo, que
 * son dos bloques distintos. El cuerpo es una sola página con dos tarjetas
 * —datos básicos y precio— y un pie de acciones debajo de las dos, porque
 * guardar se refiere a todo el formulario y no a una de ellas.
 */


/**
 * Contenedor de la pantalla.
 *
 * Ocupa todo el ancho que le deje el armazón, igual que la lista de productos:
 * el encabezado es un título de página y tiene que empezar donde empiezan los
 * de las demás pantallas. El tope de ancho no vive aquí sino en el panel, que
 * es lo único que lo necesita.
 */
export const productFormPageVariants = cva([
    "flex w-full flex-col",
    SPACING_CLASS.gap.xl,
]);


/**
 * El formulario: las dos tarjetas y, debajo, el pie.
 *
 * Tope de `max-w-6xl` (1152px), centrado. Con dos columnas el de 896px del
 * asistente dejaba el precio en menos de 360px, y el desglose partía cada
 * concepto en dos líneas. Más ancho tampoco ayuda: los campos de la izquierda
 * se estirarían sin necesitarlo.
 */
export const productFormVariants = cva([
    "mx-auto flex w-full max-w-6xl flex-col",
    SPACING_CLASS.gap.xl,
]);


/**
 * Las dos columnas.
 *
 * Se abren recién en `xl`. Por debajo, con la barra lateral abierta, a la
 * columna del precio le quedarían unos 300px, y una tarjeta con tres campos y
 * un desglose de cifras no cabe ahí sin apretarse. Antes de eso van una debajo
 * de otra, en el orden en que se llenan.
 *
 * Tres quintos para los datos y dos para el precio: los datos llevan una
 * rejilla de dos campos y la foto; el precio va en una sola columna.
 * `items-start` deja a cada tarjeta con su propia altura.
 */
export const productFormGridVariants = cva([
    "grid grid-cols-1 items-start xl:grid-cols-5",
    SPACING_CLASS.gap.xl,
]);


/**
 * Una tarjeta del formulario.
 *
 * Borde y no sombra, como el panel del asistente: es una superficie estática,
 * y la elevación del sistema está reservada a lo que flota por encima del
 * contenido.
 */
export const productFormSectionVariants = cva(
    ["flex min-w-0 flex-col border border-neutral-200 bg-white", RADIUS_SEMANTIC.surface],
    {
        variants: {
            span: {
                basics: "xl:col-span-3",
                pricing: "xl:col-span-2",
            },
        },
    }
);


/** Cabecera de la tarjeta: qué se llena en ella. */
export const productFormSectionHeaderVariants = cva([
    "flex flex-col border-b border-neutral-200 px-4 py-4 sm:px-6",
    SPACING_CLASS.gap.xs,
]);


export const productFormSectionTitleVariants = cva([
    "text-neutral-900",
    TYPOGRAPHY.subtitleLg,
]);


export const productFormSectionHintVariants = cva([
    "text-neutral-600",
    TYPOGRAPHY.bodySm,
]);


/** Contenido de la tarjeta. Mismo relleno que tenía el cuerpo del asistente. */
export const productFormSectionBodyVariants = cva(["px-4 py-6 sm:px-6"]);


/**
 * Pie de acciones de la página.
 *
 * Es una tarjeta más, debajo de las dos columnas: así se lee como el cierre de
 * todo el formulario y no como parte del precio.
 */
export const productFormPageFooterVariants = cva([
    "flex flex-wrap items-center justify-between",
    "gap-x-4 gap-y-3",
    "border border-neutral-200 bg-white px-4 py-4 sm:px-6",
    RADIUS_SEMANTIC.surface,
]);


// ── Del asistente por pasos ─────────────────────────────────────────────────
// El panel, el cuerpo y el pie de abajo eran los del asistente. Se quedan
// para cuando vuelva con las recetas. La nota, los botones y la salida sí los
// sigue usando la página.


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
export const productFormPanelVariants = cva([
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
export const productFormBodyVariants = cva([
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
export const productFormFooterVariants = cva([
    "flex flex-wrap items-center justify-between",
    "gap-x-4 gap-y-3",
    "border-t border-neutral-200 px-4 py-4 sm:px-6",
]);


/** Nota del pie: qué falta o qué es obligatorio. */
export const productFormFooterNoteVariants = cva([
    "text-neutral-600",
    TYPOGRAPHY.caption,
]);


/** Botones del pie, siempre pegados al margen derecho. */
export const productFormActionsVariants = cva([
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
export const productFormCancelVariants = cva([
    genericButtonVariants({ variant: "ghost", size: "md" }),
]);
