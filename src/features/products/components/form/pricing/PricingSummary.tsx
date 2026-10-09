import { Alert } from "@/components";
import { formatCurrencyPrecise, formatPercent } from "@/lib/format";
import { cn } from "@/lib/utils";
import { formatMessage, messages } from "@/messages";

import type { ProductPrice } from "../../../hooks/use-product-price";
import {
    pricingAmountPendingVariants,
    pricingAmountVariants,
    pricingBreakdownHeaderVariants,
    pricingBreakdownTitleVariants,
    pricingBreakdownVariants,
    pricingCalculatingVariants,
    pricingRowHintVariants,
    pricingRowLabelVariants,
    pricingRowTextVariants,
    pricingRowVariants,
    pricingRowsVariants,
    pricingSummaryVariants,
} from "./pricing-summary.style";


interface PricingSummaryProps {
    /** El enlace entre costo, precio y margen, de `useProductPrice`. */
    pricing: ProductPrice;
    className?: string;
}

const pricingMessages = messages.products.create.pricing;
// Con receta, el costo podía estar a medias y la fila lo avisaba con este texto.
// const recipeMessages = messages.products.create.recipe;

/**
 * Cómo se compone el precio: lo que cuesta preparar el producto, lo que deja
 * cada unidad y, cerrando la cuenta, lo que paga el cliente.
 *
 * Por ahora solo se muestran costo, ganancia y precio; los dos porcentajes
 * quedaron comentados.
 *
 * Es una lista de definición y no una tabla porque cada fila es un concepto
 * con su valor, no la celda de una rejilla. Las cifras salen del cálculo del
 * backend y no de los campos: son las que se van a guardar.
 */
export default function PricingSummary({ pricing, className }: PricingSummaryProps) {
    const { cost, price, profitability, isCalculating, isBelowCost } = pricing;

    const grossProfit = profitability?.grossProfit ?? null;
    const margin = profitability?.margin ?? null;

    return (
        <div className={cn(pricingSummaryVariants(), className)}>
            {isBelowCost && cost !== null && price !== null && (
                <Alert
                    tone="warning"
                    variant="soft"
                    size="sm"
                    dismissible={false}
                    title={pricingMessages.belowCostNotice.title}
                    description={formatMessage(pricingMessages.belowCostNotice.description, {
                        amount: formatCurrencyPrecise(cost - price),
                    })}
                />
            )}

            <section className={pricingBreakdownVariants()}>
                <div className={pricingBreakdownHeaderVariants()}>
                    <h3 className={pricingBreakdownTitleVariants()}>
                        {pricingMessages.summary.title}
                    </h3>

                    {/* Se anuncia sin interrumpir lo que se está escribiendo. */}
                    <span aria-live="polite" className={pricingCalculatingVariants()}>
                        {isCalculating ? pricingMessages.calculating : ""}
                    </span>
                </div>

                {profitability === null ? (
                    <p className={pricingAmountPendingVariants({ align: "start" })}>
                        {pricingMessages.total.pendingBreakdown}
                    </p>
                ) : (
                    // Mientras llega el cálculo nuevo, el anterior se queda pero
                    // atenuado, para que no se lea como el definitivo.
                    <dl
                        aria-busy={isCalculating}
                        className={pricingRowsVariants({ stale: isCalculating })}
                    >
                        <div className={pricingRowVariants()}>
                            <dt className={pricingRowTextVariants()}>
                                <span className={pricingRowLabelVariants()}>
                                    {pricingMessages.cost.label}
                                </span>
                                <span className={pricingRowHintVariants()}>
                                    {pricingMessages.cost.hint}
                                </span>
                            </dt>

                            <dd className={pricingAmountVariants()}>
                                {formatCurrencyPrecise(profitability.cost)}
                            </dd>
                        </div>

                        <div className={pricingRowVariants()}>
                            <dt className={pricingRowTextVariants()}>
                                <span className={pricingRowLabelVariants()}>
                                    {pricingMessages.profit.label}
                                </span>
                                <span className={pricingRowHintVariants()}>
                                    {margin === null
                                        ? pricingMessages.profit.hint
                                        : formatMessage(pricingMessages.profit.margin, {
                                            margin: formatPercent(margin),
                                        })}
                                </span>
                            </dt>

                            {grossProfit === null ? (
                                <dd className={pricingAmountPendingVariants()}>
                                    {pricingMessages.profit.pending}
                                </dd>
                            ) : (
                                <dd
                                    className={pricingAmountVariants({
                                        tone: grossProfit > 0 ? "success" : "error",
                                    })}
                                >
                                    {formatCurrencyPrecise(grossProfit)}
                                </dd>
                            )}
                        </div>

                        {/* Costo sobre el precio y recargo sobre el costo: el backend ya
                        los calcula, pero por ahora no se muestran. Para volver a
                        mostrarlos basta con quitar este comentario.
                        {profitability.foodCost !== null && (
                            <div className={pricingRowVariants()}>
                                <dt className={pricingRowTextVariants()}>
                                    <span className={pricingRowLabelVariants()}>
                                        {pricingMessages.foodCost.label}
                                    </span>
                                    <span className={pricingRowHintVariants()}>
                                        {pricingMessages.foodCost.hint}
                                    </span>
                                </dt>

                                <dd className={pricingAmountVariants({ size: "sm" })}>
                                    {formatPercent(profitability.foodCost)}
                                </dd>
                            </div>
                        )}

                        {profitability.markup !== null && (
                            <div className={pricingRowVariants()}>
                                <dt className={pricingRowTextVariants()}>
                                    <span className={pricingRowLabelVariants()}>
                                        {pricingMessages.markup.label}
                                    </span>
                                    <span className={pricingRowHintVariants()}>
                                        {pricingMessages.markup.hint}
                                    </span>
                                </dt>

                                <dd className={pricingAmountVariants({ size: "sm" })}>
                                    {formatPercent(profitability.markup)}
                                </dd>
                            </div>
                        )}
                        */}

                        {/* El total. No se anuncia con cada cambio porque el
                            lector de pantalla leería un importe nuevo con cada
                            tecla. */}
                        <div className={pricingRowVariants({ total: true })}>
                            <dt className={pricingRowTextVariants()}>
                                <span className={pricingRowLabelVariants({ total: true })}>
                                    {pricingMessages.total.label}
                                </span>
                                <span className={pricingRowHintVariants()}>
                                    {pricingMessages.total.hint}
                                </span>
                            </dt>

                            {profitability.price === null ? (
                                <dd className={pricingAmountPendingVariants()}>
                                    {pricingMessages.total.pending}
                                </dd>
                            ) : (
                                <dd className={pricingAmountVariants({ tone: "strong", size: "lg" })}>
                                    {formatCurrencyPrecise(profitability.price)}
                                </dd>
                            )}
                        </div>
                    </dl>
                )}
            </section>
        </div>
    );
};
