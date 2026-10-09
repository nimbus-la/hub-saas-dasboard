import type { CreateProductParams } from "./product-create.interfaces";
import type { ProductApiStatus } from "./product-list.interfaces";


/**
 * Cuerpo de la edición de un producto.
 *
 * Es parcial: además del id solo viaja lo que cambió, y lo que no se envía se
 * queda como estaba.
 *
 * Precio, costo y margen son la excepción: si cambia uno, el backend completa
 * los otros con lo guardado y exige que los tres cuadren. Por eso viajan
 * juntos, salidos del mismo cálculo.
 *
 * `status` solo se envía para activar o desactivar de verdad. Mandarlo
 * con el mismo valor que ya tiene el producto hace que el backend rechace toda
 * la edición.
 */
export type UpdateProductParams = { productId: string } & Partial<CreateProductParams> & {
    status?: ProductApiStatus;
};


/** Cuerpo de la baja. Igual que en la edición, el id viaja en el cuerpo. */
export interface DeleteProductParams {
    productId: string;
}
