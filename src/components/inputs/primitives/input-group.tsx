"use client"

import * as React from "react"
import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

import { Input } from "./input"
import { Textarea } from "./textarea"
import {
    inputGroupAddonVariants,
    inputGroupButtonVariants,
    inputGroupControlVariants,
    inputGroupTextVariants,
    inputGroupTextareaVariants,
    inputGroupVariants,
} from "./input-group.style"


/**
 * Primitivos del campo compuesto
 * 
 * Estructura y comportamiento; el aspecto está en `input-group.style.ts`.
 * 
 * Los `data-slot` son contrato público: `text-field.style.ts` y
 * `input-selector.style.ts` los usan para llegar al control, a los adornos y
 * a los botones desde el contenedor. No renombrarlos.
 * 
 * El botón interno se apoya en el primitivo de Base UI, no en el `Button` de
 * shadcn: hace falta que soporte `render` porque el combobox monta sobre él
 * su disparador y su botón de limpiar.
 */


function InputGroup({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="input-group"
            role="group"
            className={cn(inputGroupVariants(), className)}
            {...props}
        />
    )
}

function InputGroupAddon({
    className,
    align = "inline-start",
    ...props
}: React.ComponentProps<"div"> & VariantProps<typeof inputGroupAddonVariants>) {
    return (
        <div
            role="group"
            data-slot="input-group-addon"
            data-align={align}
            className={cn(inputGroupAddonVariants({ align }), className)}
            // Pinchar el adorno enfoca el campo: el icono forma parte del área
            // del control, aunque no sea el control.
            onClick={(e) => {
                if ((e.target as HTMLElement).closest("button")) {
                    return
                }
                e.currentTarget.parentElement?.querySelector("input")?.focus()
            }}
            {...props}
        />
    )
}

function InputGroupButton({
    className,
    type = "button",
    variant = "ghost",
    size = "xs",
    ...props
}: Omit<ButtonPrimitive.Props, "type"> &
    VariantProps<typeof inputGroupButtonVariants> & {
        type?: "button" | "submit" | "reset"
    }) {
    return (
        <ButtonPrimitive
            type={type}
            data-slot="input-group-button"
            data-size={size}
            className={cn(inputGroupButtonVariants({ variant, size }), className)}
            {...props}
        />
    )
}

function InputGroupText({ className, ...props }: React.ComponentProps<"span">) {
    return (
        <span className={cn(inputGroupTextVariants(), className)} {...props} />
    )
}

function InputGroupInput({
    className,
    ...props
}: React.ComponentProps<"input">) {
    return (
        <Input
            data-slot="input-group-control"
            className={cn(inputGroupControlVariants(), className)}
            {...props}
        />
    )
}

function InputGroupTextarea({
    className,
    ...props
}: React.ComponentProps<"textarea">) {
    return (
        <Textarea
            data-slot="input-group-control"
            className={cn(inputGroupTextareaVariants(), className)}
            {...props}
        />
    )
}

export {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupText,
    InputGroupInput,
    InputGroupTextarea,
}
