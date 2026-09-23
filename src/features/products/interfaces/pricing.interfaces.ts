import type { RegisterOptions } from "react-hook-form";

import type { Branch } from "@/lib/branches";

import type { ProductFormValues } from "./products.interfaces";


export type ProductPriceRules = RegisterOptions<ProductFormValues, "price">;

export type ProductMarginRules = RegisterOptions<ProductFormValues, "margin">;

export type ProductBranchPricePath = `branches.${number}.price`;

/** Reglas del precio propio de una sucursal. Solo aplican si está personalizada. */
export type ProductBranchPriceRules = RegisterOptions<
    ProductFormValues,
    ProductBranchPricePath
>;


/**
 * Lo global ya resuelto: lo que se muestra en el resumen del paso y lo que
 * heredan las sucursales que no se personalizaron.
 */
export interface GlobalPricing {
    /** Costo de preparar una unidad, según la receta del paso anterior. */
    cost: number;
    /** En `false` alguna línea de la receta se quedó sin cantidad válida. */
    isCostComplete: boolean;
    price: number | null;
    margin: number | null;
    /** Precio menos costo, o `null` si todavía no hay precio. */
    profit: number | null;
    isAvailable: boolean;
    /** El precio no cubre el costo. Avisa, no impide continuar. */
    isBelowCost: boolean;
}


/** Una sucursal con su configuración ya resuelta, lista para pintar la tarjeta. */
export interface BranchPricingRow {
    /** Posición dentro de `branches` del formulario. */
    index: number;
    branch: Branch;
    isCustom: boolean;
    /** El precio que se aplica: el propio si está personalizada, el global si no. */
    price: number | null;
    isAvailable: boolean;
    /** Margen de ese precio sobre el costo de la receta. */
    margin: number | null;
}
