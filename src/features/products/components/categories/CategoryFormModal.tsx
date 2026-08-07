"use client";

import * as React from "react";
import { Controller } from "react-hook-form";

import { GenericButton, Modal, Switch, TextAreaField, TextField } from "@/components";
import { useCategoryForm } from "@/features/products/hooks/use-category-form";
import {
    CATEGORY_ACTIVE_HINT,
    CATEGORY_FORM_RULES,
    CATEGORY_MODAL_COPY,
    type CategoryFormValues,
} from "@/features/products/libs/category-form";
import type { Category } from "@/lib/categories";

import {
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

const COPY = {
    cancel: "Cancelar",
    nameLabel: "Nombre",
    namePlaceholder: "Ej. Bebidas calientes",
    nameHelper: "Así aparecerá como sección de la carta.",
    descriptionLabel: "Descripción",
    descriptionPlaceholder: "Ej. Cafés, tés e infusiones preparados al momento.",
    descriptionHelper: "Opcional. Una frase de apoyo bajo el nombre de la sección.",
    activeLabel: "Categoría activa",
    closeLabel: "Cerrar el formulario de categoría",
} as const;


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

    /** Recibe los valores ya validados. Cerrar el modal es cosa de quien lo abre. */
    onSubmit: (values: CategoryFormValues) => void;

    className?: string;
}

export default function CategoryFormModal({
    open,
    onOpenChange,
    category,
    isNameTaken,
    onSubmit,
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
            closeLabel={COPY.closeLabel}
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
                        label={COPY.cancel}
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
                            label={COPY.nameLabel}
                            required
                            error={fieldState.error?.message ?? false}
                            placeholder={COPY.namePlaceholder}
                            helperText={COPY.nameHelper}
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
                            label={COPY.descriptionLabel}
                            error={fieldState.error?.message ?? false}
                            placeholder={COPY.descriptionPlaceholder}
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
                        name="active"
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
