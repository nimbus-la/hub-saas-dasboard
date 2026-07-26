"use client"

import * as React from "react"
import { cva } from "class-variance-authority"

import { cn } from "@/lib/utils"
import {
    Combobox,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxItem,
    ComboboxList,
    useComboboxAnchor,
} from "@/components/ui/combobox"
import { InputGroupAddon } from "@/components/ui/input-group"

/* -------------------------------------------------------------------------- */
/*  Tipos                                                                      */
/* -------------------------------------------------------------------------- */

export type InputSelectorOption = {
    label: string
    value: string
    /** Icono opcional a la izquierda de la opción. */
    icon?: React.ReactNode
    disabled?: boolean
}

/** Acepta objetos { label, value } o strings sueltos ("Next.js"). */
type RawOption = InputSelectorOption | string

export type InputSelectorSize = "sm" | "md" | "lg"

export interface InputSelectorProps {
    /** Opciones a mostrar/filtrar. */
    options: RawOption[]
    /** Valor seleccionado (modo controlado). */
    value?: string | null
    /** Valor inicial (modo no controlado). */
    defaultValue?: string | null
    /** Se dispara al seleccionar (string vacío al limpiar). */
    onChange?: (value: string) => void
    /**
     * Se dispara al seleccionar o limpiar (`null` = limpio).
     * @deprecated Usa `onChange`. Se mantiene por compatibilidad.
     */
    onValueChange?: (value: string | null) => void

    /** Texto de la etiqueta superior. */
    label?: string
    /** Muestra el asterisco de campo obligatorio. */
    required?: boolean
    /** Placeholder — el campo funciona como buscador. */
    placeholder?: string
    /** Texto de ayuda debajo del campo. */
    helperText?: string
    /** Estado de error: `true` o un mensaje (reemplaza al helperText). */
    error?: boolean | string
    /** Deshabilita el campo. */
    disabled?: boolean
    /** Solo lectura. */
    readOnly?: boolean
    /** Muestra el botón "x" para limpiar la selección. */
    clearable?: boolean
    /** Icono a la izquierda del valor. */
    leftIcon?: React.ReactNode
    /**
     * Icono a la izquierda del valor.
     * @deprecated Usa `leftIcon`. Se mantiene por compatibilidad.
     */
    leadingIcon?: React.ReactNode
    /** Mensaje cuando la búsqueda no arroja coincidencias. */
    emptyMessage?: string
    /** Alto, padding y tamaño de iconos. */
    size?: InputSelectorSize
    /** Ocupa el 100% del contenedor padre. */
    fullWidth?: boolean

    name?: string
    id?: string
    /** Clases del contenedor externo. */
    className?: string
    /** Clases del campo (InputGroup). */
    triggerClassName?: string
    /**
     * Clases del campo (InputGroup).
     * @deprecated Usa `triggerClassName`. Se mantiene por compatibilidad.
     */
    inputClassName?: string
    /** Clases del panel de opciones. */
    contentClassName?: string
}

/* -------------------------------------------------------------------------- */
/*  Estilos                                                                    */
/*  Tokens de marca definidos en style.css: primary-*, neutral-*, error-*.     */
/*                                                                             */
/*  El control es un combobox editable: el propio campo filtra las opciones.   */
/*  Por eso los estados se pintan sobre el InputGroup con `has-*`.             */
/* -------------------------------------------------------------------------- */

/*  Las clases se escriben literales a propósito: Tailwind escanea el código   */
/*  fuente y no detecta nombres construidos por interpolación.                 */

const fieldVariants = cva(
    [
        "w-full rounded-lg border bg-white",
        "transition-all duration-150 ease-out motion-reduce:transition-none",

        // ── Texto ────────────────────────────────────────────────────────
        "[&_[data-slot=input-group-control]]:h-full",
        "[&_[data-slot=input-group-control]]:font-medium",
        "[&_[data-slot=input-group-control]]:text-neutral-800",
        "[&_[data-slot=input-group-control]]:placeholder:font-normal",
        "[&_[data-slot=input-group-control]]:placeholder:text-neutral-600",

        // ── Iconos ───────────────────────────────────────────────────────
        "[&_svg]:text-neutral-500",
        "hover:[&_svg]:text-neutral-600",

        // El chevron vive en un botón fantasma: sin fondo ni desplazamiento.
        "[&_[data-slot=input-group-addon][data-align=inline-end]]:mr-0",
        "[&_[data-slot=input-group-button]]:hover:bg-transparent",

        // ── Disabled ─────────────────────────────────────────────────────
        "has-disabled:cursor-not-allowed has-disabled:border-neutral-300",
        "has-disabled:bg-neutral-200 has-disabled:opacity-100",
        "has-disabled:hover:border-neutral-300",
        "has-disabled:[&_[data-slot=input-group-control]]:text-neutral-400",
        "has-disabled:[&_[data-slot=input-group-control]]:placeholder:text-neutral-400",
        "has-disabled:[&_svg]:text-neutral-400",
        "has-disabled:hover:[&_svg]:text-neutral-400",
    ],
    {
        variants: {
            size: {
                sm: [
                    "h-9",
                    "[&_[data-slot=input-group-control]]:pl-3",
                    "[&_[data-slot=input-group-control]]:text-sm",
                    "[&_svg]:size-4",
                    "[&_[data-slot=input-group-addon][data-align=inline-end]]:pr-2",
                ],
                md: [
                    "h-10",
                    "[&_[data-slot=input-group-control]]:pl-3.5",
                    "[&_[data-slot=input-group-control]]:text-sm",
                    "[&_svg]:size-4.5",
                    "[&_[data-slot=input-group-addon][data-align=inline-end]]:pr-2.5",
                ],
                lg: [
                    "h-12",
                    "[&_[data-slot=input-group-control]]:pl-4",
                    "[&_[data-slot=input-group-control]]:text-base",
                    "[&_svg]:size-5",
                    "[&_[data-slot=input-group-addon][data-align=inline-end]]:pr-3.5",
                ],
            },
            invalid: {
                // Normal + foco/abierto: el input recibe :focus-visible al abrir.
                false: [
                    "border-neutral-300 hover:border-neutral-400",
                    "has-[[data-slot=input-group-control]:focus-visible]:border-primary-main",
                    "has-[[data-slot=input-group-control]:focus-visible]:ring-4",
                    "has-[[data-slot=input-group-control]:focus-visible]:ring-primary-main/12",
                ],
                true: [
                    "border-error-main hover:border-error-main",
                    // El InputGroup pinta un anillo permanente con aria-invalid:
                    // aquí el anillo solo aparece con el foco.
                    "has-[[data-slot][aria-invalid=true]]:border-error-main",
                    "has-[[data-slot][aria-invalid=true]]:ring-0",
                    "has-[[data-slot=input-group-control]:focus-visible]:border-error-main",
                    "has-[[data-slot=input-group-control]:focus-visible]:ring-4",
                    "has-[[data-slot=input-group-control]:focus-visible]:ring-error-main/12",
                ],
            },
        },
        defaultVariants: { size: "md", invalid: false },
    }
)

