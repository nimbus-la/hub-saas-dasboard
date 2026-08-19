"use client";

import * as React from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";

import { GenericButton, Modal, Switch, TextAreaField, TextField } from "@/components";
import {
    CATEGORY_ACTIVE_HINT,
    CATEGORY_FIELD_HINTS,
    CATEGORY_FORM_RULES,
    CATEGORY_MODAL_COPY,
    hasCategoryChanges,
} from "@/features/products/libs/category-form";
import { messages } from "@/messages";

import { CategoryFormValues, CategoryList } from "../../interfaces";
import { categoryFormModalToggleVariants, categoryFormModalVariants } from "./category-form-modal.style";



/** Une el `<form>` del cuerpo con su botón de envío, que vive en el pie. */
const FORM_ID = "category-form";


interface CategoryFormModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;

    /**
     * Categoría que se edita.
     *
     * Su ausencia es la que pone el modal en modo alta: no hace falta un
     * `mode` aparte porque no existe la combinación "editar sin categoría".
     */
    category?: CategoryList | undefined;

    /**
     * Recibe los valores ya validados. Cerrar el modal es cosa de quien lo abre.
     *
     * Puede devolver una promesa: mientras esté pendiente, react-hook-form
     * mantiene `isSubmitting` y el botón de envío se deshabilita solo. Es lo
     * que impide que un segundo clic cree la categoría dos veces.
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
    const message = messages.products.categories.form;
    const { control, formState, handleSubmit } = useFormContext<CategoryFormValues>();


    const mode = category ? "edit" : "create";
    const generalMessage = CATEGORY_MODAL_COPY[mode];


    /*
     * Lo escrito ahora mismo, para decidir si el botón se puede pulsar.
     *
     * Se vigilan los tres campos por nombre —y no el formulario entero— porque
     * `useWatch` sin `name` devuelve los valores como parciales y obligaría a
     * un `?? ""` por campo justo donde se compara si algo cambió.
     */
    const [name, description, isActive] = useWatch({
        control,
        name: ["name", "description", "isActive"],
    });


    /*
     * Cuándo se puede enviar.
     *
     * Dos condiciones, y la segunda solo al editar: el formulario tiene que ser
     * válido —mismas reglas en los dos modos— y, si se está editando, algo
     * tiene que haber cambiado respecto a lo guardado. Reabrir una categoría,
     * mirarla y pulsar "Guardar cambios" mandaría una petición que no cambia
     * nada, así que hasta que se toque un campo el botón se queda apagado.
     *
     * `isValid` viene de react-hook-form, que revalida el formulario entero en
     * cada cambio; así el botón se enciende y se apaga solo, sin repetir aquí
     * ninguna de las reglas.
     */
    const hasChanges =
        !category || hasCategoryChanges({ name, description, isActive }, category);

    const canSubmit = formState.isValid && hasChanges && !formState.isSubmitting;


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
            title={generalMessage.title}
            description={generalMessage.description}
            size="lg"
            initialFocus={nameFieldRef}
            closeLabel={message.close}
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
                        label={generalMessage.submit}
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
                            ref={(node) => {
                                field.ref(node);
                                nameFieldRef.current = node;
                            }}
                            label={message.name.label}
                            required
                            error={fieldState.error?.message ?? false}
                            placeholder={message.name.placeholder}
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
                            label={message.description.label}
                            error={fieldState.error?.message ?? false}
                            placeholder={message.description.placeholder}
                            helperText={CATEGORY_FIELD_HINTS.description}
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
                                    label={message.activeLabel}
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
