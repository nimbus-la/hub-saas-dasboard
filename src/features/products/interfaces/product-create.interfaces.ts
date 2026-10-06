/**
 * Una línea de la receta tal como la espera el backend. La cantidad viaja
 * como texto decimal, igual que la devuelve en el listado.
 */
export interface CreateProductRecipeLineParams {
    inventoryItemId: string;
    quantity: string;
    isOptional: boolean;
}


/**
 * Cuerpo del alta de un producto.
 *
 * Es estricto a propósito: la disponibilidad y la configuración por sucursal
 * existen en el formulario pero el backend todavía no las recibe, así que
 * mandarlas es un error de compilación y no un campo que se ignora en
 * silencio.
 */
export interface CreateProductParams {
    productCategoryId: string;
    productName: string;

    /** No se envía si está vacía. */
    productDescription?: string;

    /** No se envía mientras no exista la subida de archivos. */
    productImgUrl?: string;

    /** Precio de venta en texto decimal, por ejemplo `"9000"`. */
    productBasePrice: string;

    /** Margen sobre el costo de la receta, en porcentaje. */
    profitMargin: number;

    recipe: CreateProductRecipeLineParams[];
}
