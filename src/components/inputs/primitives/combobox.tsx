"use client"

import * as React from "react"
import { Combobox as ComboboxPrimitive } from "@base-ui/react"
import { CheckIcon, ChevronDownIcon, XIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Z_INDEX_CLASS } from "@/tokens"

import {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupInput,
} from "./input-group"
import {
    comboboxChipVariants,
    comboboxChipsInputVariants,
    comboboxChipsVariants,
    comboboxContentVariants,
    comboboxEmptyVariants,
    comboboxItemIndicatorVariants,
    comboboxItemVariants,
    comboboxLabelVariants,
    comboboxListVariants,
    comboboxSeparatorVariants,
    comboboxTriggerVariants,
} from "./combobox.style"


/**
 * Combobox
 * 
 * Envoltorio de Base UI. La lógica —filtrado, teclado, anclaje del panel,
 * accesibilidad— es suya; aquí solo se decide la estructura y se enchufan
 * los estilos del sistema (`combobox.style.ts`).
 * 
 * `InputSelector` es el componente de pantalla; estas piezas son el material
 * con el que está hecho y quedan expuestas para casos que se salgan de él
 * (selección múltiple con chips, grupos con rótulo, separadores).
 */


const Combobox = ComboboxPrimitive.Root

function ComboboxValue({ ...props }: ComboboxPrimitive.Value.Props) {
    return <ComboboxPrimitive.Value data-slot="combobox-value" {...props} />
}

function ComboboxTrigger({
    className,
    children,
    ...props
}: ComboboxPrimitive.Trigger.Props) {
    return (
        <ComboboxPrimitive.Trigger
            data-slot="combobox-trigger"
            className={cn(comboboxTriggerVariants(), className)}
            {...props}
        >
            {children}

            <ChevronDownIcon className="pointer-events-none text-neutral-500" />
        </ComboboxPrimitive.Trigger>
    )
}

function ComboboxClear({ className, ...props }: ComboboxPrimitive.Clear.Props) {
    return (
        <ComboboxPrimitive.Clear
            data-slot="combobox-clear"
            render={<InputGroupButton variant="ghost" size="icon-xs" />}
            className={cn(className)}
            {...props}
        >
            <XIcon className="pointer-events-none" />
        </ComboboxPrimitive.Clear>
    )
}

function ComboboxInput({
    className,
    children,
    disabled = false,
    showTrigger = true,
    showClear = false,
    ...props
}: ComboboxPrimitive.Input.Props & {
    showTrigger?: boolean
    showClear?: boolean
}) {
    return (
        <InputGroup className={cn("w-auto", className)}>
            <ComboboxPrimitive.Input
                render={<InputGroupInput disabled={disabled} />}
                {...props}
            />
            <InputGroupAddon align="inline-end">
                {showClear && <ComboboxClear disabled={disabled} />}
                {showTrigger && (
                    <InputGroupButton
                        size="icon-xs"
                        variant="ghost"
                        render={<ComboboxTrigger />}
                        data-slot="input-group-button"
                        className="data-pressed:bg-transparent"
                        disabled={disabled}
                    />
                )}
            </InputGroupAddon>
            {children}
        </InputGroup>
    )
}

function ComboboxContent({
    className,
    side = "bottom",
    sideOffset = 6,
    align = "start",
    alignOffset = 0,
    anchor,
    ...props
}: ComboboxPrimitive.Popup.Props &
    Pick<
        ComboboxPrimitive.Positioner.Props,
        "side" | "align" | "sideOffset" | "alignOffset" | "anchor"
    >) {
    return (
        <ComboboxPrimitive.Portal>
            <ComboboxPrimitive.Positioner
                side={side}
                sideOffset={sideOffset}
                align={align}
                alignOffset={alignOffset}
                anchor={anchor}
                // El panel se monta en un portal: sale del contenedor y compite
                // en la raíz con el chrome, así que necesita la capa flotante
                // del sistema — por encima de la barra superior y del drawer.
                className={cn("isolate", Z_INDEX_CLASS.dropdown)}
            >
                <ComboboxPrimitive.Popup
                    data-slot="combobox-content"
                    data-chips={!!anchor}
                    className={cn(comboboxContentVariants(), className)}
                    {...props}
                />
            </ComboboxPrimitive.Positioner>
        </ComboboxPrimitive.Portal>
    )
}

