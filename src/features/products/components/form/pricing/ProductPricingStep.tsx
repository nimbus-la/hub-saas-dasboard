"use client";

import { Controller, useFormContext } from "react-hook-form";

import { NumberField, Switch } from "@/components";
import { cn } from "@/lib/utils";
import { messages } from "@/messages";

import { useProductPricing } from "../../../hooks";
import type { ProductFormValues } from "../../../interfaces";
import { PRICING_RULES, PRICING_VALIDATION, hasCost } from "../../../libs";
// Precios por sucursal fuera del primer alcance. Ver la nota al final del paso.
// import BranchPricingList from "./BranchPricingList";
import PricingSummary from "./PricingSummary";
import {
    productPricingAvailabilityVariants,
    productPricingGridVariants,
    productPricingStepVariants,
} from "./product-pricing-step.style";


interface ProductPricingStepProps {
    className?: string;
}

const pricingMessages = messages.products.create.pricing;

/**
 * Paso 3 del formulario de producto: a cuánto se vende y dónde.
 *
 * Tiene que ir dentro del `FormProvider` del alta. El margen y el precio se
 * escriben los dos y cada uno rellena al otro; de esa cuenta se encarga
 * `useProductPricing`, que también trae el costo de la receta del paso
 * anterior.
 */
export default function ProductPricingStep({ className }: ProductPricingStepProps) {
    const { control } = useFormContext<ProductFormValues>();
    // `branchRows` y `customCount` vuelven aquí cuando se active la lista de
    // sucursales.
    const { global, onMarginChange, onPriceChange } = useProductPricing();

    // Sin receta con costo no hay nada sobre lo que calcular un porcentaje. El
    // precio sí se puede escribir a mano, así que solo se bloquea el margen.
    const canUseMargin = hasCost(global.cost);

    return (
        // El `legend` no se ve porque el nombre del paso ya aparece en el
        // indicador de arriba, pero sí lo lee el lector de pantalla.
        <fieldset className={cn(productPricingStepVariants(), className)}>
            <legend className="sr-only">{pricingMessages.legend}</legend>

            <div className={productPricingGridVariants()}>
                <Controller
                    control={control}
                    name="margin"
                    rules={PRICING_RULES.margin}
                    render={({ field, fieldState }) => (
                        <NumberField
                            ref={field.ref}
                            name={field.name}
                            value={field.value}
                            onChange={onMarginChange}
                            onBlur={field.onBlur}
                            disabled={(field.disabled ?? false) || !canUseMargin}
                            label={pricingMessages.margin.label}
                            size="md"
                            maxDecimals={PRICING_VALIDATION.margin.maxDecimals}
                            allowNegative
                            suffix="%"
                            placeholder={pricingMessages.margin.placeholder}
                            helperText={
                                canUseMargin
                                    ? pricingMessages.margin.helper
                                    : pricingMessages.margin.missingCost
                            }
                            error={fieldState.error?.message ?? false}
                        />
                    )}
                />

                <Controller
                    control={control}
                    name="price"
                    rules={PRICING_RULES.price}
                    render={({ field, fieldState }) => (
                        <NumberField
                            ref={field.ref}
                            name={field.name}
                            value={field.value}
                            onChange={onPriceChange}
                            onBlur={field.onBlur}
                            disabled={field.disabled ?? false}
                            label={pricingMessages.price.label}
                            required
                            size="md"
                            maxDecimals={PRICING_VALIDATION.price.maxDecimals}
                            prefix="$"
                            placeholder={pricingMessages.price.placeholder}
                            helperText={pricingMessages.price.helper}
                            error={fieldState.error?.message ?? false}
                        />
                    )}
                />
            </div>

            <PricingSummary global={global} />

            {/* No lleva reglas: las dos opciones son válidas. */}
            <Controller
                control={control}
                name="isAvailable"
                render={({ field }) => (
                    <Switch
                        name={field.name}
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        label={pricingMessages.availability.label}
                        description={
                            field.value
                                ? pricingMessages.availability.on
                                : pricingMessages.availability.off
                        }
                        className={productPricingAvailabilityVariants()}
                    />
                )}
            />

            {/* Los precios por sucursal no entran en el primer alcance. El
            backend ya tiene su servicio, pero el formulario todavía trabaja
            con sucursales de prueba y ni el alta ni la edición los envían.
            Para activarlos basta con quitar este comentario, el del import y
            volver a leer `branchRows` y `customCount` de `useProductPricing`. */}
            {/* <BranchPricingList rows={branchRows} customCount={customCount} /> */}
        </fieldset>
    );
};
