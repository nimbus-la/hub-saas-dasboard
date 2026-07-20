"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import {
    Combobox,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxItem,
    ComboboxList,
} from "@/components/ui/combobox"
import { InputGroupAddon } from "@/components/ui/input-group"

/* -------------------------------------------------------------------------- */
/*  Tipos                                                                      */
/* -------------------------------------------------------------------------- */

export type InputSelectorOption = {
    label: string
    value: string
    disabled?: boolean
}

/** Acepta objetos { label, value } o strings sueltos ("Next.js"). */
type RawOption = InputSelectorOption | string

export interface InputSelectorProps
    extends VariantProps<typeof fieldVariants> {
    /** Opciones a mostrar/filtrar. */
    options: RawOption[]
    /** Valor seleccionado (modo controlado). */
    value?: string | null
    /** Valor inicial (modo no controlado). */
    defaultValue?: string | null
    /** Se dispara al seleccionar o limpiar (null = limpio). */
    onValueChange?: (value: string | null) => void

    /** Texto de la etiqueta superior. */
    label?: string
    /** Muestra el asterisco de campo obligatorio. */
    required?: boolean
    /** Placeholder — funciona como buscador. */
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
    leadingIcon?: React.ReactNode
    /** Mensaje cuando no hay coincidencias. */
    emptyMessage?: string

    name?: string
    id?: string
    /** Clases del contenedor externo. */
    className?: string
    /** Clases del campo (InputGroup). */
    inputClassName?: string
    /** Clases del popover. */
    contentClassName?: string
}

/* -------------------------------------------------------------------------- */
/*  Estilos (Tailwind) — calcados del componente "Input" de Figma             */
/*  Paleta de marca ya definida en style.css: primary-main #7635DC,           */
/*  neutral-* (Minimal) y error-main #FF5630.                                 */
/* -------------------------------------------------------------------------- */

const fieldVariants = cva(
    [
        "w-full rounded-md bg-white border-neutral-300 transition-colors",
        // hover
        "hover:border-neutral-400",
        // focus (anillo morado de marca)
        "has-[[data-slot=input-group-control]:focus-visible]:border-primary-main",
        "has-[[data-slot=input-group-control]:focus-visible]:ring-[3px]",
        "has-[[data-slot=input-group-control]:focus-visible]:ring-primary-main/20",
        // texto y placeholder
        "[&_[data-slot=input-group-control]]:text-neutral-800",
        "[&_[data-slot=input-group-control]]:placeholder:text-neutral-500",
        // iconos
        "[&_svg]:text-neutral-500",
        // disabled (fondo suave, sin bajar opacidad global)
        "has-disabled:opacity-100 has-disabled:bg-neutral-100 has-disabled:border-neutral-200",
        "has-disabled:hover:border-neutral-200",
        "has-disabled:[&_[data-slot=input-group-control]]:text-neutral-400",
        "has-disabled:[&_svg]:text-neutral-400",
    ],
    {
        variants: {
            size: {
                sm: "h-8 [&_[data-slot=input-group-control]]:pl-3 [&_[data-slot=input-group-control]]:text-[13px] [&_svg]:size-4",
                md: "h-10 [&_[data-slot=input-group-control]]:pl-3 [&_[data-slot=input-group-control]]:text-sm [&_svg]:size-[18px]",
                lg: "h-12 [&_[data-slot=input-group-control]]:pl-3.5 [&_[data-slot=input-group-control]]:text-base [&_svg]:size-5",
            },
            invalid: {
                true: [
                    "border-error-main hover:border-error-main",
                    "has-[[data-slot=input-group-control]:focus-visible]:border-error-main",
                    "has-[[data-slot=input-group-control]:focus-visible]:ring-error-main/20",
                    "[&_svg]:text-error-main",
                ],
                false: "",
            },
        },
        defaultVariants: { size: "md", invalid: false },
    }
)

const labelVariants = cva("font-semibold text-neutral-700 select-none", {
    variants: {
        size: {
            sm: "text-xs",
            md: "text-[13px]",
            lg: "text-sm"
        },
    },
    defaultVariants: { size: "md" },
});