function ComboboxList({ className, ...props }: ComboboxPrimitive.List.Props) {
    return (
        <ComboboxPrimitive.List
            data-slot="combobox-list"
            className={cn(comboboxListVariants(), className)}
            {...props}
        />
    )
}

function ComboboxItem({
    className,
    children,
    ...props
}: ComboboxPrimitive.Item.Props) {
    return (
        <ComboboxPrimitive.Item
            data-slot="combobox-item"
            className={cn(comboboxItemVariants(), className)}
            {...props}
        >
            {children}
        </ComboboxPrimitive.Item>
    )
}

function ComboboxItemIndicator({
    className,
    children,
    ...props
}: ComboboxPrimitive.ItemIndicator.Props) {
    return (
        <ComboboxPrimitive.ItemIndicator
            data-slot="combobox-item-indicator"
            className={cn(comboboxItemIndicatorVariants(), className)}
            {...props}
        >
            {children ?? <CheckIcon />}
        </ComboboxPrimitive.ItemIndicator>
    )
}

function ComboboxGroup({ className, ...props }: ComboboxPrimitive.Group.Props) {
    return (
        <ComboboxPrimitive.Group
            data-slot="combobox-group"
            className={cn(className)}
            {...props}
        />
    )
}

function ComboboxLabel({
    className,
    ...props
}: ComboboxPrimitive.GroupLabel.Props) {
    return (
        <ComboboxPrimitive.GroupLabel
            data-slot="combobox-label"
            className={cn(comboboxLabelVariants(), className)}
            {...props}
        />
    )
}

function ComboboxCollection({ ...props }: ComboboxPrimitive.Collection.Props) {
    return (
        <ComboboxPrimitive.Collection data-slot="combobox-collection" {...props} />
    )
}

function ComboboxEmpty({ className, ...props }: ComboboxPrimitive.Empty.Props) {
    return (
        <ComboboxPrimitive.Empty
            data-slot="combobox-empty"
            className={cn(comboboxEmptyVariants(), className)}
            {...props}
        />
    )
}

function ComboboxSeparator({
    className,
    ...props
}: ComboboxPrimitive.Separator.Props) {
    return (
        <ComboboxPrimitive.Separator
            data-slot="combobox-separator"
            className={cn(comboboxSeparatorVariants(), className)}
            {...props}
        />
    )
}

function ComboboxChips({
    className,
    ...props
}: React.ComponentPropsWithRef<typeof ComboboxPrimitive.Chips> &
    ComboboxPrimitive.Chips.Props) {
    return (
        <ComboboxPrimitive.Chips
            data-slot="combobox-chips"
            className={cn(comboboxChipsVariants(), className)}
            {...props}
        />
    )
}

function ComboboxChip({
    className,
    children,
    showRemove = true,
    ...props
}: ComboboxPrimitive.Chip.Props & {
    showRemove?: boolean
}) {
    return (
        <ComboboxPrimitive.Chip
            data-slot="combobox-chip"
            className={cn(comboboxChipVariants(), className)}
            {...props}
        >
            {children}
            {showRemove && (
                <ComboboxPrimitive.ChipRemove
                    render={<InputGroupButton variant="ghost" size="icon-xs" />}
                    className="-ml-1"
                    data-slot="combobox-chip-remove"
                >
                    <XIcon className="pointer-events-none" />
                </ComboboxPrimitive.ChipRemove>
            )}
        </ComboboxPrimitive.Chip>
    )
}

function ComboboxChipsInput({
    className,
    ...props
}: ComboboxPrimitive.Input.Props) {
    return (
        <ComboboxPrimitive.Input
            data-slot="combobox-chip-input"
            className={cn(comboboxChipsInputVariants(), className)}
            {...props}
        />
    )
}

function useComboboxAnchor() {
    return React.useRef<HTMLDivElement | null>(null)
}

export {
    Combobox,
    ComboboxInput,
    ComboboxContent,
    ComboboxList,
    ComboboxItem,
    ComboboxItemIndicator,
    ComboboxGroup,
    ComboboxLabel,
    ComboboxCollection,
    ComboboxEmpty,
    ComboboxSeparator,
    ComboboxChips,
    ComboboxChip,
    ComboboxChipsInput,
    ComboboxTrigger,
    ComboboxValue,
    useComboboxAnchor,
}
