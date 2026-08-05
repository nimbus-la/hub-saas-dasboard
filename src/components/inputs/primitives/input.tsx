import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"

import { cn } from "@/lib/utils"

import { inputVariants } from "./input-group.style"

/**
 * Campo de texto desnudo.
 *
 * Es el primitivo: `TextField` es el que se usa en pantalla. Este se queda
 * para lo que no necesite etiqueta, ayuda ni contador — y como base de
 * `InputGroupInput`, que le quita el borde para meterlo dentro de un grupo.
 */
function Input({ className, type, ...props }: React.ComponentProps<"input">) {
    return (
        <InputPrimitive
            type={type}
            data-slot="input"
            className={cn(inputVariants(), className)}
            {...props}
        />
    )
}

export { Input }
