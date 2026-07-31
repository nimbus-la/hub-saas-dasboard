import type * as React from "react";

export type InputSelectorSize = "sm" | "md" | "lg";

export interface InputSelectorOption {
    label: string;
    value: string;
    /** Icono opcional a la izquierda de la opción. */
    icon?: React.ReactNode;
    disabled?: boolean;
}

/** Acepta objetos `{ label, value }` o strings sueltos ("Next.js"). */
export type InputSelectorRawOption = InputSelectorOption | string;

export interface InputSelectorProps {
    /** Opciones a mostrar/filtrar. */
    options: InputSelectorRawOption[];
    /** Valor seleccionado (modo controlado). */
    value?: string | null;
    /** Valor inicial (modo no controlado). */
    defaultValue?: string | null;
    /** Se dispara al seleccionar (string vacío al limpiar). */
    onChange?: (value: string) => void;
    /**
     * Se dispara al seleccionar o limpiar (`null` = limpio).
     * @deprecated Usa `onChange`. Se mantiene por compatibilidad.
     */
    onValueChange?: (value: string | null) => void;

    /** Texto de la etiqueta superior. */
    label?: string;
    /** Muestra el asterisco de campo obligatorio. */
    required?: boolean;
    /** Placeholder — el campo funciona como buscador. */
    placeholder?: string;
    /** Texto de ayuda debajo del campo. */
    helperText?: string;
    /** Estado de error: `true` o un mensaje (reemplaza al helperText). */
    error?: boolean | string;
    /** Deshabilita el campo. */
    disabled?: boolean;
    /** Solo lectura. */
    readOnly?: boolean;
    /** Muestra el botón "x" para limpiar la selección. */
    clearable?: boolean;
    /** Icono a la izquierda del valor. */
    leftIcon?: React.ReactNode;
    /**
     * Icono a la izquierda del valor.
     * @deprecated Usa `leftIcon`. Se mantiene por compatibilidad.
     */
    leadingIcon?: React.ReactNode;
    /** Mensaje cuando la búsqueda no arroja coincidencias. */
    emptyMessage?: string;
    /** Alto, tipografía, padding y tamaño de iconos. */
    size?: InputSelectorSize;
    /** Ocupa el 100% del contenedor padre. */
    fullWidth?: boolean;

    name?: string;
    id?: string;
    /** Clases del contenedor externo. */
    className?: string;
    /** Clases del campo (InputGroup). */
    triggerClassName?: string;
    /**
     * Clases del campo (InputGroup).
     * @deprecated Usa `triggerClassName`. Se mantiene por compatibilidad.
     */
    inputClassName?: string;
    /** Clases del panel de opciones. */
    contentClassName?: string;
}
