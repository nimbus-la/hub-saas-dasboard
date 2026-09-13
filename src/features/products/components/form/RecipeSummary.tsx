import { messages } from "@/messages";
import { recipeTotalAmountVariants, recipeTotalHintVariants, recipeTotalLabelVariants, recipeTotalTextVariants, recipeTotalVariants } from "./recipe-summary.style";
import { formatCurrency } from "@/lib/format";

export default function RecipeSummary() {
    const message = messages.products.create.recipe;
    return (
        <>
            <div className={recipeTotalVariants()}>
                <span className={recipeTotalTextVariants()}>
                    <span className={recipeTotalLabelVariants()}>
                        {message.total.label}
                    </span>

                    <span className={recipeTotalHintVariants({ pending: false })}>
                        {message.total.hint}
                    </span>
                </span>

                <span
                    aria-live="polite"
                    className={recipeTotalAmountVariants()}
                >
                    {formatCurrency(0)}
                </span>
            </div>
        </>
    )
}