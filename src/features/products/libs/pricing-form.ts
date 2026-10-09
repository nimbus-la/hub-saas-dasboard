// ── Reglas del precio de venta ──────────────────────────────────────────────
// Los límites del costo, el precio y el margen, y los mensajes que salen cuando
// un valor se sale de ellos. Igual que `recipe-form.ts`: los números viven en
// una constante para que la pantalla y el backend miren los mismos.

import { BRANCHES } from "@/lib/branches";
import { formatCurrency } from "@/lib/format";
import { formatMessage, messages } from "@/messages";

import type {
    ProductBranchPriceRules,
    ProductCostRules,
    ProductMarginRules,
    ProductPriceRules,
} from "../interfaces";


/**
 * Los mínimos del costo y del precio son exclusivos: tienen que ser mayores,
 * no iguales. Con dos decimales porque el backend calcula el precio de un
 * margen con centavos, y redondearlo dejaría de cuadrar con ese margen.
 */
export const PRICING_VALIDATION = {
    cost: { min: 0, max: 100_000_000, maxDecimals: 2 },
    price: { min: 0, max: 100_000_000, maxDecimals: 2 },
    /**
     * El margen es sobre el precio y va de 0 a 100, los dos excluidos: con 0
     * no se gana nada y con 100 no existe precio posible. Así lo pide el
     * backend.
     */
    margin: { min: 0, max: 100, maxDecimals: 2 },
} as const;


/**
 * Cuánto se espera sin teclear antes de pedir el cálculo del precio.
 *
 * El doble del retraso general (`DEFAULT_DEBOUNCE_MS`). Ese está pensado para
 * un buscador, donde pedir de más solo cuesta una lista; aquí un número a
 * medias —un 8 camino de 8.000— cambia el precio de al lado, y quien escribe
 * una cifra suele hacer pausas para mirar el teclado. Al salir del campo no se
 * espera nada.
 */
export const PRICE_CALCULATION_DEBOUNCE_MS = 800;


const message = messages.products.create.pricing.validation;


export const PRICING_RULES = {
    cost: {
        validate: {
            required: (value) => value !== null || message.costRequired,
            min: (value) =>
                value === null || value > PRICING_VALIDATION.cost.min || message.costMin,
            max: (value) =>
                value === null ||
                value <= PRICING_VALIDATION.cost.max ||
                formatMessage(message.costMax, {
                    max: formatCurrency(PRICING_VALIDATION.cost.max),
                }),
        },
    } satisfies ProductCostRules,

    price: {
        validate: {
            required: (value) => value !== null || message.priceRequired,
            min: (value) =>
                value === null || value > PRICING_VALIDATION.price.min || message.priceMin,
            max: (value) =>
                value === null ||
                value <= PRICING_VALIDATION.price.max ||
                formatMessage(message.priceMax, {
                    max: formatCurrency(PRICING_VALIDATION.price.max),
                }),
            // El backend no guarda un margen de cero o menos, así que vender
            // al costo o por debajo ya no es algo que se pueda dejar pasar.
            aboveCost: (value, { cost }) =>
                value === null || cost === null || value > cost || message.priceAboveCost,
        },
    } satisfies ProductPriceRules,

    /**
     * El margen es obligatorio porque viaja en el alta, pero quien escribe el
     * precio lo obtiene calculado. Cuando el precio no cubre el costo, el
     * error lo da el precio, que es el campo que hay que corregir; repetirlo
     * aquí pondría dos mensajes para un solo problema.
     */
    margin: {
        validate: {
            required: (value) => value !== null || message.marginRequired,
            min: (value, { cost, price }) =>
                value === null ||
                value > PRICING_VALIDATION.margin.min ||
                (cost !== null && price !== null && price <= cost) ||
                formatMessage(message.marginMin, { min: PRICING_VALIDATION.margin.min }),
            max: (value) =>
                value === null ||
                value < PRICING_VALIDATION.margin.max ||
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
            value > PRICING_VALIDATION.price.min ||
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
