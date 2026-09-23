import { cva } from "class-variance-authority";

import { RADIUS_SEMANTIC, SPACING_CLASS, SURFACE_SIZE } from "@/tokens";


/**
 * Estilos del modal de categoría. El Modal del sistema ya pone el panel, la
 * cabecera y el pie, así que aquí solo van los campos. Si este archivo crece,
 * probablemente eso debería estar en el Modal.
 */


/**
 * Campos del formulario, uno debajo del otro. Con menos separación la ayuda
 * de un campo parecería la etiqueta del siguiente.
 */
export const categoryFormModalVariants = cva([
    "flex flex-col",
    SPACING_CLASS.gap.lg,
]);


/**
 * Caja del interruptor de estado. Va en un fondo aparte porque no escribe
 * nada, decide si la categoría se muestra, y así no se confunde con la ayuda
 * de la descripción.
 */
export const categoryFormModalToggleVariants = cva([
    "border border-neutral-200 bg-neutral-100",
    SURFACE_SIZE.lg.paddingClass,
    RADIUS_SEMANTIC.surface,
]);


/** Borde del botón de cancelar, para que no se pierda junto al de guardar. */
export const categoryFormModalCancelVariants = cva(["border border-neutral-300"]);
