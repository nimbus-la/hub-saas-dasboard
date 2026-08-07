"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import {
    Combobox,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxItem,
    ComboboxList,
    InputGroupAddon,
    useComboboxAnchor,
} from "./primitives"
import type {
    InputSelectorOption,
    InputSelectorProps,
    InputSelectorRawOption,
} from "@/interfaces"

import {
    inputSelectorContentVariants,
    inputSelectorEmptyVariants,
    inputSelectorFieldVariants,
    inputSelectorHelperVariants,
    inputSelectorItemVariants,
    inputSelectorLabelVariants,
    inputSelectorLeftIconVariants,
    inputSelectorListVariants,
} from "./input-selector.style"

/* -------------------------------------------------------------------------- */
/*  Utilidad                                                                   */
/* -------------------------------------------------------------------------- */

function normalize(options: InputSelectorRawOption[]): InputSelectorOption[] {
    return options.map((option) =>
        typeof option === "string" ? { label: option, value: option } : option
    )
}

/* -------------------------------------------------------------------------- */
/*  Componente                                                                 */
/* -------------------------------------------------------------------------- */

export function InputSelector({
    options,
    value,
    defaultValue,
    onChange,
    onValueChange,
    onBlur,
    label,
    required = false,
    placeholder = "Selecciona una opción",
    helperText,
    error = false,
    disabled = false,
    readOnly = false,
    clearable = false,
    leftIcon,
    leadingIcon,
    emptyMessage = "Sin resultados",
    size = "md",
    fullWidth = true,
    name,
    id,
    "aria-label": ariaLabel,
    className,
    triggerClassName,
    inputClassName,
    contentClassName,
    ref,
}: InputSelectorProps & { ref?: React.Ref<HTMLInputElement> }) {
    const reactId = React.useId()
    const fieldId = id ?? reactId

    // El popup se ancla al campo completo. Sin esto Base UI lo anclaría al
    // <input> interno y el panel saldría más estrecho y desalineado.
    const anchorRef = useComboboxAnchor()

    // Referencias estables para que Base UI compare por identidad.
    const items = React.useMemo(() => normalize(options), [options])
    const findItem = React.useCallback(
        (target?: string | null) =>
            items.find((item) => item.value === target) ?? null,
        [items]
    )

    const isControlled = value !== undefined
    const startIcon = leftIcon ?? leadingIcon
    const invalid = Boolean(error)
    const message = typeof error === "string" ? error : helperText
    const describedBy = message ? `${fieldId}-description` : undefined

    const handleValueChange = React.useCallback(
        (item: unknown) => {
            const next = item ? (item as InputSelectorOption).value : null
            onChange?.(next ?? "")
            onValueChange?.(next)
        },
        [onChange, onValueChange]
    )

    return (
        <div className={cn(fullWidth ? "w-full" : "inline-block", className)}>
            {label && (
                <label
                    htmlFor={fieldId}
                    className={inputSelectorLabelVariants({ size, disabled })}
                >
                    {label}
                    {required && (
                        <span aria-hidden="true" className="ml-0.5 text-error-main">
                            *
                        </span>
                    )}
                </label>
            )}

            <Combobox
                items={items}
                {...(isControlled
                    ? { value: findItem(value) }
                    : { defaultValue: findItem(defaultValue) })}
                onValueChange={handleValueChange}
                // Resalta la primera coincidencia mientras se escribe, para que
                // Enter seleccione sin tener que bajar con las flechas.
                autoHighlight
                itemToStringLabel={(item) => (item as InputSelectorOption)?.label ?? ""}
                itemToStringValue={(item) => (item as InputSelectorOption)?.value ?? ""}
                disabled={disabled}
                readOnly={readOnly}
                required={required}
                name={name}
            >
                <div ref={anchorRef}>
                    {/* El `ref` llega al <input> del combobox, no al ancla:
                        es lo que permite que un gestor de formularios lleve el
                        foco hasta aquí cuando el campo falla la validación.
                        Mismo contrato que `TextField` y `TextAreaField`. */}
                    <ComboboxInput
                        ref={ref}
                        id={fieldId}
                        onBlur={onBlur}
                        placeholder={placeholder}
                        disabled={disabled}
                        showClear={clearable}
                        aria-label={ariaLabel}
                        aria-invalid={invalid || undefined}
                        aria-describedby={describedBy}
                        className={cn(
                            inputSelectorFieldVariants({ size, invalid }),
                            // Con icono, el addon controla el padding izquierdo.
                            startIcon &&
                            "has-[>[data-align=inline-start]]:**:data-[slot=input-group-control]:pl-1.5",
                            triggerClassName,
                            inputClassName
                        )}
                    >
                        {startIcon && (
                            <InputGroupAddon
                                align="inline-start"
                                className={inputSelectorLeftIconVariants({ size })}
                            >
                                {startIcon}
                            </InputGroupAddon>
                        )}
                    </ComboboxInput>
                </div>

                <ComboboxContent
                    anchor={anchorRef}
                    sideOffset={4}
                    className={cn(inputSelectorContentVariants(), contentClassName)}
                >
                    <ComboboxList className={inputSelectorListVariants()}>
                        {(item: InputSelectorOption) => (
                            <ComboboxItem
                                key={item.value}
                                value={item}
                                disabled={item.disabled}
                                className={inputSelectorItemVariants({ size })}
                            >
                                {item.icon && (
                                    <span
                                        aria-hidden="true"
                                        className="flex shrink-0 items-center [&_svg]:size-4"
                                    >
                                        {item.icon}
                                    </span>
                                )}

                                <span className="truncate">{item.label}</span>
                            </ComboboxItem>
                        )}
                    </ComboboxList>

                    <ComboboxEmpty className={inputSelectorEmptyVariants({ size })}>
                        {emptyMessage}
                    </ComboboxEmpty>
                </ComboboxContent>
            </Combobox>

            {message && (
                <p
                    id={describedBy}
                    // El mensaje de error se anuncia sin robar el foco.
                    aria-live={invalid ? "polite" : undefined}
                    className={inputSelectorHelperVariants({ size, invalid })}
                >
                    {message}
                </p>
            )}
        </div>
    )
}
