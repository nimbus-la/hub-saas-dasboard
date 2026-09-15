"use client";

// ── Formulario de alta de producto ──────────────────────────────────────────
// Compone react-hook-form con la navegación entre pasos y devuelve una sola
// API a la pantalla. El borrador, los errores y qué campo está tocado los
// lleva la librería; aquí sólo vive lo que ella no sabe: en qué paso estamos y
// qué campos hay que dar por buenos antes de avanzar.

import * as React from "react";
import { useForm, useFormState } from "react-hook-form";

import { ProductFormValues } from "../interfaces";
import { DEFAULT_PRODUCT_FORM_VALUES, PRODUCT_FORM_STEP_LENGTH, getProductFormStep } from "../libs";


export function useProductForm() {
    const form = useForm<ProductFormValues>({
        defaultValues: DEFAULT_PRODUCT_FORM_VALUES,
        mode: "onTouched",
        reValidateMode: "onChange",
    });

    const [stepIndex, setStepIndex] = React.useState<number>(0);

    const step = getProductFormStep(stepIndex);
    const isFirstStep = stepIndex === 0;
    const isLastStep = stepIndex === PRODUCT_FORM_STEP_LENGTH - 1;

    // `isValid` solo revisa los campos que están en pantalla, porque
    // react-hook-form se salta los que se desmontaron al cambiar de paso. Por
    // eso sirve para saber si el paso actual está completo sin validar los
    // pasos que la persona todavía no ha visto.
    const { isValid: isStepValid } = useFormState({ control: form.control });

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
     *
     * El botón ya está deshabilitado mientras el paso no es válido, pero se
     * vuelve a validar aquí por si el formulario se envía de otra forma.
     */
    const submitStep = React.useCallback(
        async (event: React.SubmitEvent<HTMLFormElement>) => {
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
                Math.min(current + 1, PRODUCT_FORM_STEP_LENGTH - 1)
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
        /** El paso en pantalla no tiene campos vacíos, inválidos ni con error. */
        isStepValid,
        submitStep,
        goToPreviousStep,
    };
}
