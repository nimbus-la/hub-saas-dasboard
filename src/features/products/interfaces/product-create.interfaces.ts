// La receta dejó de viajar en el alta: el backend la quitó y rechaza con 400
// cualquier campo que no declare. Se deja comentada para cuando vuelva.
//
// /**
//  * Una línea de la receta tal como la espera el backend. La cantidad viaja
//  * como texto decimal, igual que la devuelve en el listado.
//  */
// export interface CreateProductRecipeLineParams {
//     inventoryItemId: string;
//     quantity: string;
//     isOptional: boolean;
// }


/**
 * Cuerpo del alta de un producto.
 *
 * Es estricto a propósito: la disponibilidad y la configuración por sucursal
 * existen en el formulario pero el backend todavía no las recibe, así que
 * mandarlas es un error de compilación y no un campo que se ignora en
 * silencio.
 *
 * Precio, costo y margen tienen que cuadrar: el backend rechaza el alta si el
 * precio no deja ese margen sobre el costo. Por eso los tres salen del mismo
 * cálculo de `products/profitability`.
 */
export interface CreateProductParams {
    categoryId: string;
    name: string;

    /** No se envía si está vacía. */
    description?: string;

    /** No se envía mientras no exista la subida de archivos. */
    imageUrl?: string;

    /** Precio de venta en texto decimal, por ejemplo `"9000"`. */
    price: string;

    /** Costo de preparar una porción, en texto decimal. */
    cost: string;

    /**
     * Parte del precio que es ganancia, de 0 a menos de 100, en texto decimal
     * como el precio y el costo.
     */
    targetMargin: string;

    // recipe: CreateProductRecipeLineParams[];
}