/* -------------------------------------------------------------------------- */
/*  Utilidad                                                                   */
/* -------------------------------------------------------------------------- */

function normalize(options: RawOption[]): InputSelectorOption[] {
    return options.map((o) =>
        typeof o === "string" ? { label: o, value: o } : o
    )
}

/* -------------------------------------------------------------------------- */
/*  Componente                                                                 */
/* -------------------------------------------------------------------------- */

export function InputSelector({
    options,
    value,
    defaultValue,
    onValueChange,
    label,
    required = false,
    placeholder = "Selecciona una opción",
    helperText,
    error = false,
    disabled = false,
    readOnly = false,
    clearable = false,
    leadingIcon,
    emptyMessage = "Sin resultados",
    size = "md",
    name,
    id,
    className,
    inputClassName,
    contentClassName,
}: InputSelectorProps) {
    const reactId = React.useId()
    const fieldId = id ?? reactId

    // Referencias estables para que Base UI compare por identidad.
    const items = React.useMemo(() => normalize(options), [options])
    const findItem = React.useCallback(
        (value?: string | null) =>
            items.find((object) => object.value === value) ?? null,
        [items]
    )

    const isControlled = value !== undefined
    const invalid = Boolean(error)
    const message = typeof error === "string" ? error : helperText
    const describedBy = message ? `${fieldId}-desc` : undefined

    return (
        <div className={cn("flex w-full flex-col gap-1.5", className)}>
            {label && (
                <label htmlFor={fieldId} className={cn(labelVariants({ size }))}>
                    {label}
                    {required && <span className="ml-0.5 text-error-main">*</span>}
                </label>
            )}

            <Combobox
                items={items}
                {...(isControlled
                    ? { value: findItem(value) }
                    : { defaultValue: findItem(defaultValue) })}
                onValueChange={(item) =>
                    onValueChange?.(item ? (item as InputSelectorOption).value : null)
                }
                itemToStringLabel={(item) => (item as InputSelectorOption)?.label ?? ""}
                itemToStringValue={(item) => (item as InputSelectorOption)?.value ?? ""}
                disabled={disabled}
                readOnly={readOnly}
                required={required}
                name={name}
            >
                <ComboboxInput
                    id={fieldId}
                    placeholder={placeholder}
                    disabled={disabled}
                    showClear={clearable}
                    aria-invalid={invalid || undefined}
                    aria-describedby={describedBy}
                    className={cn(
                        fieldVariants({ size, invalid }),
                        // si hay icono, deja que el addon controle el padding izquierdo
                        leadingIcon &&
                        "has-[>[data-align=inline-start]]:[&_[data-slot=input-group-control]]:pl-1.5",
                        inputClassName
                    )}
                >
                    {leadingIcon && (
                        <InputGroupAddon align="inline-start">
                            {leadingIcon}
                        </InputGroupAddon>
                    )}
                </ComboboxInput>

                <ComboboxContent className={cn("p-0", contentClassName)}>
                    <ComboboxList className="p-1.5">
                        {(item: InputSelectorOption) => (
                            <ComboboxItem
                                key={item.value}
                                value={item}
                                disabled={item.disabled}
                                className="rounded-md px-2 py-2 text-sm text-neutral-800 data-highlighted:bg-neutral-100 data-highlighted:text-neutral-900 data-[selected]:font-medium"
                            >
                                {item.label}
                            </ComboboxItem>
                        )}
                    </ComboboxList>

                    <ComboboxEmpty className="flex-col gap-0.5 px-3 py-6">
                        <span className="text-sm font-medium text-neutral-700">
                            {emptyMessage}
                        </span>
                        <span className="text-[13px] text-neutral-500">
                            Prueba con otro término
                        </span>
                    </ComboboxEmpty>
                </ComboboxContent>
            </Combobox>

            {message && (
                <p
                    id={describedBy}
                    className={cn(
                        "text-xs",
                        invalid ? "text-error-main" : "text-neutral-500"
                    )}
                >
                    {message}
                </p>
            )}
        </div>
    )
}