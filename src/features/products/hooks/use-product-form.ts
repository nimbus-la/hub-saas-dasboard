"use client";

// ── Formulario del producto ─────────────────────────────────────────────────
// Compone react-hook-form con el guardado y devuelve una sola API a la
// pantalla. El borrador, los errores y qué campo está tocado los lleva la
// librería; aquí sólo vive lo que ella no sabe: si hay algo que guardar y que
// no se guarde dos veces.
//
// No sabe si está creando o editando. Quien lo usa le pasa con qué valores
// empieza y qué hacer al guardar, así el alta y la edición comparten todo el
// formulario.

import * as React from "react";
import { useForm, useWatch } from "react-hook-form";

import type { ProductFormOptions, ProductFormValues } from "../interfaces";
import { hasProductChanges } from "../mappers";


export function useProductForm({
    defaultValues,
    onSave,
    isSaving,
    requireChanges = false,
}: ProductFormOptions) {
    const form = useForm<ProductFormValues>({
        defaultValues,
        mode: "onTouched",
        reValidateMode: "onChange",
    });

    // Se compara con los valores con los que arrancó, con la misma regla que
    // arma el cuerpo de la edición. Así, si alguien cambia algo y lo deja como
    // estaba, el botón vuelve a bloquearse. Con `compute` solo se vuelve a
    // pintar cuando cambia la respuesta, no con cada tecla.
    const hasChanges = useWatch({
        control: form.control,
        compute: (values) => !requireChanges || hasProductChanges(values, defaultValues),
    });

    // El botón no se bloquea por errores: con todo en una página, pulsarlo es
    // la forma de ver qué falta, y el envío lleva el foco al primer campo que
    // falla. Solo se bloquea cuando pulsarlo no puede hacer nada.
    const canSubmit = !isSaving && hasChanges;

    // Marca de "ya hay un envío en curso". Va en un ref y no en estado porque
    // tiene que cambiar en el acto: el botón se bloquea recién cuando React
    // vuelve a pintar, y dos clics seguidos alcanzan a entrar los dos antes de
    // eso. Sin la marca se guardaba dos veces.
    const isBusyRef = React.useRef(false);

    // Cuando el guardado termina, salga bien o mal, se puede volver a enviar.
    // Si el backend lo rechaza, la persona corrige y reintenta desde aquí.
    React.useEffect(() => {
        if (!isSaving) isBusyRef.current = false;
    }, [isSaving]);

    /**
     * Valida el formulario entero y, si está completo, lo entrega a `onSave`.
     *
     * `shouldFocus` deja el cursor en el primer campo que falla. Con dos
     * columnas el error puede quedar lejos del botón, y sin el foco quien
     * navega con teclado ni siquiera lo vería.
     */
    const submit = React.useCallback(
        async (event: React.SubmitEvent<HTMLFormElement>) => {
            event.preventDefault();

            // Se toma la marca antes de cualquier `await`, que es justo donde
            // un segundo clic se colaría.
            if (isBusyRef.current) return;
            isBusyRef.current = true;

            // Si el envío termina sin llegar a guardar, la marca se suelta al
            // salir. Si se entregó a `onSave`, la suelta el efecto de arriba
            // cuando el guardado acaba.
            let isHandedOff = false;

            try {
                const isValid = await form.trigger(undefined, { shouldFocus: true });

                // El botón ya está bloqueado sin cambios; esto cubre un envío
                // que llegue por otro lado, como un Enter.
                if (!isValid || !hasChanges) return;

                // La vuelta al listado la hace quien guarda, cuando el backend
                // confirma. Si lo rechaza, la persona se queda aquí con su
                // borrador para corregirlo.
                isHandedOff = true;
                onSave(form.getValues());
            } finally {
                if (!isHandedOff) isBusyRef.current = false;
            }
        },
        [form, hasChanges, onSave]
    );

    return {
        /** Instancia de react-hook-form: `control`, `formState`, `watch`… */
        form,
        /** Si el botón de guardar se puede pulsar: sin otro guardado en camino y, si se exigen, con cambios. */
        canSubmit,
        submit,
    };
}


