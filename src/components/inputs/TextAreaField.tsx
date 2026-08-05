"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import type { TextAreaFieldProps } from "@/interfaces";

import {
    textAreaHelperVariants,
    textAreaLabelVariants,
    textAreaVariants,
} from "./textarea-field.style";

export function TextAreaField({
    value,
    defaultValue,
    onChange,
    label,
    required = false,
    placeholder,
    helperText,
    error = false,
    disabled = false,
    maxLength,
    showCount = false,
    rows = 4,
    id,
    className,
    fieldClassName,
    ref,
    ...textareaProps
}: TextAreaFieldProps & { ref?: React.Ref<HTMLTextAreaElement> }) {
    const reactId = React.useId();
    const fieldId = id ?? reactId;

    // Modo no controlado: el valor vive aquí para que el contador funcione sin
    // obligar al consumidor a manejar estado.
    const isControlled = value !== undefined;
    const [innerValue, setInnerValue] = React.useState(defaultValue ?? "");
    const currentValue = isControlled ? value : innerValue;

    const invalid = Boolean(error);
    const message = typeof error === "string" ? error : helperText;
    const describedBy = message || showCount ? `${fieldId}-description` : undefined;

    const handleChange = React.useCallback(
        (event: React.ChangeEvent<HTMLTextAreaElement>) => {
            if (!isControlled) setInnerValue(event.target.value);
            onChange?.(event.target.value, event);
        },
        [isControlled, onChange]
    );

    return (
        <div className={cn("w-full", className)}>
            {label && (
                <label
                    htmlFor={fieldId}
                    className={textAreaLabelVariants({ disabled })}
                >
                    {label}
                    {required && (
                        <span aria-hidden="true" className="ml-0.5 text-error-main">
                            *
                        </span>
                    )}
                </label>
            )}

            <textarea
                ref={ref}
                id={fieldId}
                rows={rows}
                placeholder={placeholder}
                disabled={disabled}
                required={required}
                maxLength={maxLength}
                aria-invalid={invalid || undefined}
                aria-describedby={describedBy}
                value={currentValue}
                onChange={handleChange}
                className={cn(textAreaVariants({ invalid }), fieldClassName)}
                {...textareaProps}
            />

            {(message || showCount) && (
                <div className="mt-1 flex items-start justify-between gap-4">
                    <p
                        id={describedBy}
                        // El mensaje de error se anuncia sin robar el foco.
                        aria-live={invalid ? "polite" : undefined}
                        className={textAreaHelperVariants({ invalid })}
                    >
                        {message}
                    </p>

                    {showCount && (
                        <span
                            // Cifras tabulares: sin ellas el contador baila de
                            // ancho con cada tecla.
                            className={cn(
                                "shrink-0 text-caption tabular-nums select-none",
                                invalid ? "text-error-dark" : "text-neutral-600"
                            )}
                        >
                            {currentValue.length}
                            {maxLength ? `/${maxLength}` : ""}
                        </span>
                    )}
                </div>
            )}
        </div>
    );
}
