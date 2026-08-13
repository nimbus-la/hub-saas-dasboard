"use client";

import { Controller, type Control } from "react-hook-form";

import { InputSelector, TextAreaField, TextField } from "@/components";
import { cn } from "@/lib/utils";
import { messages } from "@/messages";
import {
    PRODUCT_CATEGORY_OPTIONS,
    PRODUCT_DESCRIPTION_MAX,
    PRODUCT_FORM_RULES,
    PRODUCT_NAME_LIMITS,
    type ProductFormValues,
} from "@/features/products/libs/product-form";

import ProductImageField from "./ProductImageField";
import {
    productBasicsFullRowVariants,
    productBasicsGridVariants,
    productBasicsStepVariants,
} from "./product-basics-step.style";


/**
 * Paso 1 del formulario de producto: datos básicos.
 *
 * Va dentro de un `FormProvider` y recibe el `control` de react-hook-form.
 * Cada campo va envuelto en un `Controller` porque los controles del design
 * system exponen `onChange(valor)` en lugar del evento nativo del DOM, que es
 * lo que esperaría `register`. El `Controller` hace de traductor y a cambio
 * mantiene el `ref`, que es con lo que react-hook-form lleva el foco al primer
 * campo que falla.
 */

/** Lo que dice este paso. Ver `@/messages`. */
const COPY = messages.products.create.basics;

interface ProductBasicsStepProps {
    control: Control<ProductFormValues>;
    className?: string;
}

export default function ProductBasicsStep({
    control,
    className,
}: ProductBasicsStepProps) {
    return (
        // El `fieldset` agrupa los campos del paso y la leyenda le pone nombre
        // al grupo para quien navega con lector de pantalla. No se ve porque en
        // pantalla ese nombre ya lo da el indicador de la cabecera.
        <fieldset className={cn(productBasicsStepVariants(), className)}>
            <legend className="sr-only">{COPY.legend}</legend>

            <div className={productBasicsGridVariants()}>
                <Controller
                    control={control}
                    name="name"
                    rules={PRODUCT_FORM_RULES.name}
                    render={({ field, fieldState }) => (
                        <TextField
                            {...field}
                            label={COPY.name.label}
                            required
                            size="md"
                            error={fieldState.error?.message ?? false}
                            placeholder={COPY.name.placeholder}
                            helperText={COPY.name.helper}
                            maxLength={PRODUCT_NAME_LIMITS.max}
                            showCount
                            autoComplete="off"
                        />
                    )}
                />

                <Controller
                    control={control}
                    name="category"
                    rules={PRODUCT_FORM_RULES.category}
                    render={({ field, fieldState }) => (
                        <InputSelector
                            {...field}
                            label={COPY.category.label}
                            required
                            size="md"
                            options={PRODUCT_CATEGORY_OPTIONS}
                            error={fieldState.error?.message ?? false}
                            placeholder={COPY.category.placeholder}
                            helperText={COPY.category.helper}
                            emptyMessage={COPY.category.empty}
                            clearable
                        />
                    )}
                />

                <Controller
                    control={control}
                    name="description"
                    rules={PRODUCT_FORM_RULES.description}
                    render={({ field, fieldState }) => (
                        <TextAreaField
                            {...field}
                            label={COPY.description.label}
                            error={fieldState.error?.message ?? false}
                            placeholder={COPY.description.placeholder}
                            maxLength={PRODUCT_DESCRIPTION_MAX}
                            showCount
                            rows={4}
                            className={productBasicsFullRowVariants()}
                        />
                    )}
                />
            </div>

            {/* La foto no lleva reglas de formulario: un archivo que no sirve
                nunca llega a ser el valor del campo, así que aquí sólo entran
                `File` válidos o `null`. El porqué del rechazo lo cuenta el
                propio componente, que es quien conoce el archivo. */}
            <Controller
                control={control}
                name="image"
                render={({ field }) => (
                    <ProductImageField
                        value={field.value}
                        onChange={field.onChange}
                    />
                )}
            />
        </fieldset>
    );
};
