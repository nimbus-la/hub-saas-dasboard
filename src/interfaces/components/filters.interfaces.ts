import type { VariantProps } from "class-variance-authority";
import type { LucideIcon } from "lucide-react";

import type { filterSelectTriggerVariants } from "@/components/filters/filter-select.style";


/* -------------------------------------------------------------------------- */
/*  FilterSelect                                                               */
/* -------------------------------------------------------------------------- */

export interface FilterSelectOption {
    /** Identificador que viaja al `onChange` (no se muestra). */
    value: string;
    label: string;
    /** Icono a la izquierda de la etiqueta, dentro del panel. */
    icon?: LucideIcon;
    disabled?: boolean;
}


/**
 * Props de `FilterSelect`.
 *
 * Deliberadamente más corto que el de `InputSelector`: aquí no hay etiqueta,
 * ni texto de ayuda, ni estado de error, ni `onBlur`. No es un campo de
 * formulario —no se valida ni se envía—, es un mando de una barra de filtros,
 * y las props que no tiene son las que no debería tener.
 */
export interface FilterSelectProps
    extends VariantProps<typeof filterSelectTriggerVariants> {
    /** Opciones del panel, en el orden en que se leen. */
    options: FilterSelectOption[];

    /** Opción activa (modo controlado). */
    value?: string | null;
    /** Opción inicial (modo no controlado). */
    defaultValue?: string | null;
    /** Se dispara al elegir una opción. */
    onChange?: (value: string) => void;

    /** Qué se lee cuando no hay ninguna opción elegida. */
    placeholder?: string;
    /** Icono a la izquierda del texto, en el propio control. */
    startIcon?: LucideIcon;

    disabled?: boolean;

    /**
     * Nombre accesible del filtro.
     *
     * Sin borde ni etiqueta visible, el control se anuncia sólo por su valor
     * —"Todos los estados"—, que no dice de qué es filtro. Ponlo siempre.
     */
    "aria-label"?: string;

    id?: string;
    name?: string;

    /** Clases del control. */
    className?: string;
    /** Clases del panel de opciones. */
    contentClassName?: string;
}


/** Escalón de la escala del sistema con el que se pinta el filtro. */
export type FilterSelectSize = NonNullable<FilterSelectProps["size"]>;
