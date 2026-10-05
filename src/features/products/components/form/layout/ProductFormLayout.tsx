"use client";

import Link from "next/link";
import * as React from "react";

import { FormProvider } from "react-hook-form";

import GenericButton from "@/components/buttons/GenericButton";
import PageHeader from "@/components/layout/PageHeader";
import { messages } from "@/messages";
import { ICON_TOKENS } from "@/tokens";

import { useProductForm } from "../../../hooks/use-product-form";
import type { ProductFormLayoutProps } from "../../../interfaces";
import { PRODUCTS_LIST_HREF, PRODUCT_FORM_STEPS } from "../../../libs";
import { ProductBasicsStep } from "../basics";
import { ProductPricingStep } from "../pricing";
import { ProductRecipeStep } from "../recipe";
import { ProductFormStepper } from "../stepper";

import {
    productFormActionsVariants,
    productFormBodyVariants,
    productFormCancelVariants,
    productFormFooterNoteVariants,
    productFormFooterVariants,
    productFormPageVariants,
    productFormPanelVariants,
} from "./product-form-layout.style";


/**
 * El asistente de 3 pasos del producto, el mismo para crear y para editar.
 *
 * Reparte la pantalla: encabezado, indicador, el paso que toque y el pie de
 * acciones. El estado del formulario lo lleva `useProductForm` (react-hook-
 * form) y los pasos son de presentación. Lo único que cambia entre crear y
 * editar son los textos, los valores con los que arranca y qué pasa al
 * guardar, y todo eso llega por props.
 */
export default function ProductFormLayout({
    formMessages,
    currentCategory,
    ...options
}: ProductFormLayoutProps) {
    const {
        form,
        step,
        stepIndex,
        isFirstStep,
        isLastStep,
        isStepValid,
        isSubmitting,
        submitStep,
        goToPreviousStep,
    } = useProductForm(options);

    const bodyRef = React.useRef<HTMLDivElement>(null);
    const previousStepIndex = React.useRef(stepIndex);

    // Al cambiar de paso el foco pasa al contenido nuevo. El contenido cambia
    // sin que cambie la URL, así que nadie lo anunciaría por su cuenta.
    React.useEffect(() => {
        if (previousStepIndex.current === stepIndex) return;

        previousStepIndex.current = stepIndex;
        bodyRef.current?.focus();
    }, [stepIndex]);

    return (
        <FormProvider {...form}>
            <div className={productFormPageVariants()}>
                <PageHeader
                    title={formMessages.title}
                    subtitle={formMessages.subtitle}
                    backHref={PRODUCTS_LIST_HREF}
                    backLabel={formMessages.backLabel}
                />

                {/* `noValidate`: la validación es la del formulario, con mensajes
                en español y pegados a su campo. Los globos del navegador
                aparecen de uno en uno y no se pueden estilar. */}
                <form
                    noValidate
                    onSubmit={submitStep}
                    className={productFormPanelVariants()}
                >
                    <ProductFormStepper
                        steps={PRODUCT_FORM_STEPS}
                        currentIndex={stepIndex}
                    />

                    <div
                        ref={bodyRef}
                        tabIndex={-1}
                        aria-label={step.title}
                        className={productFormBodyVariants()}
                    >
                        {step.id === "basics" && (
                            <ProductBasicsStep currentCategory={currentCategory} />
                        )}
                        {step.id === "recipe" && (<ProductRecipeStep />)}
                        {step.id === "pricing" && (<ProductPricingStep />)}
                    </div>

                    <footer className={productFormFooterVariants()}>
                        {/* Los tres pasos tienen campos obligatorios, así que
                        la nota acompaña a todo el asistente. */}
                        <p className={productFormFooterNoteVariants()}>
                            {messages.common.forms.requiredFields}
                        </p>

                        <div className={productFormActionsVariants()}>
                            {isFirstStep ? (
                                <Link
                                    href={PRODUCTS_LIST_HREF}
                                    className={productFormCancelVariants()}
                                >
                                    {messages.common.actions.cancel}
                                </Link>
                            ) : (
                                <GenericButton
                                    type="button"
                                    variant="ghost"
                                    label={messages.common.actions.back}
                                    startIcon={ICON_TOKENS.BACK}
                                    onClick={goToPreviousStep}
                                />
                            )}

                            {/* En el último paso el botón cambia de papel: ya no
                            queda a dónde avanzar, así que guarda. En todos se
                            habilita solo cuando los campos del paso están
                            completos y sin errores, y mientras se guarda se
                            bloquea para no enviarlo dos veces. */}
                            <GenericButton
                                type="submit"
                                variant="primary"
                                label={
                                    isLastStep
                                        ? formMessages.submit
                                        : messages.common.actions.continue
                                }
                                disabled={!isStepValid || isSubmitting}
                                {...(!isLastStep && { endIcon: ICON_TOKENS.NEXT })}
                            />
                        </div>
                    </footer>
                </form>
            </div>
        </FormProvider>
    );
};
