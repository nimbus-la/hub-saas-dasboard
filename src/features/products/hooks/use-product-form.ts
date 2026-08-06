"use client";

// ── Formulario de alta de producto ──────────────────────────────────────────
// Compone react-hook-form con la navegación entre pasos y devuelve una sola
// API a la pantalla. El borrador, los errores y qué campo está tocado los
// lleva la librería; aquí sólo vive lo que ella no sabe: en qué paso estamos y
// qué campos hay que dar por buenos antes de avanzar.

import * as React from "react";
import { useForm } from "react-hook-form";

import {
    EMPTY_PRODUCT_FORM_VALUES,
    PRODUCT_FORM_STEP_COUNT,
    getProductFormStep,
    type ProductFormValues,
} from "@/features/products/libs/product-form";

export function useProductForm() {
    /*
     * `onTouched`: el primer aviso llega al salir del campo y, a partir de
     * ahí, se revalida en cada tecla.
     *
     * Es la única combinación que da las dos mitades del comportamiento que se
     * quiere. Un campo obligatorio está vacío desde el primer render, así que
     * validar antes de que nadie lo toque sería regañar por adelantado; pero
     * una vez que el mensaje está en pantalla, mantenerlo mientras se corrige
     * convierte cada tecla en un reproche.
     *
     * `onBlur` a secas no vale, y el motivo cuesta descubrirlo: con él el
     * error sólo se recalcula al volver a salir del campo, de modo que un
     * nombre ya corregido sigue en rojo mientras se escribe. `reValidateMode`
     * tampoco lo arregla — sólo entra en juego después del primer envío del
     * formulario, no antes.
     */
    const form = useForm<ProductFormValues>({
        defaultValues: EMPTY_PRODUCT_FORM_VALUES,
        mode: "onTouched",
        reValidateMode: "onChange",
    });

    const [stepIndex, setStepIndex] = React.useState(0);

    const step = getProductFormStep(stepIndex);
    const isFirstStep = stepIndex === 0;
    const isLastStep = stepIndex === PRODUCT_FORM_STEP_COUNT - 1;

    const goToPreviousStep = React.useCallback(() => {
        setStepIndex((current) => Math.max(current - 1, 0));
    }, []);

    /**
     * Valida el paso e intenta avanzar.
     *
     * Se valida sólo lo que el paso declara y no el formulario entero: al
     * llegar al paso 2 con el 3 aún vacío, un `handleSubmit` marcaría en rojo
     * campos que el usuario todavía no ha visto.
     *
     * `shouldFocus` deja el cursor en el primer campo que falla. Sin él, quien
     * navega con teclado se queda al final del formulario mientras el error
     * está arriba, y con el panel largo ni siquiera lo ve.
     */
    const submitStep = React.useCallback(
        async (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();

            // Nada que validar en un paso sin campos; `trigger([])` validaría
            // el formulario entero, que es justo lo contrario de lo que se
            // quiere aquí.
            const isValid =
                step.fields.length === 0 ||
                (await form.trigger(step.fields, { shouldFocus: true }));

            if (!isValid) return;

            // El último paso no avanza: guardará cuando exista el servicio.
            if (isLastStep) return;

            setStepIndex((current) =>
                Math.min(current + 1, PRODUCT_FORM_STEP_COUNT - 1)
            );
        },
        [form, isLastStep, step.fields]
    );

    return {
        /** Instancia de react-hook-form: `control`, `formState`, `watch`… */
        form,
        step,
        stepIndex,
        isFirstStep,
        isLastStep,
        submitStep,
        goToPreviousStep,
    };
}
