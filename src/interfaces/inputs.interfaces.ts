import type * as React from "react";

/** Escala compartida por todos los campos de formulario. */
export type InputSize = "sm" | "md" | "lg";

export type InputSelectorSize = InputSize;

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

/* -------------------------------------------------------------------------- */
/*  TextField                                                                  */
/* -------------------------------------------------------------------------- */

export type TextFieldSize = InputSize;

/** Tipos permitidos: el campo es de una sola línea. */
export type TextFieldType =
    | "text"
    | "email"
    | "password"
    | "search"
    | "tel"
    | "url"
    | "number";

export interface TextFieldProps
    extends Omit<
        React.ComponentPropsWithoutRef<"input">,
        "size" | "type" | "value" | "defaultValue" | "onChange" | "className"
    > {
    /** Valor del campo (modo controlado). */
    value?: string;
    /** Valor inicial (modo no controlado). */
    defaultValue?: string;
    /**
     * Se dispara en cada pulsación y al limpiar el campo.
     * Recibe el valor ya extraído; el evento nativo llega como segundo
     * argumento y es `undefined` cuando el cambio viene del botón "x".
     */
    onChange?: (
        value: string,
        event?: React.ChangeEvent<HTMLInputElement>
    ) => void;

    /** Texto de la etiqueta superior. */
    label?: string;
    /** Muestra el asterisco de campo obligatorio. */
    required?: boolean;
    /** Texto guía dentro del campo — nunca sustituye a la etiqueta. */
    placeholder?: string;
    /** Texto de ayuda debajo del campo. */
    helperText?: string;
    /** Estado de error: `true` o un mensaje (reemplaza al helperText). */
    error?: boolean | string;
    /** Deshabilita el campo. */
    disabled?: boolean;
    /** Solo lectura: enfocable y copiable, pero no editable. */
    readOnly?: boolean;

    /**
     * Tipo del control. Con `password` aparece el botón de mostrar/ocultar.
     * @default "text"
     */
    type?: TextFieldType;
    /** Muestra el botón "x" para vaciar el campo cuando tiene contenido. */
    clearable?: boolean;
    /** Icono a la izquierda del texto. */
    leftIcon?: React.ReactNode;
    /** Adorno a la derecha del texto (icono, sufijo o botón). */
    rightIcon?: React.ReactNode;

    /** Máximo de caracteres admitidos. */
    maxLength?: number;
    /** Muestra el contador a la derecha del texto de ayuda. */
    showCount?: boolean;

    /** Alto, tipografía, padding y tamaño de iconos. */
    size?: TextFieldSize;
    /** Ocupa el 100% del contenedor padre. */
    fullWidth?: boolean;

    /** Clases del contenedor externo. */
    className?: string;
    /** Clases del campo (InputGroup). */
    fieldClassName?: string;
    /** Clases del `<input>`. */
    inputClassName?: string;
}
