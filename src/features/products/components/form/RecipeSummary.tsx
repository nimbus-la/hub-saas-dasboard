import { Alert } from "@/components";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";
import { messages } from "@/messages";

import type { RecipeSummaryProps } from "../../interfaces";
import {
    formatOutOfStockNotice,
    getOutOfStockIngredients,
    getRecipeCost,
} from "../../libs";
import {
    recipeSummaryVariants,
    recipeTotalAmountVariants,
    recipeTotalHintVariants,
    recipeTotalLabelVariants,
    recipeTotalTextVariants,
    recipeTotalVariants,
} from "./recipe-summary.style";


const recipeMessages = messages.products.create.recipe;


/**
 * Resumen de la receta, con el aviso de insumos agotados y el costo total.
 *
 * Recibe las líneas ya calculadas y no guarda estado. Los insumos opcionales
 * también suman al costo, porque se preparan igual en la mayoría de pedidos.
 */
export default function RecipeSummary({ lines, className }: RecipeSummaryProps) {
    const outOfStock = getOutOfStockIngredients(lines);
    const { total, isComplete } = getRecipeCost(lines);

    return (
        <div className={cn(recipeSummaryVariants(), className)}>
            {outOfStock.length > 0 && (
                // No se puede cerrar porque describe cómo va a quedar el
                // producto. Desaparece solo cuando ya no hay insumos agotados.
                <Alert
                    tone="error"
                    variant="soft"
                    size="sm"
                    dismissible={false}
                    title={recipeMessages.outOfStockNotice.title}
                    description={formatOutOfStockNotice(outOfStock)}
                />
            )}

            <div className={recipeTotalVariants()}>
                <span className={recipeTotalTextVariants()}>
                    <span className={recipeTotalLabelVariants()}>
                        {recipeMessages.total.label}
                    </span>

                    {/* Aunque falten cantidades se muestra lo que va sumando,
                        pero se aclara que el total todavía no está completo. */}
                    <span className={recipeTotalHintVariants({ pending: !isComplete })}>
                        {isComplete ? recipeMessages.total.hint : recipeMessages.total.pending}
                    </span>
                </span>

                {/* No se anuncia con cada cambio porque el lector de pantalla
                    leería un importe nuevo con cada tecla que se escribe en
                    una cantidad. */}
                <span className={recipeTotalAmountVariants()}>
                    {formatCurrency(total)}
                </span>
            </div>
        </div>
    );
};