// ── El asistente por pasos ──────────────────────────────────────────────────
// Así era el hook cuando el formulario iba en tres pasos (datos básicos,
// receta y precio). Se deja comentado porque el asistente puede volver con las
// recetas: entonces cada paso validaba solo sus campos antes de avanzar, y al
// guardar, si algo fallaba en un paso anterior, volvía a ese paso
// (`findFirstInvalidStep`). Los pasos siguen declarados en `libs/product-form`.
//
// import * as React from "react";
// import { useForm, useFormState, useWatch } from "react-hook-form";
//
// import type { ProductFormOptions, ProductFormValues } from "../interfaces";
// import {
//     PRODUCT_FORM_STEP_LENGTH,
//     findFirstInvalidStep,
//     getProductFormStep,
// } from "../libs";
// import { hasProductChanges } from "../mappers";
//
//
// export function useProductForm({
//     defaultValues,
//     onSave,
//     isSaving,
//     requireChanges = false,
// }: ProductFormOptions) {
//     const form = useForm<ProductFormValues>({
//         defaultValues,
//         mode: "onTouched",
//         reValidateMode: "onChange",
//     });
//
//     const [stepIndex, setStepIndex] = React.useState<number>(0);
//
//     const step = getProductFormStep(stepIndex);
//     const isFirstStep = stepIndex === 0;
//     const isLastStep = stepIndex === PRODUCT_FORM_STEP_LENGTH - 1;
//
//     // `isValid` solo revisa los campos que están en pantalla, porque
//     // react-hook-form se salta los que se desmontaron al cambiar de paso. Por
//     // eso sirve para saber si el paso actual está completo sin validar los
//     // pasos que la persona todavía no ha visto.
//     const { isValid: isStepValid } = useFormState({ control: form.control });
//
//     // Se compara con los valores con los que arrancó, con la misma regla que
//     // arma el cuerpo de la edición. Así, si alguien cambia algo y lo deja como
//     // estaba, el botón vuelve a bloquearse. Con `compute` solo se vuelve a
//     // pintar cuando cambia la respuesta, no con cada tecla.
//     const hasChanges = useWatch({
//         control: form.control,
//         compute: (values) => !requireChanges || hasProductChanges(values, defaultValues),
//     });
//
//     // Avanzar solo pide que el paso esté completo; guardar además pide que no
//     // haya otro guardado en camino y, si se exigen, que haya cambios.
//     const canSubmit = isStepValid && (!isLastStep || (!isSaving && hasChanges));
//
//     const goToPreviousStep = React.useCallback(() => {
//         setStepIndex((current) => Math.max(current - 1, 0));
//     }, []);
//
//     // Marca de "ya hay un envío en curso". Va en un ref y no en estado porque
//     // tiene que cambiar en el acto: el botón se bloquea recién cuando React
//     // vuelve a pintar, y dos clics seguidos alcanzan a entrar los dos antes de
//     // eso. Sin la marca se guardaba dos veces, o se saltaba un paso entero.
//     const isBusyRef = React.useRef(false);
//
//     // Cuando el guardado termina, salga bien o mal, se puede volver a enviar.
//     // Si el backend lo rechaza, la persona corrige y reintenta desde aquí.
//     React.useEffect(() => {
//         if (!isSaving) isBusyRef.current = false;
//     }, [isSaving]);
//
//     /**
//      * Valida el paso e intenta avanzar.
//      *
//      * Se valida sólo lo que el paso declara y no el formulario entero: al
//      * llegar al paso 2 con el 3 aún vacío, un `handleSubmit` marcaría en rojo
//      * campos que el usuario todavía no ha visto.
//      *
//      * `shouldFocus` deja el cursor en el primer campo que falla. Sin él, quien
//      * navega con teclado se queda al final del formulario mientras el error
//      * está arriba, y con el panel largo ni siquiera lo ve.
//      *
//      * El botón ya está deshabilitado mientras el paso no es válido, pero se
//      * vuelve a validar aquí por si el formulario se envía de otra forma.
//      *
//      * En el último paso ya no queda a dónde avanzar y lo que hace es guardar.
//      */
//     const submitStep = React.useCallback(
//         async (event: React.SubmitEvent<HTMLFormElement>) => {
//             event.preventDefault();
//
//             // Se toma la marca antes de cualquier `await`, que es justo donde
//             // un segundo clic se colaría.
//             if (isBusyRef.current) return;
//             isBusyRef.current = true;
//
//             // Si el envío termina sin llegar a guardar, la marca se suelta al
//             // salir. Si se entregó a `onSave`, la suelta el efecto de arriba
//             // cuando el guardado acaba.
//             let isHandedOff = false;
//
//             try {
//                 // Nada que validar en un paso sin campos; `trigger([])` validaría
//                 // el formulario entero, que es justo lo contrario de lo que se
//                 // quiere aquí.
//                 const isValid =
//                     step.fields.length === 0 ||
//                     (await form.trigger(step.fields, { shouldFocus: true }));
//
//                 if (!isValid) return;
//
//                 if (isLastStep) {
//                     // Se revisa el formulario entero y no solo el paso: se pudo
//                     // volver atrás a cambiar algo y dejarlo a medias, y eso no se
//                     // ve desde aquí.
//                     const isComplete = await form.trigger();
//
//                     if (!isComplete) {
//                         setStepIndex(findFirstInvalidStep(form.formState.errors));
//                         return;
//                     }
//
//                     // El botón ya está bloqueado sin cambios; esto cubre un
//                     // envío que llegue por otro lado, como un Enter.
//                     if (!hasChanges) return;
//
//                     // La vuelta al listado la hace quien guarda, cuando el backend
//                     // confirma. Si lo rechaza, la persona se queda aquí con su
//                     // borrador para corregirlo.
//                     isHandedOff = true;
//                     onSave(form.getValues());
//                     return;
//                 }
//
//                 setStepIndex((current) =>
//                     Math.min(current + 1, PRODUCT_FORM_STEP_LENGTH - 1)
//                 );
//             } finally {
//                 if (!isHandedOff) isBusyRef.current = false;
//             }
//         },
//         [form, hasChanges, isLastStep, onSave, step.fields]
//     );
//
//     return {
//         /** Instancia de react-hook-form: `control`, `formState`, `watch`… */
//         form,
//         step,
//         stepIndex,
//         isFirstStep,
//         isLastStep,
//         /**
//          * Si el botón principal se puede pulsar. En los pasos intermedios basta
//          * con que el paso esté completo. En el último, además, no puede haber un
//          * guardado en camino y, si se exigen cambios, tiene que haberlos.
//          */
//         canSubmit,
//         submitStep,
//         goToPreviousStep,
//     };
// }
