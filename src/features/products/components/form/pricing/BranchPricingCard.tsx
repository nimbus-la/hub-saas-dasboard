"use client";

import { Controller, useFormContext } from "react-hook-form";

import { NumberField, StatusBadge, Switch } from "@/components";
import { formatCurrency, formatPercent } from "@/lib/format";
import { formatMessage, messages } from "@/messages";

import type { BranchPricingRow, ProductFormValues } from "../../../interfaces";
import { PRICING_VALIDATION, getBranchPriceRules } from "../../../libs";
import {
    branchPricingBodyVariants,
    branchPricingCardVariants,
    branchPricingFieldVariants,
    branchPricingHeaderVariants,
    branchPricingHintVariants,
    branchPricingIdentityVariants,
    branchPricingInheritedVariants,
    branchPricingLabelVariants,
    branchPricingNameVariants,
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

                {/* Sin reglas: heredar o no son las dos opciones válidas. */}
                <Controller
                    control={control}
                    name={`branches.${index}.isCustom`}
                    render={({ field }) => (
                        <Switch
                            size="sm"
                            name={field.name}
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            aria-label={formatMessage(branchMessages.custom, {
                                name: branch.name,
                            })}
                        />
                    )}
                />
            </header>

            <div className={branchPricingBodyVariants()}>
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
                                    aria-label={formatMessage(
                                        branchMessages.availability.fieldLabel,
                                        { name: branch.name }
                                    )}
                                />
                            )}
                        />
                    </>
                ) : (
                    <>
                        <span className={branchPricingFieldVariants()}>
                            <span className={branchPricingLabelVariants()}>
                                {branchMessages.price.label}
                            </span>

                            {price === null ? (
                                <span className={branchPricingHintVariants()}>
                                    {branchMessages.price.pending}
                                </span>
                            ) : (
                                <>
                                    <span className={branchPricingInheritedVariants()}>
                                        {formatCurrency(price)}
                                    </span>

                                    <span className={branchPricingHintVariants()}>
                                        {branchMessages.price.inherited}
                                    </span>
                                </>
                            )}
                        </span>

                        <span className={branchPricingFieldVariants()}>
                            <span className={branchPricingLabelVariants()}>
                                {branchMessages.availability.label}
                            </span>

                            <span className={branchPricingInheritedVariants()}>
                                {isAvailable
                                    ? branchMessages.availability.on
                                    : branchMessages.availability.off}
                            </span>

                            <span
                                className={branchPricingHintVariants({
                                    tone: isAvailable ? "neutral" : "off",
                                })}
                            >
                                {branchMessages.availability.inherited}
                            </span>
                        </span>
                    </>
                )}
            </div>
        </article>
    );
};