/* -------------------------------------------------------------------------- */
/*  Utilidad                                                                   */
/* -------------------------------------------------------------------------- */

function normalize(options: RawOption[]): InputSelectorOption[] {
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
    className,
    triggerClassName,
    inputClassName,
    contentClassName,
}: InputSelectorProps) {
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
                    className={cn(
                        "mb-1.5 block text-sm font-medium select-none",
                        disabled ? "text-neutral-400" : "text-neutral-800"
                    )}
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
                    <ComboboxInput
                        id={fieldId}
                        placeholder={placeholder}
                        disabled={disabled}
                        showClear={clearable}
                        aria-invalid={invalid || undefined}
                        aria-describedby={describedBy}
                        className={cn(
                            fieldVariants({ size, invalid }),
                            // Con icono, el addon controla el padding izquierdo.
                            startIcon &&
                            "has-[>[data-align=inline-start]]:**:data-[slot=input-group-control]:pl-1.5",
                            "bg-neutral-100",
                            triggerClassName,
                            inputClassName
                        )}
                    >
                        {startIcon && (
                            <InputGroupAddon
                                align="inline-start"
                                className={cn(
                                    size === "sm" && "pl-3",
                                    size === "md" && "pl-3.5",
                                    size === "lg" && "pl-4"
                                )}
                            >
                                {startIcon}
                            </InputGroupAddon>
                        )}
                    </ComboboxInput>
                </div>

                <ComboboxContent
                    anchor={anchorRef}
                    sideOffset={4}
                    className={cn(
                        "min-w-(--anchor-width) rounded-lg border border-neutral-200 bg-white p-0",
                        "shadow-lg shadow-neutral-900/8 ring-0",
                        contentClassName
                    )}
                >
                    <ComboboxList
                        className={cn(
                            "max-h-60 overflow-y-auto p-1",
                            "[scrollbar-width:thin]",
                            "[scrollbar-color:var(--color-neutral-300)_transparent]"
                        )}
                    >
                        {(item: InputSelectorOption) => (
                            <ComboboxItem
                                key={item.value}
                                value={item}
                                disabled={item.disabled}
                                className={cn(
                                    "cursor-pointer rounded-md py-2 pr-8 pl-3 text-sm text-neutral-800",
                                    "transition-colors duration-100 motion-reduce:transition-none",
                                    // `selected` y `highlighted` empatan en especificidad,
                                    // así que se separan con variantes explícitas en
                                    // vez de depender del orden del stylesheet.
                                    "[&[data-highlighted]:not([data-selected])]:bg-neutral-100",
                                    "[&[data-highlighted]:not([data-selected])]:text-neutral-800",
                                    "[&[data-selected]]:bg-primary-lighter/60",
                                    "[&[data-selected]]:font-medium",
                                    "[&[data-selected]]:text-primary-dark",
                                    "[&[data-selected][data-highlighted]]:bg-primary-lighter",
                                    "data-disabled:cursor-not-allowed data-disabled:text-neutral-400 data-disabled:opacity-100",
                                    // El check gana al `**:text-accent-foreground` del primitivo.
                                    "[&_[data-slot=combobox-item-indicator]]:text-primary-main",
                                    "data-highlighted:[&_[data-slot=combobox-item-indicator]]:text-primary-main"
                                )}
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

                    <ComboboxEmpty className="px-3 py-6 text-center text-sm text-neutral-600">
                        {emptyMessage}
                    </ComboboxEmpty>
                </ComboboxContent>
            </Combobox>

            {message && (
                <p
                    id={describedBy}
                    className={cn(
                        "mt-1.5 text-xs",
                        invalid ? "text-error-dark" : "text-neutral-600"
                    )}
                >
                    {message}
                </p>
            )}
        </div>
    )
}
