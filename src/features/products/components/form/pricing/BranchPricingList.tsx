import { cn } from "@/lib/utils";
import { formatPlural, messages } from "@/messages";

import type { BranchPricingRow } from "../../../interfaces";
import BranchPricingCard from "./BranchPricingCard";
import {
    productPricingBranchesCountVariants,
    productPricingBranchesHeaderVariants,
    productPricingBranchesHintVariants,
    productPricingBranchesTitleVariants,
    productPricingBranchesVariants,
    productPricingCardsVariants,
} from "./product-pricing-step.style";


interface BranchPricingListProps {
    /** Las sucursales ya resueltas, tal como las devuelve `useProductPricing`. */
    rows: readonly BranchPricingRow[];
    /** Cuántas se salieron del precio global. */
    customCount: number;
    className?: string;
}

const branchMessages = messages.products.create.pricing.branches;

export default function BranchPricingList({
    rows,
    customCount,
    className,
}: BranchPricingListProps) {
    return (
        <section className={cn(productPricingBranchesVariants(), className)}>
            <div className={productPricingBranchesHeaderVariants()}>
                <h3 className={productPricingBranchesTitleVariants()}>
                    {branchMessages.title}
                </h3>

                {/* Se anuncia al cambiar porque el contador queda arriba y quien
                    personaliza la última tarjeta ya no lo tiene a la vista. */}
                <p aria-live="polite" className={productPricingBranchesCountVariants()}>
                    {formatPlural(branchMessages.count, customCount)}
                </p>
            </div>

            <p className={productPricingBranchesHintVariants()}>{branchMessages.hint}</p>

            <div className={productPricingCardsVariants()}>
                {rows.map((row) => (
                    <BranchPricingCard key={row.branch.id} row={row} />
                ))}
            </div>
        </section>
    );
};
