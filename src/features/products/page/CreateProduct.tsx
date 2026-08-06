"use client";

import * as React from "react";
import Link from "next/link";

import GenericButton from "@/components/buttons/GenericButton";
import { ICON_TOKENS } from "@/tokens";
import { PRODUCT_FORM_STEPS } from "@/features/products/libs/product-form";

import {
    ProductBasicsStep,
    ProductFormHeader,
    ProductFormStepper,
    ProductStepPlaceholder,
} from "../components/form";
import { useProductForm } from "../hooks/use-product-form";
import {
    createProductActionsVariants,
    createProductBodyVariants,
    createProductCancelVariants,
    createProductFooterNoteVariants,
    createProductFooterVariants,
    createProductPageVariants,
    createProductPanelVariants,
} from "./create-product.style";

/** Destino de la flecha de regreso y del botón de cancelar. */
const PRODUCTS_LIST_HREF = "/products";

const COPY = {
    title: "Nuevo producto",
    subtitle: "Completa los 3 pasos para publicar el producto. Nada se publicará hasta el último paso.",
    backLabel: "Volver a la lista de productos",
    requiredFields: "Los campos marcados con * son obligatorios.",
    cannotSaveYet: "Podrás guardar el producto cuando los tres pasos estén disponibles.",
} as const;


/**
 * Pantalla de alta de producto
 *
 * Reparte la pantalla: encabezado, indicador, el paso que toque y el pie de
 * acciones. El estado del formulario lo lleva `useProductForm` (react-hook-
 * form) y los componentes de abajo son de presentación, el mismo reparto que
 * hay entre `Products` y su rejilla.
 */

export default function CreateProduct() {
    const {
        form,
        step,
        stepIndex,
        isFirstStep,
        isLastStep,
        submitStep,
        goToPreviousStep,
    } = useProductForm();

    const bodyRef = React.useRef<HTMLDivElement>(null);
    const previousStepIndex = React.useRef(stepIndex);

    // Al cambiar de paso el foco pasa al contenido nuevo. El contenido cambia
    // sin que cambie la URL, así que nadie lo anunciaría por su cuenta.
    React.useEffect(() => {
        if (previousStepIndex.current === stepIndex) return;

        previousStepIndex.current = stepIndex;
        bodyRef.current?.focus();
    }, [stepIndex]);

    /**
     * Nota del pie.
     *
     * Cambia con el paso porque lo que hay que advertir cambia: qué es
     * obligatorio mientras hay campos que rellenar, y por qué no se puede
     * guardar cuando ya no queda a dónde avanzar. En los pasos sin campos no
     * dice nada — una advertencia sobre asteriscos en una pantalla sin
     * asteriscos es ruido.
     */
    const footerNote = isLastStep
        ? COPY.cannotSaveYet
        : step.fields.length > 0
            ? COPY.requiredFields
            : null;

    return (
        <div className={createProductPageVariants()}>
            <ProductFormHeader
                title={COPY.title}
                subtitle={COPY.subtitle}
                backHref={PRODUCTS_LIST_HREF}
                backLabel={COPY.backLabel}
            />

            {/* `noValidate`: la validación es la del formulario, con mensajes
                en español y pegados a su campo. Los globos del navegador
                aparecen de uno en uno y no se pueden estilar. */}
            <form
                noValidate
                onSubmit={submitStep}
                className={createProductPanelVariants()}
            >
                <ProductFormStepper
                    steps={PRODUCT_FORM_STEPS}
                    currentIndex={stepIndex}
                />

                <div
                    ref={bodyRef}
                    tabIndex={-1}
                    aria-label={step.label}
                    className={createProductBodyVariants()}
                >
                    {step.id === "basics" ? (
                        <ProductBasicsStep control={form.control} />
                    ) : (
                        <ProductStepPlaceholder step={step} index={stepIndex} />
                    )}
                </div>

                <footer className={createProductFooterVariants()}>
                    {footerNote && (
                        <p className={createProductFooterNoteVariants()}>
                            {footerNote}
                        </p>
                    )}

                    <div className={createProductActionsVariants()}>
                        {isFirstStep ? (
                            <Link
                                href={PRODUCTS_LIST_HREF}
                                className={createProductCancelVariants()}
                            >
                                Cancelar
                            </Link>
                        ) : (
                            <GenericButton
                                type="button"
                                variant="ghost"
                                label="Atrás"
                                startIcon={ICON_TOKENS.BACK}
                                onClick={goToPreviousStep}
                            />
                        )}

                        {/* En el último paso el botón cambia de papel: ya no
                            queda a dónde avanzar, y guardar todavía no es
                            posible. La nota del pie explica por qué. */}
                        <GenericButton
                            type="submit"
                            variant="primary"
                            label={isLastStep ? "Guardar producto" : "Continuar"}
                            disabled={isLastStep}
                            {...(!isLastStep && { endIcon: ICON_TOKENS.NEXT })}
                        />
                    </div>
                </footer>
            </form>
        </div>
    );
};
