import { Alert } from "@/components";
import { formatCurrency, formatPercent } from "@/lib/format";
import { cn } from "@/lib/utils";
import { formatMessage, messages } from "@/messages";

import type { GlobalPricing } from "../../../interfaces";
import {
    pricingAmountPendingVariants,
    pricingAmountVariants,
    pricingBreakdownTitleVariants,
    pricingBreakdownVariants,
    pricingRowHintVariants,
    pricingRowLabelVariants,
    pricingRowTextVariants,
    pricingRowVariants,
    pricingRowsVariants,
    pricingSummaryVariants,
} from "./pricing-summary.style";


interface PricingSummaryProps {
    /** Lo global ya resuelto, tal como lo devuelve `useProductPricing`. */
    global: GlobalPricing;
    className?: string;
}

const pricingMessages = messages.products.create.pricing;
const recipeMessages = messages.products.create.recipe;

/**
 * Cómo se compone el precio: lo que cuesta preparar el producto, lo que deja
 * cada unidad y, cerrando la cuenta, lo que paga el cliente.
 *
 * Es una lista de definición y no una tabla porque cada fila es un concepto
 * con su valor, no la celda de una rejilla. El precio de venta repite el
 * campo de arriba a propósito: ahí se escribe, aquí se ve de dónde sale.
 */
export default function PricingSummary({ global, className }: PricingSummaryProps) {
    const { cost, isCostComplete, profit, price, margin, isBelowCost } = global;

    return (
        <div className={cn(pricingSummaryVariants(), className)}>
            {isBelowCost && profit !== null && (
                <Alert
                    tone="warning"
                    variant="soft"
                    size="sm"
                    dismissible={false}
                    title={pricingMessages.belowCostNotice.title}
                    description={formatMessage(pricingMessages.belowCostNotice.description, {
                        amount: formatCurrency(Math.abs(profit)),
                    })}
                />
            )}

            <section className={pricingBreakdownVariants()}>
                <h3 className={pricingBreakdownTitleVariants()}>
                    {pricingMessages.summary.title}
                </h3>

                <dl className={pricingRowsVariants()}>
                    <div className={pricingRowVariants()}>
                        <dt className={pricingRowTextVariants()}>
                            <span className={pricingRowLabelVariants()}>
                                {pricingMessages.cost.label}
                            </span>

                            {/* Si la receta quedó con alguna cantidad a medias, el
                                costo que se ve aquí no es el definitivo y hay que
                                decirlo. */}
                            <span className={pricingRowHintVariants({ pending: !isCostComplete })}>
                                {isCostComplete
                                    ? pricingMessages.cost.hint
                                    : recipeMessages.total.pending}
                            </span>
                        </dt>

                        <dd className={pricingAmountVariants()}>{formatCurrency(cost)}</dd>
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

                        {profit === null ? (
                            <dd className={pricingAmountPendingVariants()}>
                                {pricingMessages.profit.pending}
                            </dd>
                        ) : (
                            <dd
                                className={pricingAmountVariants({
                                    tone: isBelowCost ? "error" : "success",
                                })}
                            >
                                {formatCurrency(profit)}
                            </dd>
                        )}
                    </div>

                    {/* El total. No se anuncia con cada cambio porque el lector de
                        pantalla leería un importe nuevo con cada tecla. */}
                    <div className={pricingRowVariants({ total: true })}>
                        <dt className={pricingRowTextVariants()}>
                            <span className={pricingRowLabelVariants({ total: true })}>
                                {pricingMessages.total.label}
                            </span>

                            <span className={pricingRowHintVariants()}>
                                {pricingMessages.total.hint}
                            </span>
                        </dt>

                        {price === null ? (
                            <dd className={pricingAmountPendingVariants()}>
                                {pricingMessages.total.pending}
                            </dd>
                        ) : (
                            <dd className={pricingAmountVariants({ tone: "strong", size: "lg" })}>
                                {formatCurrency(price)}
                            </dd>
                        )}
                    </div>
                </dl>
            </section>
        </div>
    );
};
