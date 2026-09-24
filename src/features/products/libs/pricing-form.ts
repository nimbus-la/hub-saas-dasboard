// ── Reglas del precio de venta ──────────────────────────────────────────────
// Los límites del precio y del margen, y los mensajes que salen cuando un
// valor se sale de ellos. Igual que `recipe-form.ts`: los números viven en una
// constante para que la pantalla y el backend miren los mismos.

import { BRANCHES } from "@/lib/branches";
import { formatCurrency } from "@/lib/format";
import { formatMessage, messages } from "@/messages";

import type {
    ProductBranchPriceRules,
    ProductMarginRules,
    ProductPriceRules,
} from "../interfaces";


export const PRICING_VALIDATION = {
    price: { min: 1, max: 100_000_000, maxDecimals: 0 },
    /**
     * El margen puede ser negativo hasta −100 %, que es regalar el producto.
     * Se permite porque un precio por debajo del costo solo avisa, y el margen
     * que lo acompaña tiene que poder mostrarse.
     */
    margin: { min: -100, max: 10_000, maxDecimals: 1 },
} as const;


const message = messages.products.create.pricing.validation;


export const PRICING_RULES = {
    price: {
        validate: {
            required: (value) => value !== null || message.priceRequired,
            min: (value) =>
                value === null || value >= PRICING_VALIDATION.price.min || message.priceMin,
            max: (value) =>
                value === null ||
                value <= PRICING_VALIDATION.price.max ||
                formatMessage(message.priceMax, {
                    max: formatCurrency(PRICING_VALIDATION.price.max),
                }),
        },
    } satisfies ProductPriceRules,

    /**
     * El margen no es obligatorio: quien escribe el precio directo lo obtiene
     * calculado, y exigirlo aparte dejaría el paso trabado cuando la receta
     * todavía no tiene costo.
     */
    margin: {
        validate: {
            min: (value) =>
                value === null ||
                value >= PRICING_VALIDATION.margin.min ||
                formatMessage(message.marginMin, { min: PRICING_VALIDATION.margin.min }),
            max: (value) =>
                value === null ||
                value <= PRICING_VALIDATION.margin.max ||
                formatMessage(message.marginMax, { max: PRICING_VALIDATION.margin.max }),
        },
    } satisfies ProductMarginRules,
} as const;


/**
 * Reglas del precio propio de una sucursal.
 *
 * Nombran la sucursal en el mensaje porque en pantalla hay una tarjeta debajo
 * de otra y un "indica el precio" suelto no dice cuál falta. Se arman una sola
 * vez por sucursal, como las de la cantidad de la receta.
 */
const buildBranchPriceRules = (name: string): ProductBranchPriceRules => ({
    validate: {
        required: (value) =>
            value !== null || formatMessage(message.branchPriceRequired, { name }),
        min: (value) =>
            value === null ||
            value >= PRICING_VALIDATION.price.min ||
            formatMessage(message.branchPriceMin, { name }),
        max: (value) =>
            value === null ||
            value <= PRICING_VALIDATION.price.max ||
            formatMessage(message.branchPriceMax, {
                name,
                max: formatCurrency(PRICING_VALIDATION.price.max),
            }),
    },
});


const BRANCH_PRICE_RULES: Record<string, ProductBranchPriceRules> =
    Object.fromEntries(
        BRANCHES.map((branch) => [branch.id, buildBranchPriceRules(branch.name)])
    );


export const getBranchPriceRules = (branch: {
    id: string;
    name: string;
}): ProductBranchPriceRules =>
    BRANCH_PRICE_RULES[branch.id] ?? buildBranchPriceRules(branch.name);
