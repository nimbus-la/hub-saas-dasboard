"use client"

import * as React from "react"
import { Eye, EyeOff, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { FOCUS_RING } from "@/tokens"
import {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupInput,
} from "@/components/ui/input"
import type { TextFieldProps, TextFieldSize } from "@/interfaces"

import {
    textFieldCountVariants,
    textFieldFooterVariants,
    textFieldHelperVariants,
    textFieldLabelVariants,
    textFieldVariants,
} from "./text-field.style"

/* -------------------------------------------------------------------------- */
/*  Botón interno                                                              */
/* -------------------------------------------------------------------------- */

/**
 * Botón fantasma del interior del campo ("x" y ojo).
 *
 * El área táctil se estira más allá del icono para que no haya que apuntar:
 * 24px en `sm` y 32px en el resto — el máximo razonable dentro de un campo
 * de 32-48px de alto.
 */
function FieldButton({
    size,
    ...props
}: Omit<React.ComponentProps<typeof InputGroupButton>, "size" | "variant"> & {
    size: TextFieldSize
}) {
    return (
        <InputGroupButton
            size={size === "sm" ? "icon-xs" : "icon-sm"}
            variant="ghost"
            className={cn("cursor-pointer text-neutral-500 focus-visible:border-transparent", FOCUS_RING.default)}
            {...props}
        />
    )
}

/* -------------------------------------------------------------------------- */
/*  Componente                                                                 */
/* -------------------------------------------------------------------------- */

export function TextField({
    value,
    defaultValue,
    onChange,
    label,
    required = false,
    placeholder,
    helperText,
    error = false,
    disabled = false,
    readOnly = false,
    type = "text",
    clearable = false,
    leftIcon,
    rightIcon,
    maxLength,
    showCount = false,
    size = "md",
    fullWidth = true,
    id,
    className,
    fieldClassName,
    inputClassName,
    ref,
    ...inputProps
}: TextFieldProps & { ref?: React.Ref<HTMLInputElement> }) {
    const reactId = React.useId()
    const fieldId = id ?? reactId

    const innerRef = React.useRef<HTMLInputElement>(null)
    const setRefs = React.useCallback(
        (node: HTMLInputElement | null) => {
            innerRef.current = node
            if (typeof ref === "function") ref(node)
            else if (ref) (ref as React.RefObject<HTMLInputElement | null>).current = node
        },
        [ref]
    )

    // Modo no controlado: el valor vive aquí para que el botón "x" y el
    // contador funcionen sin obligar al consumidor a manejar estado.
    const isControlled = value !== undefined
    const [innerValue, setInnerValue] = React.useState(defaultValue ?? "")
    const currentValue = isControlled ? value : innerValue

    const [revealed, setRevealed] = React.useState(false)

    const invalid = Boolean(error)
    const message = typeof error === "string" ? error : helperText
    const describedBy = message || showCount ? `${fieldId}-description` : undefined

    const isPassword = type === "password"
    const showClear = clearable && !disabled && !readOnly && currentValue.length > 0
    const hasEndAddon = showClear || isPassword || Boolean(rightIcon)

    const tone = invalid ? "invalid" : readOnly ? "readOnly" : "default"

    const handleChange = React.useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            if (!isControlled) setInnerValue(event.target.value)
            onChange?.(event.target.value, event)
        },
        [isControlled, onChange]
    )

    const handleClear = React.useCallback(() => {
        if (!isControlled) setInnerValue("")
        onChange?.("")
        // Devolver el foco evita que el usuario tenga que volver a pinchar
        // el campo tras vaciarlo.
        innerRef.current?.focus()
    }, [isControlled, onChange])

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

            <InputGroup
                className={cn(
                    textFieldVariants({ size, tone }),
                    // Con icono a la izquierda el addon toma el padding inicial
                    // y el control se pega a él.
                    leftIcon &&
                    "has-[>[data-align=inline-start]]:**:data-[slot=input-group-control]:pl-1.5",
                    fieldClassName
                )}
            >
                {leftIcon && (
                    <InputGroupAddon align="inline-start" aria-hidden="true">
                        {leftIcon}
                    </InputGroupAddon>
                )}

                <InputGroupInput
                    ref={setRefs}
                    id={fieldId}
                    type={isPassword && revealed ? "text" : type}
                    placeholder={placeholder}
                    disabled={disabled}
                    readOnly={readOnly}
                    required={required}
                    maxLength={maxLength}
                    aria-invalid={invalid || undefined}
                    aria-describedby={describedBy}
                    className={cn(
                        // El spinner nativo de `type=number` y la "x" nativa de
                        // `type=search` aparecen justo donde viven la "x", el ojo
                        // y el sufijo. Se retiran sólo cuando hay algo con lo que
                        // chocar: un campo sin adornos conserva su control nativo
                        // (si no, `clearable` en una búsqueda muestra dos aspas).
                        hasEndAddon &&
                        "[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-search-cancel-button]:appearance-none",
                        inputClassName
                    )}
                    value={currentValue}
                    onChange={handleChange}
                    {...inputProps}
                />

                {hasEndAddon && (
                    <InputGroupAddon align="inline-end">
                        {showClear && (
                            <FieldButton
                                size={size}
                                aria-label="Limpiar campo"
                                // `onMouseDown` con preventDefault evita el
                                // parpadeo de perder y recuperar el foco.
                                onMouseDown={(event) => event.preventDefault()}
                                onClick={handleClear}
                            >
                                <X aria-hidden="true" />
                            </FieldButton>
                        )}

                        {isPassword && (
                            <FieldButton
                                size={size}
                                disabled={disabled}
                                aria-label={
                                    revealed ? "Ocultar contraseña" : "Mostrar contraseña"
                                }
                                aria-pressed={revealed}
                                onMouseDown={(event) => event.preventDefault()}
                                onClick={() => setRevealed((prev) => !prev)}
                            >
                                {revealed ? (
                                    <EyeOff aria-hidden="true" />
                                ) : (
                                    <Eye aria-hidden="true" />
                                )}
                            </FieldButton>
                        )}

                        {rightIcon && (
                            <span
                                aria-hidden="true"
                                className="flex shrink-0 items-center"
                            >
                                {rightIcon}
                            </span>
                        )}
                    </InputGroupAddon>
                )}
            </InputGroup>

            {(message || showCount) && (
                <div className={textFieldFooterVariants({ size })}>
                    <p
                        id={describedBy}
                        // El mensaje de error se anuncia sin robar el foco.
                        aria-live={invalid ? "polite" : undefined}
                        className={cn(
                            textFieldHelperVariants({ invalid, disabled })
                        )}
                    >
                        {message}
                    </p>

                    {showCount && (
                        <span
                            className={cn(
                                textFieldCountVariants({ invalid, disabled })
                            )}
                        >
                            {currentValue.length}
                            {maxLength ? `/${maxLength}` : ""}
                        </span>
                    )}
                </div>
            )}
        </div>
    )
}
