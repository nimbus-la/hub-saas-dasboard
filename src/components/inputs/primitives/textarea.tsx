import * as React from "react"

import { cn } from "@/lib/utils"

import { textareaVariants } from "./input-group.style"

/**
 * Área de texto desnuda.
 *
 * `TextAreaField` es el componente de pantalla; este es el primitivo que hay
 * debajo y la base de `InputGroupTextarea`.
 */
function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
    return (
        <textarea
            data-slot="textarea"
            className={cn(textareaVariants(), className)}
            {...props}
        />
    )
}

export { Textarea }
