"use client";

import Link from "next/link";
import * as React from "react";

import { FormProvider } from "react-hook-form";

import GenericButton from "@/components/buttons/GenericButton";
import PageHeader from "@/components/layout/PageHeader";
import { messages } from "@/messages";
// La flecha de "Atrás" era del asistente por pasos.
// import { ICON_TOKENS } from "@/tokens";

import { useProductForm } from "../../../hooks/use-product-form";
import { useProductPrice } from "../../../hooks/use-product-price";
import type { ProductFormLayoutProps } from "../../../interfaces";
import { BASICS_STEP, PRICING_STEP, PRODUCTS_LIST_HREF } from "../../../libs";
import { ProductBasicsStep } from "../basics";
import { ProductPricingStep } from "../pricing";
// El paso de la receta y el indicador de pasos vuelven con las recetas.
// import { ProductRecipeStep } from "../recipe";
// import { ProductFormStepper } from "../stepper";

import {
    productFormActionsVariants,
    productFormCancelVariants,
    productFormFooterNoteVariants,
    productFormGridVariants,
    productFormPageFooterVariants,
    productFormPageVariants,
    productFormSectionBodyVariants,
    productFormSectionHeaderVariants,
    productFormSectionHintVariants,
    productFormSectionTitleVariants,
    productFormSectionVariants,
    productFormVariants,
} from "./product-form-layout.style";


/**
 * El formulario del producto, el mismo para crear y para editar.
 *
 * Una sola página: a la izquierda los datos básicos y a la derecha el precio,
 * con un pie de acciones debajo de las dos. Era un asistente de tres pasos
 * mientras el producto llevaba receta; sin ella quedan dos bloques cortos, y
 * partirlos en pasos solo agregaba clics.
 *
 * El estado del formulario lo lleva `useProductForm` (react-hook-form) y los
 * bloques son de presentación. Lo único que cambia entre crear y editar son
 * los textos, los valores con los que arranca y qué pasa al guardar, y todo
 * eso llega por props.
 */
export default function ProductFormLayout({
    formMessages,
    currentCategory,
    ...options
}: ProductFormLayoutProps) {
    const { form, canSubmit, submit } = useProductForm(options);

    // Va aquí y no dentro del bloque de precio porque, además de pintarse
    // allí, decide si se puede guardar: mientras el backend no responda al
    // último cambio, o si no pudo calcular, precio y margen no cuadran y el
    // alta los rechazaría.
    const pricing = useProductPrice(form);
    const isPricingSettled = !pricing.isCalculating && !pricing.errorMessage;

    const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
        if (!isPricingSettled) {
            event.preventDefault();
            return;
        }

        void submit(event);
    };

    const basicsTitleId = React.useId();
    const pricingTitleId = React.useId();

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
                    onSubmit={handleSubmit}
                    className={productFormVariants()}
                >
                    <div className={productFormGridVariants()}>
                        <section
                            aria-labelledby={basicsTitleId}
                            className={productFormSectionVariants({ span: "basics" })}
                        >
                            <header className={productFormSectionHeaderVariants()}>
                                <h2 id={basicsTitleId} className={productFormSectionTitleVariants()}>
                                    {BASICS_STEP.title}
                                </h2>
                                <p className={productFormSectionHintVariants()}>
                                    {BASICS_STEP.subtitle}
                                </p>
                            </header>

                            <div className={productFormSectionBodyVariants()}>
                                <ProductBasicsStep currentCategory={currentCategory} />
                            </div>
                        </section>

                        <section
                            aria-labelledby={pricingTitleId}
                            className={productFormSectionVariants({ span: "pricing" })}
                        >
                            <header className={productFormSectionHeaderVariants()}>
                                <h2 id={pricingTitleId} className={productFormSectionTitleVariants()}>
                                    {PRICING_STEP.title}
                                </h2>
                                <p className={productFormSectionHintVariants()}>
                                    {PRICING_STEP.subtitle}
                                </p>
                            </header>

                            <div className={productFormSectionBodyVariants()}>
                                <ProductPricingStep pricing={pricing} />
                            </div>
                        </section>
                    </div>

                    <footer className={productFormPageFooterVariants()}>
                        <p className={productFormFooterNoteVariants()}>
                            {messages.common.forms.requiredFields}
                        </p>

                        <div className={productFormActionsVariants()}>
                            <Link
                                href={PRODUCTS_LIST_HREF}
                                className={productFormCancelVariants()}
                            >
                                {messages.common.actions.cancel}
                            </Link>

                            {/* El único botón principal de la pantalla. Cuándo se
                            puede pulsar lo deciden `useProductForm` —todo lo
                            obligatorio lleno y válido, sin otro guardado en
                            camino y, al editar, con algo que haya cambiado— y
                            el cálculo del precio, que tiene que estar al día. */}
                            <GenericButton
                                type="submit"
                                variant="primary"
                                label={formMessages.submit}
                                disabled={!canSubmit || !isPricingSettled}
                            />
                        </div>
                    </footer>

                    {/* Así era el cuerpo del asistente por pasos: el indicador
                    arriba, el paso que tocara en medio y un pie con "Atrás" y
                    "Continuar", que en el último paso guardaba. Vuelve con las
                    recetas, junto con la versión por pasos de `useProductForm`.

                    <ProductFormStepper steps={PRODUCT_FORM_STEPS} currentIndex={stepIndex} />

                    <div ref={bodyRef} tabIndex={-1} aria-label={step.title} className={productFormBodyVariants()}>
                        {step.id === "basics" && (<ProductBasicsStep currentCategory={currentCategory} />)}
                        {step.id === "recipe" && (<ProductRecipeStep />)}
                        {step.id === "pricing" && (<ProductPricingStep pricing={pricing} />)}
                    </div>

                    <footer className={productFormFooterVariants()}>
                        ...
                        {isFirstStep ? (
                            <Link href={PRODUCTS_LIST_HREF} className={productFormCancelVariants()}>
                                {messages.common.actions.cancel}
                            </Link>
                        ) : (
                            <GenericButton type="button" variant="ghost" label={messages.common.actions.back}
                                startIcon={ICON_TOKENS.BACK} onClick={goToPreviousStep} />
                        )}
                        <GenericButton type="submit" variant="primary"
                            label={isLastStep ? formMessages.submit : messages.common.actions.continue}
                            disabled={!canSubmit || (isLastStep && !isPricingSettled)}
                            {...(!isLastStep && { endIcon: ICON_TOKENS.NEXT })} />
                    </footer>

                    Al cambiar de paso el foco pasaba al contenido nuevo, porque
                    el contenido cambiaba sin que cambiara la URL:

                    React.useEffect(() => {
                        if (previousStepIndex.current === stepIndex) return;
                        previousStepIndex.current = stepIndex;
                        bodyRef.current?.focus();
                    }, [stepIndex]);
                    */}
                </form>
            </div>
        </FormProvider>
    );
};
