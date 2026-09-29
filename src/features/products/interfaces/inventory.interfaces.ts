import type { HttpRequestConfig } from "@/interfaces";
import type { Ingredient } from "@/lib/ingredients";


/** Unidad de medida tal como la envía el backend. */
export type InventoryUnitApi = "GRAM" | "MILLILITER" | "UNIT";


/** Insumo tal como lo envía el backend. Montos y existencias llegan como texto decimal. */
export interface InventoryItemApiResponse {
    id: string;
    tenantId: string;
    sku: string;
    name: string;
    unitOfMeasure: InventoryUnitApi;

    /** Costo de una unidad de medida, por ejemplo `"600.00"`. */
    effectiveCostAmount: string;
    currency: string;

    isPerishable: boolean;
    isActive: boolean;

    currentStock: string;
    minStock: string;
    isBelowMinimum: boolean | null;

    /** Fechas en formato ISO 8601. */
    createdAt: string;
    updatedAt: string;
}


/** Filtros del inventario. Sin sucursal, el backend responde con el del inquilino. */
export interface InventoryFilters {
    branchId?: string;
}


/** Operaciones disponibles sobre el inventario. */
export interface InventoryService {
    /**
     * Devuelve el inventario entero, recorriendo todas sus páginas. Existe
     * porque el backend no busca por texto: la receta necesita tener todos
     * los insumos a mano para filtrarlos mientras se escribe.
     */
    listAll(
        filters?: InventoryFilters,
        config?: HttpRequestConfig
    ): Promise<Ingredient[]>;
}
