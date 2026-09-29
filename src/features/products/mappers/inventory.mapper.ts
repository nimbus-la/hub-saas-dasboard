import type { Ingredient, IngredientUnit } from "@/lib/ingredients";

import type { InventoryItemApiResponse, InventoryUnitApi } from "../interfaces";

/**
 * Conversiones entre el insumo del backend y el que usa la receta.
 */


const UNITS: Record<InventoryUnitApi, IngredientUnit> = {
    GRAM: "gramo",
    MILLILITER: "mililitro",
    UNIT: "unidad",
};


/** Convierte un insumo del backend al formato de la receta. */
export const toIngredient = (item: InventoryItemApiResponse): Ingredient => ({
    id: item.id,
    name: item.name,
    sku: item.sku,
    stock: Number(item.currentStock),
    unit: UNITS[item.unitOfMeasure],
    unitCost: Number(item.effectiveCostAmount),
    isPerishable: item.isPerishable,
    isActive: item.isActive,
});


/** Convierte todas las filas del inventario. */
export const toIngredientList = (items: InventoryItemApiResponse[]): Ingredient[] =>
    items.map(toIngredient);
