"use client"

import * as React from "react"
import { NumericFormat, type NumberFormatValues } from "react-number-format"

import type { NumberFieldProps } from "@/interfaces"
import { NUMBER_SEPARATORS, parsePastedNumber } from "@/lib/format"
import { cn } from "@/lib/utils"

import { InputGroup, InputGroupAddon, InputGroupInput } from "./primitives"
import {
    textFieldFooterVariants,
    textFieldHelperVariants,
    textFieldLabelVariants,
    textFieldVariants,
} from "./text-field.style"
import {
    numberFieldAffixVariants,
    numberFieldInputVariants,
} from "./number-field.style"


/**
 * Campo para escribir números con el formato de Colombia.
 *
 * Mientras se escribe va poniendo los puntos de miles, así se distingue a
 * simple vista `120` de `12.000`. Solo la coma sirve como decimal. Si la
 * persona escribe los puntos de miles por costumbre, se ignoran y el número
 * queda bien. No deja escribir más decimales de los permitidos, en lugar de
 * redondear sin avisar.
 *
 * Por fuera trabaja con números: recibe y entrega `number | null`, nunca el
 * texto con separadores. El formato y el manejo del cursor los resuelve
 * react-number-format; este componente le pone el marco del design system,
 * que es el mismo de `TextField`, y se encarga de lo que se pega.
 */
export function NumberField({
    value,
    defaultValue = null,
    onChange,
    onPaste,
    maxDecimals = 2,
    allowNegative = false,
    label,
    required = false,
    placeholder,
    helperText,
    error = false,
    disabled = false,
    readOnly = false,
    prefix,
    suffix,
    size = "md",
    fullWidth = true,
    id,
    className,
    fieldClassName,
    inputClassName,
    ref,
    ...inputProps
}: NumberFieldProps & { ref?: React.Ref<HTMLInputElement> }) {
    const reactId = React.useId()
    const fieldId = id ?? reactId

    // Si nadie le pasa `value`, el campo guarda su propio número.
    const isControlled = value !== undefined
    const [innerValue, setInnerValue] = React.useState<number | null>(defaultValue)
    const currentValue = isControlled ? value : innerValue

    const invalid = Boolean(error)
    const message = typeof error === "string" ? error : helperText
    const describedBy = message ? `${fieldId}-description` : undefined

    const tone = invalid ? "invalid" : readOnly ? "readOnly" : "default"

    const updateValue = React.useCallback(
        (next: number | null) => {
            if (!isControlled) setInnerValue(next)
            onChange?.(next)
        },
        [isControlled, onChange]
    )

    const handleValueChange = React.useCallback(
        (values: NumberFormatValues) => updateValue(values.floatValue ?? null),
        [updateValue]
    )

    /**
     * Lo que se pega puede venir de una hoja de cálculo en inglés, como
     * `1234.56`. La librería leería ese punto como separador de miles y
     * guardaría un número cien veces mayor, así que el texto se interpreta
     * con `parsePastedNumber` antes de ponerlo.
     *
     * Solo se hace cuando lo pegado reemplaza todo el campo. Si se pega en
     * medio de un número, se deja que la librería lo resuelva.
     */
    const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
        onPaste?.(event)
        if (event.defaultPrevented) return

        const input = event.currentTarget
        const replacesEverything =
            input.selectionStart === 0 && input.selectionEnd === input.value.length

        if (!replacesEverything) return

        const pasted = parsePastedNumber(event.clipboardData.getData("text"), {
            maxDecimals,
            allowNegative,
        })

        if (pasted === null) return

        event.preventDefault()
        updateValue(pasted)
    }

    return (
        <div className={cn(fullWidth ? "w-full" : "inline-block", className)}>
            {label && (
                <label
                    htmlFor={fieldId}
                    className={textFieldLabelVariants({ size, disabled })}
                >
                    {label}
                    {required && (
                        <span aria-hidden="true" className="ml-0.5 text-error-main">
                            *
                        </span>
                    )}
                </label>
            )}

            <InputGroup className={cn(textFieldVariants({ size, tone }), fieldClassName)}>
                {prefix && (
                    <InputGroupAddon align="inline-start" aria-hidden="true">
                        <span className={numberFieldAffixVariants()}>{prefix}</span>
                    </InputGroupAddon>
                )}

                <NumericFormat
                    {...inputProps}
                    customInput={InputGroupInput}
                    {...(ref && { getInputRef: ref })}
                    id={fieldId}
                    // Con `null` se pasa texto vacío y no `undefined`. Si se
                    // pasara `undefined`, la librería se quedaría con lo último
                    // que se escribió y un reset del formulario no vaciaría el campo.
                    value={currentValue ?? ""}
                    onValueChange={handleValueChange}
                    onPaste={handlePaste}
                    thousandSeparator={NUMBER_SEPARATORS.group}
                    decimalSeparator={NUMBER_SEPARATORS.decimal}
                    allowedDecimalSeparators={[NUMBER_SEPARATORS.decimal]}
                    decimalScale={maxDecimals}
                    allowNegative={allowNegative}
                    // `text` y no `number`, porque ese tipo no acepta separadores
                    // y cambia el valor con la rueda del mouse. El teclado
                    // numérico del celular se pide con `inputMode`.
                    type="text"
                    inputMode={maxDecimals > 0 ? "decimal" : "numeric"}
                    autoComplete="off"
                    placeholder={placeholder}
                    disabled={disabled}
                    readOnly={readOnly}
                    required={required}
                    aria-invalid={invalid || undefined}
                    aria-describedby={describedBy}
                    className={cn(numberFieldInputVariants(), inputClassName)}
                />

                {suffix && (
                    <InputGroupAddon align="inline-end" aria-hidden="true">
                        <span className={numberFieldAffixVariants()}>{suffix}</span>
                    </InputGroupAddon>
                )}
            </InputGroup>

            {message && (
                <div className={textFieldFooterVariants({ size })}>
                    <p
                        id={describedBy}
                        // El mensaje de error se anuncia sin robar el foco.
                        aria-live={invalid ? "polite" : undefined}
                        className={textFieldHelperVariants({ invalid, disabled })}
                    >
                        {message}
                    </p>
                </div>
            )}
        </div>
    )
}
