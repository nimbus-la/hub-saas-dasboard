import { cva } from "class-variance-authority";

import { RADIUS_SEMANTIC, SPACING_CLASS, SURFACE_SIZE } from "@/tokens";


/**
 * Estilos de EmployeeFormModal
 *
 * Casi todo lo pone el `Modal` del sistema —panel, cabecera, pie y sus
 * separaciones—; aquí solo queda la pila de campos, la rejilla de dos columnas
 * y la caja del interruptor. Si este archivo empieza a crecer, casi siempre
 * significa que algo debería estar en el `Modal` y no en la pantalla.
 */


/**
 * Pila de campos.
 *
 * `gap-4` es la separación entre grupos de campos de un formulario
 * (`SPACING_SEMANTIC.field` en su versión de `flex`): más aire los desune y
 * menos hace que la ayuda de uno parezca la etiqueta del siguiente.
 */
export const employeeFormModalVariants = cva([
    "flex flex-col",
    SPACING_CLASS.gap.lg,
]);


/**
 * Rejilla de campos que comparten fila.
 *
 * Nombre y apellido, fecha y sexo, correo y teléfono: cada pareja son dos datos
 * del mismo renglón de un documento, y leerlos en vertical —primero todos los
 * de la columna izquierda y después los de la derecha— obligaría a dar dos
 * pasadas. En pantallas estrechas la rejilla cae a una columna y cada campo
 * recupera el ancho completo.
 */
export const employeeFormModalGridVariants = cva([
    "grid grid-cols-1",
    SPACING_CLASS.gap.md,
    "sm:grid-cols-2",
]);


/**
 * Caja del interruptor de estado.
 *
 * El interruptor va sobre una superficie hundida y no suelto entre los campos
 * porque no es un campo: los otros escriben lo que dirá el registro de la
 * persona; este decide si puede entrar al panel. Separarlo evita además el
 * error de leerlo como la ayuda del campo que tiene encima.
 */
export const employeeFormModalToggleVariants = cva([
    "border border-neutral-200 bg-neutral-100",
    SURFACE_SIZE.lg.paddingClass,
    RADIUS_SEMANTIC.surface,
]);