"use client";

import * as React from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";

import { GenericButton, Modal, Switch, TextAreaField, TextField } from "@/components";
import { messages } from "@/messages";

import { CategoryFormValues, CategoryList } from "../../interfaces";
import {
    CATEGORY_ACTIVE_HINT,
    CATEGORY_FIELD_HINTS,
    CATEGORY_FORM_RULES,
    CATEGORY_MODAL_COPY,
    hasCategoryChanges,
} from "../../libs";
import {
    categoryFormModalCancelVariants,
    categoryFormModalToggleVariants,
    categoryFormModalVariants,
} from "./category-form-modal.style";


const formMessages = messages.products.categories.form;


/** Conecta el formulario con el botón de guardar, que está en el pie del modal. */
const FORM_ID = "category-form";


interface CategoryFormModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;

    /** Categoría que se edita. Si no llega, el modal sirve para crear una nueva. */
    category?: CategoryList | undefined;

    /**
     * Recibe los valores ya validados. Si devuelve una promesa, el botón de
     * guardar queda deshabilitado hasta que termine, así no se guarda dos
     * veces. Cerrar el modal le toca a quien lo abrió.
     */
    onSubmit: (values: CategoryFormValues) => void | Promise<void>;

    className?: string;
}


export default function CategoryFormModal({
    open,
    onOpenChange,
    category,
    onSubmit,
    className,
}: CategoryFormModalProps) {
    const { control, formState, handleSubmit } = useFormContext<CategoryFormValues>();

    const mode = category ? "edit" : "create";
    const modeMessages = CATEGORY_MODAL_COPY[mode];

    // Se observan los campos por nombre porque así llegan siempre con valor y
    // se pueden comparar directo con la categoría guardada.
    const [name, description, isActive] = useWatch({
        control,
        name: ["name", "description", "isActive"],
    });

    // Al editar solo se puede guardar si algo cambió, para no enviar una
    // petición que deja todo igual.
    const hasChanges =
        !category || hasCategoryChanges({ name, description, isActive }, category);

    const canSubmit = formState.isValid && hasChanges && !formState.isSubmitting;

    // El modal abre con el foco en el nombre y no en el botón de cerrar, que
    // es lo primero que encontraría el teclado.
    const nameFieldRef = React.useRef<HTMLInputElement>(null);

    return (
        <Modal
            open={open}
            onOpenChange={onOpenChange}
            title={modeMessages.title}
            description={modeMessages.description}
            size="lg"
            initialFocus={nameFieldRef}
            closeLabel={formMessages.close}
            // Con cambios sin guardar, un clic fuera del modal no lo cierra.
            // Escape, la equis y cancelar sí lo cierran.
            disableDismiss={formState.isDirty}
            className={className}
            footer={
                <>
                    <GenericButton
                        type="button"
                        variant="ghost"
                        label={messages.common.actions.cancel}
                        onClick={() => onOpenChange(false)}
                        className={categoryFormModalCancelVariants()}
                    />

                    {/* Está fuera del formulario, así que se conecta con él
                        por su id. */}
                    <GenericButton
                        type="submit"
                        form={FORM_ID}
                        label={modeMessages.submit}
                        disabled={!canSubmit}
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
                    rules={CATEGORY_FORM_RULES.name}
                    render={({ field, fieldState }) => (
                        <TextField
                            {...field}
                            // La referencia la usan react-hook-form, para
                            // enfocar el campo con error, y el modal, para el
                            // foco inicial.
                            ref={(node) => {
                                field.ref(node);
                                nameFieldRef.current = node;
                            }}
                            label={formMessages.name.label}
                            required
                            error={fieldState.error?.message ?? false}
                            placeholder={formMessages.name.placeholder}
                            helperText={CATEGORY_FIELD_HINTS.name}
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
                            label={formMessages.description.label}
                            error={fieldState.error?.message ?? false}
                            placeholder={formMessages.description.placeholder}
                            helperText={CATEGORY_FIELD_HINTS.description}
                            rows={3}
                        />
                    )}
                />

                {/* El estado solo se muestra al editar, porque toda categoría
                    nueva se crea activa. */}
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
                                    label={formMessages.activeLabel}
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
}
