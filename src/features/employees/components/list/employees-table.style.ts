import { cva } from "class-variance-authority";

import {
    FONT_WEIGHT_CLASS,
    RADIUS_SEMANTIC,
    SPACING_CLASS,
} from "@/tokens";


/**
 * Estilos de EmployeesTable
 *
 * La tabla la pinta `DataTable`; aquí solo está lo que la pantalla decide: el
 * marco que la contiene y cómo se lee cada celda.
 *
 * El marco se separa del fondo con borde y no con sombra —regla del sistema
 * para superficies estáticas— y recorta el contenido con `overflow-hidden`
 * para que el scroll horizontal de la tabla no se salga por las esquinas
 * redondeadas.
 */


/** Panel que contiene la tabla. */
export const employeesTablePanelVariants = cva([
    "w-full min-w-0 overflow-hidden",
    "border border-neutral-200 bg-white",
    RADIUS_SEMANTIC.surface,
    SPACING_CLASS.padding.lg,
    "sm:p-6",
]);


/** Usuario de la plataforma: el dato que se busca al recorrer la tabla. */
export const employeesTableUserNameVariants = cva([
    "text-neutral-800",
    FONT_WEIGHT_CLASS.semibold,
]);


/** Nombre completo, secundario dentro de la fila. */
export const employeesTableNameVariants = cva([
    "text-neutral-600",
]);


/** Correo vacío: la raya, en el gris de lo deshabilitado. */
export const employeesTableEmptyValueVariants = cva([
    "text-neutral-400 select-none",
]);


/**
 * Acciones de la fila.
 *
 * Dos botones `sm` (32px) pegados al margen derecho. `justify-end` los ancla
 * ahí aunque la columna crezca, y `whitespace-nowrap` impide que el segundo
 * caiga a una línea nueva en pantallas estrechas.
 */
export const employeesTableActionsVariants = cva([
    "flex items-center justify-end whitespace-nowrap",
    SPACING_CLASS.gap.xs,
]);


/** Botón de eliminar: el rojo solo aparece al apuntarlo. */
export const employeesTableDeleteVariants = cva([
    "text-neutral-500 hover:text-error-dark",
]);