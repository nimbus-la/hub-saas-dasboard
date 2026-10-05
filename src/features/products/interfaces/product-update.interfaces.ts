import type { CreateProductParams } from "./product-create.interfaces";


/**
 * Cuerpo de la edición de un producto.
 *
 * Es parcial: además del id solo viaja lo que cambió, y lo que no se envía se
 * queda como estaba. La receta es la excepción, porque si se manda reemplaza
 * entera a la anterior.
 *
 * `productStatus` solo se envía para activar o desactivar de verdad. Mandarlo
 * con el mismo valor que ya tiene el producto hace que el backend rechace toda
 * la edición.
 */
export type UpdateProductParams = { productId: string } & Partial<CreateProductParams> & {
    productStatus?: boolean;
};
