import { cva } from "class-variance-authority";

import { SPACING_CLASS } from "@/tokens";


/**
 * Estilos de ProductsGrid
 *
 * Las tarjetas se reparten con `auto-fill` para que la rejilla se recomponga
 * sola en cualquier ancho, sin puntos de ruptura que mantener. La plantilla de
 * columnas es layout, no retícula: el `15rem` es el ancho mínimo por debajo del
 * cual una tarjeta de producto deja de leerse.
 */


/** Panel gobernado por las pestañas de categoría. */
export const productsGridVariants = cva(["min-w-0"]);


/**
 * Rejilla.
 *
 * La separación sube un escalón a partir de `md`: en móvil el ancho es el
 * recurso escaso y en escritorio las tarjetas necesitan aire para leerse como
 * piezas sueltas.
 */
export const productsGridListVariants = cva([
    "grid grid-cols-[repeat(auto-fill,minmax(min(15rem,100%),1fr))]",
    SPACING_CLASS.gap.lg,
    "md:gap-6",
]);


/** Celda de la rejilla. */
export const productsGridItemVariants = cva(["min-w-0"]);
