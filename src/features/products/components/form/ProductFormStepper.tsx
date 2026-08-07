import { Check } from "lucide-react";

import { cn } from "@/lib/utils";
import { formatStepPosition, type ProductFormStep } from "@/features/products/libs/product-form";
import { ICON_SIZE, ICON_STROKE } from "@/tokens";

import {
    stepperConnectorVariants,
    stepperHintVariants,
    stepperItemVariants,
    stepperLabelVariants,
    stepperListVariants,
    stepperMarkerVariants,
    stepperTextVariants,
    stepperVariants,
} from "./product-form-stepper.style";


/**
 * Indicador de pasos
 * 
 * Va en la cabecera del panel del formulario de producto. 
 * Muestra en qué paso estás, cuáles quedaron atrás y cuántos 
 * faltan. Es de sólo lectura: para volver está el pie del panel.
 */

type StepState = "complete" | "current" | "upcoming";

interface ProductFormStepperProps {
    steps: readonly ProductFormStep[];
    /** Paso activo, en base cero. */
    currentIndex: number;
    className?: string;
}

const resolveState = (index: number, currentIndex: number): StepState => {
    if (index < currentIndex) return "complete";
    if (index === currentIndex) return "current";

    return "upcoming";
};

export default function ProductFormStepper({
    steps,
    currentIndex,
    className,
}: ProductFormStepperProps) {
    return (
        <nav
            aria-label="Progreso del alta de producto"
            className={cn(stepperVariants(), className)}
        >
            <ol className={stepperListVariants()}>
                {steps.map((step: ProductFormStep, index: number) => {
                    const state = resolveState(index, currentIndex);
                    const isLast = index === steps.length - 1;

                    return (
                        <li
                            key={step.id}
                            // `step` es el valor de aria-current para flujos por
                            // etapas; `page` diría que es otra página.
                            aria-current={state === "current" ? "step" : undefined}
                            className={stepperItemVariants({ last: isLast })}
                        >
                            <span
                                aria-hidden="true"
                                className={stepperMarkerVariants({ state })}
                            >
                                {state === "complete" ? (
                                    <Check
                                        size={ICON_SIZE.sm}
                                        strokeWidth={ICON_STROKE.bold}
                                    />
                                ) : (
                                    index + 1
                                )}
                            </span>

                            <span className={stepperTextVariants({ state })}>
                                <span className={stepperLabelVariants({ state })}>
                                    {/* La posición se lee, no se ve: en pantalla la
                                        da el círculo, y repetirla en texto gastaría
                                        el ancho que necesita el rótulo. */}
                                    <span className="sr-only">
                                        {`${formatStepPosition(index)}: `}
                                    </span>

                                    {step.label}
                                </span>

                                <span className={stepperHintVariants()}>
                                    {step.hint}
                                </span>
                            </span>

                            {!isLast && (
                                <span
                                    aria-hidden="true"
                                    className={stepperConnectorVariants({
                                        done: state === "complete",
                                    })}
                                />
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
};
