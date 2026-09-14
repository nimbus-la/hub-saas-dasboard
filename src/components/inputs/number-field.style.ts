import { cva } from "class-variance-authority";


/**
 * Estilos de NumberField
 *
 * El marco del campo, la etiqueta, la ayuda y el error son los mismos de
 * `TextField` y se importan de `text-field.style.ts`. Así un campo de número y
 * uno de texto puestos en la misma fila se ven iguales. Aquí solo va lo que
 * cambia por ser un número.
 */


/**
 * El texto del número.
 *
 * Usa cifras de ancho fijo para que el número no se mueva de lado cuando
 * aparecen los puntos de miles mientras se escribe.
 */
export const numberFieldInputVariants = cva(["tabular-nums"]);


/**
 * Prefijo o sufijo, como `$` o `g`. Va en gris y sin selección porque no es
 * parte del valor, solo explica en qué está medido.
 */
export const numberFieldAffixVariants = cva([
    "select-none text-neutral-600",
]);
