import type { ApiEnvelope, ApiResponseWithPagination, HttpRequestConfig, PaginationParams } from "@/interfaces";
import type { Product } from "@/lib/products";

import type { CreateProductParams } from "./product-create.interfaces";
import type { DeleteProductParams, UpdateProductParams } from "./product-update.interfaces";
import type { Profitability, ProfitabilityInput } from "./profitability.interfaces";


// El backend sacó las recetas del producto y con ellas se fueron los insumos de
// la respuesta. Se deja la forma anterior comentada porque las recetas van a
// volver, y entonces el producto traerá otra vez sus insumos con existencias.
//
// /**
//  * Un insumo de la receta tal como llega dentro del producto. Las cantidades y
//  * los costos vienen como texto decimal.
//  */
// export interface ProductIngredientApiResponse {
//     id: string;
//     inventoryItemId: string;
//     name: string;
//     quantity: string;
//     unitOfMeasure: string;
//     unitCostAmount: string;
//     lineCostAmount: string;
//     isOptional: boolean;
//
//     /** Indica si hay existencias para preparar el producto. */
//     hasStock: boolean;
// }
//
// /** Producto con receta, como lo enviaba el backend antes de quitarlas. */
// export interface ProductApiResponse {
//     id: string;
//     tenantId: string;
//     productCategoryId: string;
//     nameProductCategory: string;
//     productName: string;
//     productDescription: string | null;
//     productSku: string;
//     productBasePrice: string;
//     costCurrency: string;
//     profitMargin: string;
//     status: ProductApiStatus;
//     ingredients: ProductIngredientApiResponse[];
//     createdAt: string;
//     updatedAt: string;
// }


/**
 * Estado del producto como lo escribe el backend. Solo dice si está en la
 * carta.
 */
export type ProductApiStatus = "ACTIVE" | "INACTIVE";


/**
 * Producto tal como lo envía el backend. Los montos llegan como texto decimal,
 * por ejemplo `"4500.00"`.
 */
export interface ProductApiResponse {
    id: string;
    sku: string;
    name: string;
    categoryId: string;
    /** Solo la trae el listado; un producto recién creado puede llegar sin ella. */
    categoryName?: string;
    /** Es opcional al crear, así que puede llegar vacía. */
    description: string | null;
    imageUrl?: string | null;

    /** Precio de venta. */
    price: string;
    /** Lo que cuesta preparar una porción. Lo escribe la persona, no sale de una receta. */
    cost: string;
    currency: string;
    /**
     * Parte del precio que es ganancia, de 0 a menos de 100. Es sobre el
     * precio, no sobre el costo: con costo 4.000 y precio 10.000 da `"60.00"`.
     */
    targetMargin: string;

    /** En `INACTIVE` el producto se retiró de la carta. */
    status: ProductApiStatus;

    /** Fechas en formato ISO 8601. */
    createdAt: string;
    updatedAt: string;
}


/**
 * Filtros del listado, con los mismos nombres que usa el backend. El texto se
 * busca en el nombre y en el SKU. Un filtro sin elegir no se envía.
 */
export interface ProductFilters {
    text?: string;
    categoryId?: string;
}


/** Página y filtros juntos. Se usan como clave de caché. */
export type ProductListParams = PaginationParams & ProductFilters;


/** Operaciones disponibles sobre los productos. */
export interface ProductsService {
    /** Devuelve una página del catálogo con los filtros ya aplicados. */
    list(
        params: ProductListParams,
        config?: HttpRequestConfig
    ): Promise<ApiResponseWithPagination<Product[]>>;

    /**
     * Un producto completo, tal como llega del backend, o `null` si no existe
     * en el negocio. Se deja sin convertir porque quien lo pide es el
     * formulario, y la tarjeta del listado no trae lo que este necesita.
     */
    getById(
        productId: string,
        config?: HttpRequestConfig
    ): Promise<ProductApiResponse | null>;

    /** Crea un producto y devuelve cómo quedó guardado. */
    create(
        payload: CreateProductParams,
        config?: HttpRequestConfig
    ): Promise<ApiEnvelope<ProductApiResponse>>;

    /** Cambia solo lo que venga en el cuerpo. El backend responde sin datos. */
    update(
        payload: UpdateProductParams,
        config?: HttpRequestConfig
    ): Promise<ApiEnvelope<null>>;

    /** Elimina el producto. El backend responde sin datos. */
    delete(
        payload: DeleteProductParams,
        config?: HttpRequestConfig
    ): Promise<ApiEnvelope<null>>;

    /**
     * Calcula precio, margen y el resto de indicadores a partir del costo y
     * del precio o el margen. No guarda nada.
     */
    calculateProfitability(
        input: ProfitabilityInput,
        config?: HttpRequestConfig
    ): Promise<Profitability>;
}
