import type { VariantProps } from "class-variance-authority";

import { switchTrackVariants } from "@/components";


/**
 * Escalón del interruptor.
 *
 * Solo `sm` y `md`: por debajo la perilla no se acierta con el dedo y por
 * encima el carril se convierte en el elemento más pesado de una fila de
 * ajustes. Se deriva de las variantes para no mantener dos listas.
 */
export type SwitchSize = NonNullable<
    VariantProps<typeof switchTrackVariants>["size"]
>;


export interface SwitchProps {
    /** Estado del interruptor (modo controlado). */
    checked?: boolean;
    /** Estado inicial (modo no controlado). */
    defaultChecked?: boolean;
    onCheckedChange?: (checked: boolean) => void;

    /**
     * Etiqueta visible a la izquierda del control.
     * Sin ella hay que pasar `aria-label`: el interruptor no tiene texto propio.
     */
    label?: string;
    /** Aclaración breve bajo la etiqueta. */
    description?: string;
    disabled?: boolean;
    size?: SwitchSize;

    name?: string;
    id?: string;
    /** Clases del contenedor externo. */
    className?: string;
    /** Clases del carril. */
    trackClassName?: string;

    "aria-label"?: string;
    "aria-describedby"?: string;
}
