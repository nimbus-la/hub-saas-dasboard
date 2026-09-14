import { cva } from "class-variance-authority";

import { SPACING_CLASS, TYPOGRAPHY } from "@/tokens";


/**
 * Estilos de RecipeTable
 *
 * La tabla la dibuja `DataTable`. Aquí solo va lo propio de la receta, que es
 * el tinte de los insumos agotados, el ancho de las columnas y cómo se ve el
 * contenido de cada celda.
 */


/**
 * Ancho de cada columna, para pasarlo en el `meta` de la columna.
 *
 * El insumo tiene un ancho mínimo porque su nombre se recorta con puntos
 * suspensivos. Sin ese mínimo, en una pantalla estrecha la columna se encoge
 * hasta dejar el nombre en dos letras, y así la tabla prefiere desplazarse de
 * lado.
 *
 * La cantidad es la columna más ancha de las fijas porque debajo del campo
 * aparece el mensaje de error, y con menos espacio ese mensaje ocupa tres o
 * cuatro líneas.
 */
export const RECIPE_COLUMN_CLASS = {
    ingredient: "min-w-56",
    quantity: "w-52",
    stock: "w-36",
} as const;


/**
 * Fila de un insumo agotado.
 *
 * Se pinta cada celda y no el `<tr>`, porque el fondo de la fila no tapa el
 * hover que `DataTable` le pone a las celdas. Se usa el tono `lighter` para
 * que el campo blanco y el botón de la fila no parezcan manchas encima.
 */
export const recipeTableRowVariants = cva([], {
    variants: {
        outOfStock: {
            true: "[&>td]:bg-error-lighter",
            false: "",
        },
    },
    defaultVariants: { outOfStock: false },
});


/* -------------------------------------------------------------------------- */
/*  Insumo                                                                     */
/* -------------------------------------------------------------------------- */

/**
 * Nombre del insumo. En un insumo agotado el texto pasa al tono más oscuro
 * del rojo para que se siga leyendo bien sobre el fondo teñido.
 */
export const recipeNameVariants = cva([], {
    variants: {
        outOfStock: {
            true: "text-error-darker",
            false: "",
        },
    },
    defaultVariants: { outOfStock: false },
});


/** Línea del SKU y la etiqueta de perecedero. */
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


/** El SKU va en letra monoespaciada porque es un código y no una palabra. */
export const recipeSkuVariants = cva(["truncate", TYPOGRAPHY.code]);


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
 * La palabra debajo del stock, "disponible" o "Agotado". Como la palabra
 * cambia, el estado se entiende aunque no se distingan los colores.
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
