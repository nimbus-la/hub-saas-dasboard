import type {
    Profitability,
    ProfitabilityApiResponse,
    ProfitabilityInput,
    ProfitabilityParams,
} from "../interfaces";

/**
 * Conversiones del cálculo de rentabilidad entre los números del formulario y
 * el texto que viaja al backend.
 */


/** Un texto numérico del backend, o `null` si no vino. */
const toNumberOrNull = (value: string | null): number | null =>
    value === null ? null : Number(value);


/**
 * El pedido como lo espera el backend. Lo que no se quiere enviar no aparece,
 * en vez de ir vacío, porque el backend decide qué calcular según qué campos
 * lleguen.
 */
export const toProfitabilityParams = (input: ProfitabilityInput): ProfitabilityParams => ({
    cost: String(input.cost),
    ...(input.price !== undefined && { price: String(input.price) }),
    ...(input.targetMargin !== undefined && { targetMargin: String(input.targetMargin) }),
});


/** Convierte el resultado del backend a números. */
export const toProfitability = (response: ProfitabilityApiResponse): Profitability => ({
    cost: Number(response.cost),
    price: toNumberOrNull(response.price),
    grossProfit: toNumberOrNull(response.grossProfit),
    margin: toNumberOrNull(response.margin),
    foodCost: toNumberOrNull(response.foodCost),
    markup: toNumberOrNull(response.markup),
});
