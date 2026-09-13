import { cva } from "class-variance-authority";

import { SPACING_CLASS, TYPOGRAPHY } from "@/tokens";


/**
 * Estilos de RecipeTable
 *
 * La tabla la pinta `DataTable`; aquí solo está lo que la receta decide: el
 * tinte del insumo agotado y cómo se lee cada celda. Los anchos de columna van
 * en `meta`, no aquí: la `<table>` alinea cabecera y celdas sola.
 */


/**
 * Fila del insumo agotado.
 *
 * `error-lighter` y no `error-light`: la fila lleva un campo blanco y un botón,
 * y un fondo más saturado los convertiría en manchas.
 *
 * El tinte va en las celdas y no en el `<tr>`: con `border-separate` una fila
 * no se puede redondear, sus celdas sí. Así la banda repite la forma del
 * encabezado —`rounded-l-lg` en la primera celda, `rounded-r-lg` en la
 * última— y se lee como la misma familia. Pintado en las celdas, además, tapa
 * el `hover:bg-neutral-50` de la fila sin tener que repetirlo.
 *
 * El separador inferior se vuelve transparente: una línea recta bajo una banda
 * redondeada se cortaría contra las curvas de las esquinas.
 *
 * La sombra de 1px del mismo tono tapa la costura entre celdas. Cuando el borde
 * de una celda cae en un píxel fraccionario —el ancho de la tabla depende del
 * contenedor— el navegador suaviza los dos fondos por separado y deja una línea
 * más clara entre ellos. La última celda no la lleva: saldría por fuera de la
 * esquina redondeada.
 */
export const recipeTableRowVariants = cva([], {
    variants: {
        outOfStock: {
            true: [
                "[&>td]:bg-error-lighter",
            ],
            false: "",
        },
    },
    defaultVariants: { outOfStock: false },
});


/* -------------------------------------------------------------------------- */
/*  Insumo                                                                     */
/* -------------------------------------------------------------------------- */

/** Nombre. Sin tinte hereda el gris de `TitleSubtitleCell`. */
export const recipeNameVariants = cva([], {
    variants: {
        outOfStock: {
            // Sobre el tinte el texto sube al tono más oscuro de la familia
            // para seguir por encima de 4,5:1.
            true: "text-error-darker",
            false: "",
        },
    },
    defaultVariants: { outOfStock: false },
});


/** SKU y etiqueta de perecedero. */
export const recipeMetaVariants = cva(
    ["inline-flex min-w-0 items-center", SPACING_CLASS.gap.sm],
    {
        variants: {
            outOfStock: {
                true: "text-error-darker/80",
                false: "",
            },
        },
        defaultVariants: { outOfStock: false },
    }
);


/** Código del insumo. Monoespaciado: es un identificador, no una palabra. */
export const recipeSkuVariants = cva(["truncate", TYPOGRAPHY.code]);


/* -------------------------------------------------------------------------- */
/*  Cantidad                                                                   */
/* -------------------------------------------------------------------------- */

/** Sufijo de unidad dentro del campo. La hereda del insumo. */
export const recipeUnitVariants = cva([
    "select-none text-neutral-600",
    TYPOGRAPHY.labelSm,
]);


/* -------------------------------------------------------------------------- */
/*  Existencias                                                                */
/* -------------------------------------------------------------------------- */

export const recipeStockVariants = cva(["flex flex-col items-end"]);


export const recipeStockValueVariants = cva(
    ["tabular-nums", TYPOGRAPHY.subtitleSm],
    {
        variants: {
            outOfStock: {
                true: "text-error-darker",
                false: "text-neutral-800",
            },
        },
        defaultVariants: { outOfStock: false },
    }
);


/**
 * `disponible` · `Agotado`.
 *
 * La palabra cambia con la existencia, así que el estado no depende del color.
 */
export const recipeStockHintVariants = cva([TYPOGRAPHY.caption], {
    variants: {
        outOfStock: {
            true: "text-error-darker",
            false: "text-neutral-600",
        },
    },
    defaultVariants: { outOfStock: false },
});
