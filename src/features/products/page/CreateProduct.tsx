"use client";

import Link from "next/link";
import * as React from "react";

import { FormProvider } from "react-hook-form";

import GenericButton from "@/components/buttons/GenericButton";
import PageHeader from "@/components/layout/PageHeader";
import { messages } from "@/messages";
import { ICON_TOKENS } from "@/tokens";

import {
    ProductBasicsStep,
    ProductFormStepper,
    ProductPricingStep,
    ProductRecipeStep,
} from "../components/form";
import { useProductForm } from "../hooks/use-product-form";
import { PRODUCTS_LIST_HREF, PRODUCT_FORM_STEPS } from "../libs";


import {
    createProductActionsVariants,
    createProductBodyVariants,
    createProductCancelVariants,
    createProductFooterNoteVariants,
    createProductFooterVariants,
    createProductPageVariants,
    createProductPanelVariants,
} from "../style";



/**
 * Pantalla de alta de producto
 *
 * Reparte la pantalla: encabezado, indicador, el paso que toque y el pie de
 * acciones. El estado del formulario lo lleva `useProductForm` (react-hook-
 * form) y los componentes de abajo son de presentación, el mismo reparto que
 * hay entre `Products` y su rejilla.
 */

export default function CreateProduct() {
    // Mensajes para mostrar en pantalla
    const productMessage = messages.products.create;

    const {
        form,
        step,
        stepIndex,
        isFirstStep,
        isLastStep,
        isStepValid,
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

    return (
        <FormProvider {...form}>
            <div className={createProductPageVariants()}>
                <PageHeader
                    title={productMessage.title}
                    subtitle={productMessage.subtitle}
                    backHref={PRODUCTS_LIST_HREF}
                    backLabel={productMessage.backLabel}
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
                        aria-label={step.title}
                        className={createProductBodyVariants()}
                    >
                        {step.id === "basics" && (<ProductBasicsStep />)}
                        {step.id === "recipe" && (<ProductRecipeStep />)}
                        {step.id === "pricing" && (<ProductPricingStep />)}
                    </div>

                    <footer className={createProductFooterVariants()}>
                        {/* Los tres pasos tienen campos obligatorios, así que
                        la nota acompaña a todo el asistente. */}
                        <p className={createProductFooterNoteVariants()}>
                            {messages.common.forms.requiredFields}
                        </p>

                        <div className={createProductActionsVariants()}>
                            {isFirstStep ? (
                                <Link
                                    href={PRODUCTS_LIST_HREF}
                                    className={createProductCancelVariants()}
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
                            completos y sin errores. */}
                            <GenericButton
                                type="submit"
                                variant="primary"
                                label={
                                    isLastStep
                                        ? productMessage.submit
                                        : messages.common.actions.continue
                                }
                                disabled={!isStepValid}
                                {...(!isLastStep && { endIcon: ICON_TOKENS.NEXT })}
                            />
                        </div>
                    </footer>
                </form>
            </div>
        </FormProvider>
    );
};
