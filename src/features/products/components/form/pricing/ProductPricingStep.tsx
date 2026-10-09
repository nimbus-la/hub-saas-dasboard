"use client";

import { Controller, useFormContext } from "react-hook-form";

import { Alert, NumberField, Switch } from "@/components";
import { cn } from "@/lib/utils";
import { messages } from "@/messages";

// Antes el costo salía de la receta y la cuenta la hacía `useProductPricing`.
// Vuelve cuando regresen las recetas.
// import { useProductPricing } from "../../../hooks";
import type { ProductPrice } from "../../../hooks/use-product-price";
import type { ProductFormValues } from "../../../interfaces";
import { PRICING_RULES, PRICING_VALIDATION } from "../../../libs";
// Precios por sucursal fuera del primer alcance. Ver la nota al final del paso.
// import BranchPricingList from "./BranchPricingList";
import PricingSummary from "./PricingSummary";
import {
    productPricingAvailabilityVariants,
    productPricingFieldsVariants,
    productPricingStepVariants,
} from "./product-pricing-step.style";


interface ProductPricingStepProps {
    /** El enlace entre costo, precio y margen, de `useProductPrice`. */
    pricing: ProductPrice;
    className?: string;
}

const pricingMessages = messages.products.create.pricing;

/**
 * El precio del producto: cuánto cuesta prepararlo, a cuánto se vende y
 * cuánto se gana.
 *
 * Tiene que ir dentro del `FormProvider` del formulario. El enlace entre los
 * tres campos llega hecho por props: lo arma la pantalla, porque además de
 * pintarse aquí decide si se puede guardar.
 */
export default function ProductPricingStep({ pricing, className }: ProductPricingStepProps) {
    const { control } = useFormContext<ProductFormValues>();

    const { hasCost, errorMessage, onCostChange, onMarginChange, onPriceChange } = pricing;

    return (
        <fieldset className={cn(productPricingStepVariants(), className)}>
            <legend className="sr-only">{pricingMessages.legend}</legend>

            {/* En el orden en que se piensa: lo que cuesta, a cuánto se vende y
                lo que queda. Precio y margen esperan al costo, porque sin él no
                hay nada sobre lo que calcular. */}
            <div className={productPricingFieldsVariants()}>
                <Controller
                    control={control}
                    name="cost"
                    rules={PRICING_RULES.cost}
                    render={({ field, fieldState }) => (
                        <NumberField
                            ref={field.ref}
                            name={field.name}
                            value={field.value}
                            onChange={onCostChange}
                            onBlur={field.onBlur}
                            disabled={field.disabled ?? false}
                            label={pricingMessages.cost.label}
                            required
                            size="md"
                            maxDecimals={PRICING_VALIDATION.cost.maxDecimals}
                            prefix="$"
                            placeholder={pricingMessages.cost.placeholder}
                            helperText={pricingMessages.cost.helper}
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
                            disabled={(field.disabled ?? false) || !hasCost}
                            label={pricingMessages.price.label}
                            required
                            size="md"
                            maxDecimals={PRICING_VALIDATION.price.maxDecimals}
                            prefix="$"
                            placeholder={pricingMessages.price.placeholder}
                            helperText={
                                hasCost
                                    ? pricingMessages.price.helper
                                    : pricingMessages.price.missingCost
                            }
                            error={fieldState.error?.message ?? false}
                        />
                    )}
                />

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
                            disabled={(field.disabled ?? false) || !hasCost}
                            label={pricingMessages.margin.label}
                            required
                            size="md"
                            maxDecimals={PRICING_VALIDATION.margin.maxDecimals}
                            // Un precio por debajo del costo da un margen
                            // negativo, y el campo tiene que poder mostrarlo.
                            allowNegative
                            suffix="%"
                            placeholder={pricingMessages.margin.placeholder}
                            helperText={
                                hasCost
                                    ? pricingMessages.margin.helper
                                    : pricingMessages.margin.missingCost
                            }
                            error={fieldState.error?.message ?? false}
                        />
                    )}
                />
            </div>

            {/* Si el backend no pudo calcular, el resumen se queda con el último
                cálculo bueno y el motivo va aquí, junto a los campos que hay
                que corregir. */}
            {errorMessage && (
                <Alert
                    tone="error"
                    variant="soft"
                    size="sm"
                    dismissible={false}
                    title={pricingMessages.calculationError}
                    description={errorMessage}
                />
            )}

            <PricingSummary pricing={pricing} />

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
            Para activarlos hay que quitar este comentario y el del import, y
            volver a leer `branchRows` y `customCount` de `useProductPricing`,
            pasado ya a margen sobre el precio. */}
            {/* <BranchPricingList rows={branchRows} customCount={customCount} /> */}
        </fieldset>
    );
};
