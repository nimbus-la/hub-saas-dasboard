/**
 * Insumo tal y como lo pinta la receta.
 *
 * Provisional: es el subconjunto que la tabla necesita mientras el módulo de
 * inventario no exista. Cuando llegue, este tipo se sustituye por el suyo.
 */
export interface RecipeIngredient {
    id: string;
    name: string;
    /** Código con el que el almacén identifica el insumo. Es único. */
    sku: string;
    /** Existencias en la unidad del propio insumo. */
    stock: number;
    /** Abreviatura de la unidad: `g`, `ml`, `und`. */
    unit: string;
    /** Nombre de la unidad para la etiqueta accesible: `gramos`. */
    unitName: string;
    isPerishable: boolean;
}


/** Una línea de la receta con su insumo ya resuelto. */
export interface RecipeLine {
    /** Posición en `recipe` del formulario. Es la que nombra el campo y la que se quita. */
    index: number;
    ingredient: RecipeIngredient;
    /** Lo escrito en el campo, igual que `ProductRecipeFormValues.quantity`. */
    quantity: string;
    isOutOfStock: boolean;
}
