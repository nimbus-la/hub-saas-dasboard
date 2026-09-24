// ── Cálculos del precio de venta ────────────────────────────────────────────
// Convierte entre margen y precio, y resuelve qué precio termina aplicando cada
// sucursal. Son funciones puras: reciben el costo de la receta y lo que hay en
// el formulario, y no saben nada de react-hook-form ni de la pantalla.
//
// El margen es sobre el costo: un 45 % sobre un costo de $8.400 da $12.180. Es
// la cuenta que hace quien pone precios en una carta, y la que deja que el
// precio suba solo cuando suben los insumos.

import { getBranch, type Branch } from "@/lib/branches";

import type {
    BranchPricingRow,
    GlobalPricing,
    ProductBranchFormValues,
} from "../interfaces";
import { PRICING_VALIDATION } from "./pricing-form";


const PERCENT_BASE = 100;


/** Sin costo no hay nada sobre lo que calcular un margen. */
export const hasCost = (cost: number): boolean => cost > 0;


/**
 * El precio que corresponde a un margen.
 *
 * Redondea a pesos enteros porque `formatCurrency` muestra COP sin decimales:
 * si se guardara con centavos, lo que se ve y lo que se guarda dejarían de ser
 * lo mismo.
 */
export function getPriceFromMargin(cost: number, margin: number | null): number | null {
    if (!hasCost(cost) || margin === null) return null;

    return Math.round(cost * (1 + margin / PERCENT_BASE));
}


/**
 * El margen que representa un precio.
 *
 * Se redondea a un decimal, que es con los que se muestra el porcentaje. Sin
 * redondear, escribir un precio a mano dejaría un margen de doce decimales en
 * el campo de al lado.
 */
export function getMarginFromPrice(cost: number, price: number | null): number | null {
    if (!hasCost(cost) || price === null) return null;

    const margin = ((price - cost) / cost) * PERCENT_BASE;
    const factor = 10 ** PRICING_VALIDATION.margin.maxDecimals;

    return Math.round(margin * factor) / factor;
}


/** Lo que deja cada unidad vendida. */
export const getProfit = (cost: number, price: number | null): number | null =>
    price === null ? null : price - cost;


/** Arma el resumen del bloque global a partir de lo que hay en el formulario. */
export function resolveGlobalPricing(
    cost: number,
    isCostComplete: boolean,
    price: number | null,
    margin: number | null,
    isAvailable: boolean
): GlobalPricing {
    return {
        cost,
        isCostComplete,
        price,
        margin,
        profit: getProfit(cost, price),
        isAvailable,
        isBelowCost: hasCost(cost) && price !== null && price < cost,
    };
}


/**
 * Resuelve la configuración de cada sucursal.
 *
 * Una sucursal que no está personalizada no guarda precio propio: aquí se le
 * pone el global, que es lo que va a cobrar de verdad. La línea cuya sucursal
 * ya no está en el catálogo se deja por fuera, igual que hace la receta con un
 * insumo retirado del inventario.
 */
export function resolveBranchPricing(
    branches: readonly ProductBranchFormValues[],
    global: Pick<GlobalPricing, "cost" | "price" | "isAvailable">
): BranchPricingRow[] {
    return branches.flatMap((line, index) => {
        const branch: Branch | undefined = getBranch(line.branchId);

        if (!branch) return [];

        const price = line.isCustom ? line.price : global.price;

        return [{
            index,
            branch,
            isCustom: line.isCustom,
            price,
            isAvailable: line.isCustom ? line.isAvailable : global.isAvailable,
            margin: getMarginFromPrice(global.cost, price),
        }];
    });
}


/** Cuántas sucursales se salieron de la configuración global. */
export const countCustomBranches = (rows: readonly BranchPricingRow[]): number =>
    rows.filter((row) => row.isCustom).length;
