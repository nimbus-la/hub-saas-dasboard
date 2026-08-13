import { cva } from "class-variance-authority";

import { RADIUS_SEMANTIC, SPACING_CLASS, SURFACE_SIZE } from "@/tokens";


/**
 * Estilos de CategoryFormModal
 *
 * Casi todo lo pone el `Modal` del sistema —panel, cabecera, pie y sus
 * separaciones—; aquí solo queda la pila de campos y la caja del interruptor.
 * Si este archivo empieza a crecer, casi siempre significa que algo debería
 * estar en el `Modal` y no en la pantalla.
 */


/**
 * Pila de campos.
 *
 * `gap-4` es la separación entre campos consecutivos de un formulario
 * (`SPACING_SEMANTIC.field` en su versión de `flex`): más aire los desune y
 * menos hace que la ayuda de uno parezca la etiqueta del siguiente.
 */
export const categoryFormModalVariants = cva([
    "flex flex-col",
    SPACING_CLASS.gap.lg,
]);


/**
 * Caja del interruptor de estado.
 *
 * El interruptor va sobre una superficie hundida y no suelto entre los campos
 * porque no es un campo: los otros dos escriben lo que dirá la carta, este
 * decide si la carta la enseña. Separarlo evita además el error de leerlo como
 * la ayuda de la descripción que tiene encima.
 */
export const categoryFormModalToggleVariants = cva([
    "border border-neutral-200 bg-neutral-100",
    SURFACE_SIZE.lg.paddingClass,
    RADIUS_SEMANTIC.surface,
]);


/**
 * Aviso del fallo al guardar.
 *
 * Va arriba del todo y no junto al botón de envío porque el pie del modal
 * puede quedar fuera de la vista si el formulario crece: el motivo por el que
 * no se guardó tiene que estar donde se mira al volver, que es el primer campo.
 *
 * Rojo sobre fondo rojo claro y no solo texto rojo: es el mismo lenguaje que
 * usan los errores de campo, así que se reconoce sin leerlo.
 */
export const categoryFormModalErrorVariants = cva([
    "border border-red-200 bg-red-50 text-sm text-red-700",
    SURFACE_SIZE.lg.paddingClass,
    RADIUS_SEMANTIC.surface,
]);
