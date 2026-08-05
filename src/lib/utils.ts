import { clsx, type ClassValue } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"

import { TYPOGRAPHY } from "@/tokens"

/**
 * Nombres de la rampa tipográfica sin el prefijo `text-`: "body-md", "h3",
 * "label-sm"… Se derivan de los propios tokens para que añadir un estilo a la
 * rampa no obligue a acordarse de esta lista.
 */
const typographyScale = Object.values(TYPOGRAPHY)
    .flatMap((className) => className.split(" "))
    .filter((className) => className.startsWith("text-"))
    .map((className) => className.slice("text-".length))

/**
 * tailwind-merge con la rampa del design system registrada como tamaños de
 * fuente.
 *
 * Sin esto, `cn("text-sm", "text-body-md")` deja las dos clases: tailwind-merge
 * no sabe que `text-body-md` es un tamaño y no las considera en conflicto, así
 * que cuál gana lo decide el orden del stylesheet — y suele ganar la del
 * componente de shadcn, que es justo la que se pretendía sustituir.
 */
const twMerge = extendTailwindMerge({
    extend: {
        classGroups: {
            "font-size": [{ text: typographyScale }],
        },
    },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
