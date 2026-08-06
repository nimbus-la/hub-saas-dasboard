"use client";

// ── Checkbox del DataTable ──────────────────────────────────────────────────
// Input nativo (accesible y navegable con teclado) oculto visualmente, con un
// recuadro propio pintado con los tokens del design system. Soporta el estado
// indeterminado que necesita el checkbox del encabezado cuando la selección es
// parcial: el navegador lo anuncia como "mixed" a los lectores de pantalla.

import { useEffect, useRef } from "react";
import { Check, Minus } from "lucide-react";

import type { DataTableCheckboxProps } from "@/interfaces";
import { cn } from "@/lib/utils";
import { ICON_SIZE, ICON_STROKE_BY_SIZE } from "@/tokens";

import {
    dataTableCheckboxBoxVariants,
    dataTableCheckboxVariants,
} from "./data-table-checkbox.style";


export default function DataTableCheckbox({
    label,
    checked,
    indeterminate = false,
    disabled = false,
    onChange,
}: DataTableCheckboxProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    // `indeterminate` sólo existe como propiedad del DOM, no como atributo HTML,
    // por eso se asigna por referencia y no de forma declarativa.
    const isIndeterminate = indeterminate && !checked;

    useEffect(() => {
        if (inputRef.current) inputRef.current.indeterminate = isIndeterminate;
    }, [isIndeterminate]);

    const isMarked = checked || isIndeterminate;

    return (
        <label className={dataTableCheckboxVariants({ disabled })}>
            <input
                ref={inputRef}
                type="checkbox"
                className="peer sr-only"
                aria-label={label}
                checked={checked}
                disabled={disabled}
                onChange={onChange}
            />

            <span
                aria-hidden
                className={cn(
                    dataTableCheckboxBoxVariants({ marked: isMarked, disabled })
                )}
            >
                {checked && (
                    <Check
                        size={ICON_SIZE.xs}
                        strokeWidth={ICON_STROKE_BY_SIZE.xs}
                    />
                )}

                {isIndeterminate && (
                    <Minus
                        size={ICON_SIZE.xs}
                        strokeWidth={ICON_STROKE_BY_SIZE.xs}
                    />
                )}
            </span>
        </label>
    );
};
