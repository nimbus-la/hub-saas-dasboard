"use client";

// ── Buscador del catálogo ───────────────────────────────────────────────────
// El filtrado ocurre en memoria y en cada pulsación: no hay red de por medio,
// así que esperar a que se pulse Enter solo añadiría un paso.
//
// Sin etiqueta visible a propósito: la lupa y el texto guía ya dicen qué hace,
// y una etiqueta encima descuadraría la fila de filtros. El nombre accesible
// llega por `aria-label`.

import { Search } from "lucide-react";

import { TextField } from "@/components/inputs/TextField";
import { cn } from "@/lib/utils";

interface ProductsSearchProps {
    value: string;
    onChange: (value: string) => void;
    className?: string;
}

export default function ProductsSearch({
    value,
    onChange,
    className,
}: ProductsSearchProps) {
    return (
        <TextField
            type="search"
            size="md"
            value={value}
            onChange={onChange}
            clearable
            leftIcon={<Search aria-hidden="true" />}
            placeholder="Buscar por nombre o categoría"
            aria-label="Buscar productos"
            className={cn("w-full sm:max-w-xs", className)}
        />
    );
};
