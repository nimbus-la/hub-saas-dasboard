"use client";

import * as React from "react";
import { Controller } from "react-hook-form";

import { GenericButton, Modal, Switch, TextAreaField, TextField } from "@/components";
import { useCategoryForm } from "@/features/products/hooks/use-category-form";
import {
    CATEGORY_ACTIVE_HINT,
    CATEGORY_FORM_RULES,
    CATEGORY_MODAL_COPY,
} from "@/features/products/libs/category-form";
import type { Category, CategoryFormValues } from "@/features/products/interfaces";
import { messages } from "@/messages";

import {
    categoryFormModalErrorVariants,
    categoryFormModalToggleVariants,
    categoryFormModalVariants,
} from "./category-form-modal.style";


/**
 * Modal de alta y edición de una categoría.
 *
 * Un solo componente para los dos modos: comparten campos, reglas y mensajes
 * de error, y se diferencian en lo que dicen —`CATEGORY_MODAL_COPY`— y en si
 * enseñan el interruptor de estado. Dos componentes casi iguales habrían
 * significado corregir cada validación dos veces.
 *
 * El estado lo lleva `useCategoryForm`; aquí solo se decide la estructura.
 *
 * Cada campo va envuelto en un `Controller` porque los controles del design
 * system exponen `onChange(valor)` en lugar del evento nativo del DOM, que es
 * lo que esperaría `register` —el mismo motivo que en el formulario de
 * producto—.
 */

/** Une el `<form>` del cuerpo con su botón de envío, que vive en el pie. */
const FORM_ID = "category-form";

/** Lo que dice este modal. Ver `@/messages`. */
const COPY = messages.products.categories.form;


interface CategoryFormModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;

    /**
     * Categoría que se edita.
     *
     * Su ausencia es la que pone el modal en modo alta: no hace falta un
     * `mode` aparte porque no existe la combinación "editar sin categoría".
     */
    category?: Category | undefined;

    /**
     * ¿Ya hay otra categoría con este nombre? La respuesta la tiene la
     * pantalla, que es la que sostiene la lista completa.
     */
    isNameTaken: (name: string) => boolean;

    /**
     * Recibe los valores ya validados. Cerrar el modal es cosa de quien lo abre.
     *
     * Puede devolver una promesa: mientras esté pendiente, react-hook-form
     * mantiene `isSubmitting` y el botón de envío se deshabilita solo. Es lo
     * que impide que un segundo clic cree la categoría dos veces.
     */
    onSubmit: (values: CategoryFormValues) => void | Promise<void>;

    /**
     * Motivo por el que el guardado no salió.
     *
     * Lo pone quien envía, no el formulario: no es un problema del valor que se
     * escribió —de eso ya avisan las reglas de cada campo— sino del intento de
     * guardarlo. `null` cuando no hay nada que contar.
     */
    submitError?: string | null;

    className?: string;
}

export default function CategoryFormModal({
    open,
    onOpenChange,
    category,
    isNameTaken,
    onSubmit,
    submitError = null,
    className,
}: CategoryFormModalProps) {
    const mode = category ? "edit" : "create";
    const copy = CATEGORY_MODAL_COPY[mode];

    const { form, nameRules } = useCategoryForm({ open, category, isNameTaken });
    const { control, handleSubmit, formState } = form;

    /*
     * El foco entra por el nombre.
     *
     * Sin esto Base UI enfoca el primer elemento tabulable, que es la equis de
     * la cabecera: quien navega con teclado empezaría por la salida en lugar de
     * por el primer campo. La referencia se comparte con react-hook-form —que
     * usa la suya para llevar el foco al primer campo que falla al enviar—, de
     * ahí que se asignen las dos en el mismo callback.
     */
    const nameFieldRef = React.useRef<HTMLInputElement>(null);

    return (
        <Modal
            open={open}
            onOpenChange={onOpenChange}
            title={copy.title}
            description={copy.description}
            size="lg"
            initialFocus={nameFieldRef}
            closeLabel={COPY.close}
            // Con cambios sin guardar, un clic fuera tira el trabajo. `Escape`,
            // la equis y "Cancelar" siguen cerrando: quitar también esas tres
            // dejaría el modal sin salida por teclado.
            disableDismiss={formState.isDirty}
            className={className}
            footer={
                <>
                    <GenericButton
                        type="button"
                        variant="ghost"
                        label={messages.common.actions.cancel}
                        onClick={() => onOpenChange(false)}
                        className="border border-neutral-300"
                    />

                    {/* El botón vive en el pie del modal, fuera del `<form>`,
                        así que lo enlaza por `form=`: es lo que permite que el
                        pie mantenga su geometría sin envolver todo el panel en
                        el formulario. */}
                    <GenericButton
                        type="submit"
                        form={FORM_ID}
                        label={copy.submit}
                        disabled={formState.isSubmitting}
                    />
                </>
            }
        >
            <form
                id={FORM_ID}
                noValidate
                onSubmit={handleSubmit(onSubmit)}
                className={categoryFormModalVariants()}
            >
                {/* `role="alert"` para que los lectores de pantalla lo anuncien
                    al aparecer: quien no ve el modal necesita enterarse de que
                    el envío falló sin tener que ir a buscarlo. */}
                {submitError && (
                    <p role="alert" className={categoryFormModalErrorVariants()}>
                        {submitError}
                    </p>
                )}

                <Controller
                    control={control}
                    name="name"
                    rules={nameRules}
                    render={({ field, fieldState }) => (
                        <TextField
                            {...field}
                            ref={(node) => {
                                field.ref(node);
                                nameFieldRef.current = node;
                            }}
                            label={COPY.name.label}
                            required
                            error={fieldState.error?.message ?? false}
                            placeholder={COPY.name.placeholder}
                            helperText={COPY.name.helper}
                            autoComplete="off"
                        />
                    )}
                />

                <Controller
                    control={control}
                    name="description"
                    rules={CATEGORY_FORM_RULES.description}
                    render={({ field, fieldState }) => (
                        <TextAreaField
                            {...field}
                            label={COPY.description.label}
                            error={fieldState.error?.message ?? false}
                            placeholder={COPY.description.placeholder}
                            rows={3}
                        />
                    )}
                />

                {/* Solo al editar: una categoría nueva nace activa —nadie da de
                    alta algo que no piensa ofrecer— y ofrecer el interruptor en
                    el alta solo añade una decisión que no toca tomar todavía. */}
                {mode === "edit" && (
                    <Controller
                        control={control}
                        name="isActive"
                        render={({ field }) => (
                            <div className={categoryFormModalToggleVariants()}>
                                <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    name={field.name}
                                    label={COPY.activeLabel}
                                    description={
                                        field.value
                                            ? CATEGORY_ACTIVE_HINT.on
                                            : CATEGORY_ACTIVE_HINT.off
                                    }
                                />
                            </div>
                        )}
                    />
                )}
            </form>
        </Modal>
    );
};
