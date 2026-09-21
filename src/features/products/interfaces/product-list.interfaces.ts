import type { ApiResponseWithPagination, HttpRequestConfig, PaginationParams } from "@/interfaces";
import type { Product } from "@/lib/products";


/**
 * Un insumo de la receta tal como llega dentro del producto. Las cantidades y
 * los costos vienen como texto decimal.
 */
export interface ProductIngredientApiResponse {
    id: string;
    inventoryItemId: string;
    name: string;
    quantity: string;
    unitOfMeasure: string;
    unitCostAmount: string;
    lineCostAmount: string;
    isOptional: boolean;

    /** Indica si hay existencias para preparar el producto. */
    hasStock: boolean;
}


/** Producto tal como lo envía el backend. */
export interface ProductApiResponse {
    id: string;
    tenantId: string;
    productCategoryId: string;
    nameProductCategory: string;
    productName: string;
    productDescription: string;
    productSku: string;

    /** Precio de venta en texto decimal, por ejemplo `"9000.00"`. */
    productBasePrice: string;
    costCurrency: string;
    profitMargin: string;

    /** En `false` el producto se retiró de la carta. */
    productStatus: boolean;

    ingredients: ProductIngredientApiResponse[];

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
    productCategoryId?: string;
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
}
