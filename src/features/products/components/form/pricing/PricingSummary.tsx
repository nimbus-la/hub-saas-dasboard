import { Alert } from "@/components";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";
import { formatMessage, messages } from "@/messages";

import type { GlobalPricing } from "../../../interfaces";
import {
    pricingAmountVariants,
    pricingFigureHintVariants,
    pricingFigureLabelVariants,
    pricingFigureVariants,
    pricingSummaryVariants,
    pricingTotalsVariants,
} from "./pricing-summary.style";


interface PricingSummaryProps {
    /** Lo global ya resuelto, tal como lo devuelve `useProductPricing`. */
    global: GlobalPricing;
    className?: string;
}

const pricingMessages = messages.products.create.pricing;
const recipeMessages = messages.products.create.recipe;

/**
 * Las dos cifras que explican el precio: lo que cuesta preparar el producto y
 * lo que deja cada unidad vendida.
 */
export default function PricingSummary({ global, className }: PricingSummaryProps) {
    const { cost, isCostComplete, profit, isBelowCost } = global;

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

            <div className={pricingTotalsVariants()}>
                <span className={pricingFigureVariants()}>
                    <span className={pricingFigureLabelVariants()}>
                        {pricingMessages.cost.label}
                    </span>

                    <span className={pricingAmountVariants()}>{formatCurrency(cost)}</span>

                    {/* Si la receta quedó con alguna cantidad a medias, el costo
                        que se ve aquí no es el definitivo y hay que decirlo. */}
                    <span className={pricingFigureHintVariants({ pending: !isCostComplete })}>
                        {isCostComplete
                            ? pricingMessages.cost.hint
                            : recipeMessages.total.pending}
                    </span>
                </span>

                <span className={pricingFigureVariants({ align: "end" })}>
                    <span className={pricingFigureLabelVariants()}>
                        {pricingMessages.profit.label}
                    </span>

                    {profit === null ? (
                        <span className={pricingFigureHintVariants({ pending: true })}>
                            {pricingMessages.profit.pending}
                        </span>
                    ) : (
                        <span
                            className={pricingAmountVariants({
                                tone: isBelowCost ? "error" : "success",
                            })}
                        >
                            {formatCurrency(profit)}
                        </span>
                    )}
                </span>
            </div>
        </div>
    );
};
