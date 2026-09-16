"use client";

import { Controller, useFormContext } from "react-hook-form";

import { GenericButton, NumberField, StatusBadge, Switch } from "@/components";
import { formatCurrency, formatPercent } from "@/lib/format";
import { formatMessage, messages } from "@/messages";

import type { BranchPricingRow, ProductFormValues } from "../../../interfaces";
import { PRICING_VALIDATION, getBranchPriceRules } from "../../../libs";
import {
    branchPricingAvailabilityVariants,
    branchPricingBodyVariants,
    branchPricingCardVariants,
    branchPricingFieldVariants,
    branchPricingHeaderVariants,
    branchPricingHintVariants,
    branchPricingIdentityVariants,
    branchPricingInheritedVariants,
    branchPricingLabelVariants,
    branchPricingNameVariants,
    branchPricingPriceVariants,
    branchPricingValueVariants,
} from "./branch-pricing-card.style";


interface BranchPricingCardProps {
    row: BranchPricingRow;
}

const branchMessages = messages.products.create.pricing.branches;

/**
 * La configuración de una sucursal.
 *
 * Mientras hereda solo enseña lo que va a cobrar, sin campos. Los campos
 * aparecen al personalizarla, y eso es también lo que hace que sus reglas
 * cuenten: react-hook-form ignora lo que no está montado, así que una sucursal
 * que hereda nunca deja el paso en rojo.
 *
 * El modo se cambia con un botón y no con un interruptor porque dentro de la
 * tarjeta ya hay uno —la disponibilidad—, y dos carriles iguales no dejan ver
 * cuál cambia la forma de la tarjeta y cuál es un dato del producto.
 */
export default function BranchPricingCard({ row }: BranchPricingCardProps) {
    const { control } = useFormContext<ProductFormValues>();
    const { branch, index, isCustom, price, isAvailable, margin } = row;

    return (
        <article className={branchPricingCardVariants({ custom: isCustom })}>
            <header className={branchPricingHeaderVariants()}>
                <span className={branchPricingIdentityVariants()}>
                    <span className={branchPricingNameVariants()}>{branch.name}</span>

                    <StatusBadge
                        size="xs"
                        tone={isCustom ? "info" : "neutral"}
                        label={
                            isCustom
                                ? branchMessages.badge.custom
                                : branchMessages.badge.inherited
                        }
                    />
                </span>

                {/* Sin reglas: heredar o no son las dos opciones válidas. El
                nombre accesible repite la sucursal porque el botón se oye
                fuera del contexto de su tarjeta. */}
                <Controller
                    control={control}
                    name={`branches.${index}.isCustom`}
                    render={({ field }) => (
                        <GenericButton
                            type="button"
                            variant="ghost"
                            size="sm"
                            label={
                                field.value
                                    ? branchMessages.actions.reset
                                    : branchMessages.actions.customize
                            }
                            onClick={() => field.onChange(!field.value)}
                            aria-label={formatMessage(
                                field.value
                                    ? branchMessages.actions.resetLabel
                                    : branchMessages.actions.customizeLabel,
                                { name: branch.name }
                            )}
                        />
                    )}
                />
            </header>

            <div className={branchPricingBodyVariants({ divided: isCustom })}>
                {isCustom ? (
                    <>
                        <Controller
                            control={control}
                            name={`branches.${index}.price`}
                            rules={getBranchPriceRules(branch)}
                            render={({ field, fieldState }) => (
                                <NumberField
                                    ref={field.ref}
                                    name={field.name}
                                    value={field.value}
                                    onChange={field.onChange}
                                    onBlur={field.onBlur}
                                    disabled={field.disabled ?? false}
                                    label={branchMessages.price.label}
                                    size="sm"
                                    maxDecimals={PRICING_VALIDATION.price.maxDecimals}
                                    prefix="$"
                                    className={branchPricingPriceVariants()}
                                    aria-label={formatMessage(branchMessages.price.fieldLabel, {
                                        name: branch.name,
                                    })}
                                    error={fieldState.error?.message ?? false}
                                    {...(margin !== null && {
                                        helperText: formatMessage(branchMessages.margin, {
                                            margin: formatPercent(margin),
                                        }),
                                    })}
                                />
                            )}
                        />

                        <Controller
                            control={control}
                            name={`branches.${index}.isAvailable`}
                            render={({ field }) => (
                                <Switch
                                    size="sm"
                                    name={field.name}
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    label={branchMessages.availability.label}
                                    description={
                                        field.value
                                            ? branchMessages.availability.on
                                            : branchMessages.availability.off
                                    }
                                    className={branchPricingAvailabilityVariants()}
                                    aria-label={formatMessage(
                                        branchMessages.availability.fieldLabel,
                                        { name: branch.name }
                                    )}
                                />
                            )}
                        />
                    </>
                ) : (
                    // Lo heredado es una lectura, no un formulario: dos conceptos
                    // con su valor, sin controles que inviten a escribir encima.
                    <dl className={branchPricingInheritedVariants()}>
                        <div className={branchPricingFieldVariants()}>
                            <dt className={branchPricingLabelVariants()}>
                                {branchMessages.price.label}
                            </dt>

                            {price === null ? (
                                <dd className={branchPricingHintVariants()}>
                                    {branchMessages.price.pending}
                                </dd>
                            ) : (
                                <dd className={branchPricingValueVariants()}>
                                    {formatCurrency(price)}
                                </dd>
                            )}
                        </div>

                        <div className={branchPricingFieldVariants()}>
                            <dt className={branchPricingLabelVariants()}>
                                {branchMessages.availability.label}
                            </dt>

                            <dd
                                className={branchPricingValueVariants({
                                    tone: isAvailable ? "neutral" : "off",
                                })}
                            >
                                {isAvailable
                                    ? branchMessages.availability.on
                                    : branchMessages.availability.off}
                            </dd>
                        </div>
                    </dl>
                )}
            </div>
        </article>
    );
};
