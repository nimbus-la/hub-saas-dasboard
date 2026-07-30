"use client";

// ── Checkbox del DataTable ──────────────────────────────────────────────────
// Input nativo (accesible y navegable con teclado) oculto visualmente, con un
// recuadro propio pintado con los tokens del design system. Soporta el estado
// indeterminado que necesita el checkbox del encabezado cuando la selección es
// parcial: el navegador lo anuncia como "mixed" a los lectores de pantalla.

import { useEffect, useRef, type ChangeEvent } from "react";
import { Check, Minus } from "lucide-react";

import { cn } from "@/lib/utils";


interface DataTableCheckboxProps {
    /** Etiqueta accesible (no visible). Obligatoria: el checkbox no tiene texto. */
    label: string;
    checked: boolean;
    /** Selección parcial — se pinta como guion en lugar de palomita. */
    indeterminate?: boolean;
    disabled?: boolean;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
};


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
        // El padding amplía el área de clic muy por encima del recuadro visible.
        <label
            className={cn(
                "inline-flex items-center justify-center p-2.5",
                disabled ? "cursor-not-allowed" : "cursor-pointer"
            )}
        >
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
                    "flex size-4.5 shrink-0 items-center justify-center rounded-[6px] border-[1.5px]",
                    "transition-colors duration-150",
                    "peer-focus-visible:ring-3 peer-focus-visible:ring-primary-light",
                    isMarked
                        ? "border-primary-main bg-primary-main text-white"
                        : "border-neutral-400 bg-white text-transparent",
                    !disabled && !isMarked && "peer-hover:border-primary-main",
                    disabled && "border-neutral-300 bg-neutral-200 opacity-60"
                )}
            >
                {checked && <Check size={13} strokeWidth={3} />}
                {isIndeterminate && <Minus size={13} strokeWidth={3} />}
            </span>
        </label>
    );
};
