import { cva } from "class-variance-authority";

import {
    FOCUS_RING,
    FONT_WEIGHT_CLASS,
    ROW_HEIGHT_CLASS,
    SPACING_CLASS,
    SPACING_SEMANTIC,
    TRANSITION,
    TYPOGRAPHY,
} from "@/tokens";


/**
 * Estilos de DataTable
 *
 * TanStack Table es headless: no trae una sola clase, así que aquí no hay
 * especificidad prestada contra la que pelear. Lo que sí hay es un contrato —
 * `meta.headerClassName` y `meta.cellClassName`, con los que una columna afina
 * su presentación—. Esas clases se aplican SIEMPRE al final del `cn()`, para
 * que tailwind-merge las deje ganar sobre la base.
 *
 * El alto de fila sale de `ROW_HEIGHT.md` (48px) en vez de calcularse con
 * relleno vertical. Puesto en el `td` actúa como mínimo: las filas de una línea
 * miden exactamente el escalón y las que llevan celdas de dos líneas —título y
 * subtítulo— crecen sin pelearse con él.
 */


/**
 * Ancho mínimo antes de activar el scroll horizontal.
 *
 * Es el punto de corte `sm` (640px): por debajo, las celdas se comprimen hasta
 * volverse ilegibles. Va como valor arbitrario porque la escala de contenedores
 * de Tailwind no tiene un escalón de 40rem, y es un umbral de layout, no una
 * medida de la retícula.
 */
const MIN_TABLE_WIDTH = "min-w-[40rem]";


/** Carril con scroll horizontal. */
export const dataTableScrollerVariants = cva(["w-full min-w-0 overflow-x-auto"]);


/**
 * Tabla.
 *
 * `border-separate` permite redondear las esquinas del encabezado; por eso las
 * líneas divisorias van en las celdas y no en la fila.
 */
export const dataTableVariants = cva([
    "w-full border-separate border-spacing-0",
    TYPOGRAPHY.bodyMd,
    MIN_TABLE_WIDTH,
]);


/**
 * Celda de encabezado.
 *
 * El semibold es el caso que la propia documentación pone como ejemplo de
 * `FONT_WEIGHT_CLASS`: una celda de tabla que se destaca. Sin él, el
 * encabezado pesaría lo mismo que el dato que rotula.
 *
 * El radio se queda en `lg` y no sube a `RADIUS_SEMANTIC.surface`: la banda del
 * encabezado va dentro del panel de la tabla, y un hijo más redondeado que su
 * contenedor se lee como un error de montaje.
 */
export const dataTableHeaderCellVariants = cva([
    "bg-neutral-100",
    SPACING_CLASS.paddingX.lg,
    SPACING_CLASS.paddingY.md,
    TYPOGRAPHY.labelSm,
    FONT_WEIGHT_CLASS.semibold,
    "whitespace-nowrap text-neutral-600",
    "first:rounded-l-lg last:rounded-r-lg",
]);


/** Botón de ordenamiento dentro del encabezado. */
export const dataTableSortButtonVariants = cva(
    [
        "group inline-flex cursor-pointer items-center rounded-sm",
        SPACING_SEMANTIC.inline,
        TRANSITION.colors,
        "hover:text-neutral-800",
        FOCUS_RING.offset,
    ],
    {
        variants: {
            // En una columna alineada a la derecha el indicador va delante del
            // rótulo, para que el conjunto siga pegado al borde de la celda.
            align: {
                left: "",
                center: "",
                right: "flex-row-reverse",
            },
        },
        defaultVariants: { align: "left" },
    }
);


/**
 * Indicador de ordenamiento.
 *
 * La columna activa se distingue por opacidad y peso de gris, no por color: la
 * paleta del encabezado se mantiene neutral de principio a fin.
 */
export const dataTableSortIconVariants = cva(["shrink-0", TRANSITION.opacity], {
    variants: {
        active: {
            true: "text-neutral-700",
            false: "text-neutral-500 opacity-40 group-hover:opacity-100",
        },
    },
    defaultVariants: { active: false },
});


/** Fila del cuerpo. */
export const dataTableRowVariants = cva([
    TRANSITION.colors,
    "hover:bg-neutral-50",
    "data-[selected=true]:bg-primary-lighter/25",
    "last:[&>td]:border-b-0",
]);


/** Celda del cuerpo. El alto sale de la receta; el relleno solo lo acompaña. */
export const dataTableCellVariants = cva([
    "border-b border-neutral-200",
    ROW_HEIGHT_CLASS.md,
    SPACING_CLASS.paddingX.lg,
    SPACING_CLASS.paddingY.md,
    TYPOGRAPHY.bodyMd,
    "text-neutral-600",
]);


/** Estado vacío: ocupa la tabla entera con el aire de una sección. */
export const dataTableEmptyVariants = cva([
    SPACING_CLASS.paddingX.lg,
    SPACING_CLASS.paddingY["2xl"],
    "text-center text-neutral-500",
    TYPOGRAPHY.bodyMd,
]);
