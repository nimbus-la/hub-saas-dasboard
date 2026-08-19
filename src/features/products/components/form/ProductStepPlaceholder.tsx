// ── Paso todavía sin construir ──────────────────────────────────────────────
// Los pasos 2 y 3 del alta están definidos pero aún no tienen campos. En lugar
// de dejar el botón "Continuar" sin efecto —que se lee como una avería— el
// paso avanza y enseña qué se pedirá aquí. El indicador sigue contando la
// verdad y lo escrito en el paso 1 no se pierde al asomarse.

import { Hammer } from "lucide-react";

import { cn } from "@/lib/utils";
import { formatMessage, messages } from "@/messages";
import { formatStepPosition, type ProductFormStep } from "@/features/products/libs/product-form";
import { ICON_SIZE, ICON_STROKE_BY_SIZE } from "@/tokens";

import {
    productStepPlaceholderIconVariants,
    productStepPlaceholderMessageVariants,
    productStepPlaceholderTextVariants,
    productStepPlaceholderTitleVariants,
    productStepPlaceholderVariants,
} from "./product-step-placeholder.style";


/** Lo que dice un paso todavía sin campos. Ver `@/messages`. */
const COPY = messages.products.create.placeholder;

interface ProductStepPlaceholderProps {
    step: ProductFormStep;
    /** Posición del paso, en base cero. */
    index: number;
    className?: string;
}

export default function ProductStepPlaceholder({
    step,
    index,
    className,
}: ProductStepPlaceholderProps) {
    return (
        <div className={cn(productStepPlaceholderVariants(), className)}>
            <span
                aria-hidden="true"
                className={productStepPlaceholderIconVariants()}
            >
                <Hammer
                    size={ICON_SIZE["2xl"]}
                    strokeWidth={ICON_STROKE_BY_SIZE["2xl"]}
                />
            </span>

            <div className={productStepPlaceholderTextVariants()}>
                <p className={productStepPlaceholderTitleVariants()}>
                    {formatMessage(COPY.title, {
                        position: formatStepPosition(index),
                        label: step.label,
                    })}
                </p>

                <p className={productStepPlaceholderMessageVariants()}>
                    {formatMessage(COPY.message, {
                        hint: step.hint.toLowerCase(),
                    })}
                </p>
            </div>
        </div>
    );
};
