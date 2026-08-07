import { cva } from "class-variance-authority";

import { SPACING_CLASS } from "@/tokens";


/**
 * Estilos de ProductBasicsStep
 *
 * Dos ritmos, como en la lista de productos: `gap-6` entre los dos bloques del
 * paso —los datos escritos y la foto— y `gap-4` entre campos, que es el alias
 * `field` del sistema. Que el interior vaya más apretado que el exterior es lo
 * que hace que los campos se lean como un grupo y la imagen como otra cosa.
 */


/** Cuerpo del paso. */
export const productBasicsStepVariants = cva([
    "flex flex-col border-0 p-0",
    SPACING_CLASS.gap.xl,
]);


/**
 * Rejilla de campos escritos.
 *
 * Dos columnas a partir de `md`: nombre y categoría se deciden a la vez y en
 * una sola columna quedan a media pantalla de distancia. Por debajo de ese
 * ancho la columna doble dejaría el selector en 160px, que no da ni para el
 * nombre de la categoría más larga.
 */
export const productBasicsGridVariants = cva([
    "grid grid-cols-1 md:grid-cols-2",
    SPACING_CLASS.gap.lg,
]);


/** Campo que ocupa la fila entera. */
export const productBasicsFullRowVariants = cva(["md:col-span-2"]);
