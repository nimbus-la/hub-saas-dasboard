"use client"

import * as React from "react"

import { useScrollEndLoad } from "@/hooks"
import { cn } from "@/lib/utils"
import { messages } from "@/messages"
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
    inputSelectorLoadingVariants,
} from "./input-selector.style"

/* -------------------------------------------------------------------------- */
/*  Utilidad                                                                   */
/* -------------------------------------------------------------------------- */

function normalize(options: InputSelectorRawOption[]): InputSelectorOption[] {
    return options.map((option) =>
        typeof option === "string" ? { label: option, value: option } : option
    )
}

/**
 * Cambios del texto que son búsqueda de verdad: escribir o pegar. El resto
 * —elegir una opción, cerrar, limpiar— también reescriben el campo (con la
 * etiqueta elegida o vacío), y buscar esa etiqueta dejaría la lista reducida a
 * una sola opción la próxima vez que se abra.
 */
const SEARCH_REASONS = new Set(["input-change", "input-paste"])

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
    placeholder = messages.components.inputSelector.placeholder,
    helperText,
    error = false,
    disabled = false,
    readOnly = false,
    clearable = false,
    leftIcon,
    leadingIcon,
    emptyMessage = messages.components.inputSelector.empty,
    onSearchChange,
    canLoadMore = false,
    onLoadMore,
    isLoadingMore = false,
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

    // Con búsqueda en el servidor la opción elegida puede no estar entre las
    // cargadas: se eligió en un resultado de búsqueda y, al borrarla, la lista
    // vuelve a las primeras tandas. Se recuerda aquí para que el campo siga
    // mostrando su etiqueta.
    const [selectedItem, setSelectedItem] = React.useState<InputSelectorOption | null>(null)

    const findItem = React.useCallback(
        (target?: string | null) =>
            items.find((item) => item.value === target) ??
            (selectedItem && selectedItem.value === target ? selectedItem : null),
        [items, selectedItem]
    )

    // La lista vive en el panel, que se monta al abrirse: el nodo va en estado
    // para que la carga por scroll se conecte cada vez que aparece.
    const [list, setList] = React.useState<HTMLDivElement | null>(null)

    useScrollEndLoad({
        scroller: list,
        axis: "y",
        enabled: canLoadMore && onLoadMore !== undefined,
        onLoadMore: () => onLoadMore?.(),
    })

    const isControlled = value !== undefined
    const startIcon = leftIcon ?? leadingIcon
    const invalid = Boolean(error)
    const message = typeof error === "string" ? error : helperText
    const describedBy = message ? `${fieldId}-description` : undefined

    const handleValueChange = React.useCallback(
        (item: unknown) => {
            setSelectedItem(item ? (item as InputSelectorOption) : null)

            const next = item ? (item as InputSelectorOption).value : null
            onChange?.(next ?? "")
            onValueChange?.(next)
        },
        [onChange, onValueChange]
    )

    const handleInputValueChange = (query: string, details: { reason: string }) => {
        onSearchChange?.(SEARCH_REASONS.has(details.reason) ? query : "")
    }

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
                // La opción recordada no es la misma instancia que la que llega
                // en `items` tras una recarga, así que se compara por valor.
                isItemEqualToValue={(item, selected) =>
                    (item as InputSelectorOption)?.value === (selected as InputSelectorOption)?.value
                }
                {...(onSearchChange && {
                    // El servidor ya devuelve las opciones filtradas; volver a
                    // filtrarlas aquí esconde las que coinciden por otro campo.
                    filter: null,
                    onInputValueChange: handleInputValueChange,
                })}
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
                    <ComboboxList ref={setList} className={inputSelectorListVariants()}>
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

                    {isLoadingMore && (
                        <p role="status" className={inputSelectorLoadingVariants({ size })}>
                            {messages.components.inputSelector.loadingMore}
                        </p>
                    )}

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
