"use client";

// ── Estado vacío del catálogo ───────────────────────────────────────────────
// Un listado sin resultados es un callejón sin salida: además de decir que no
// hay nada, repite qué se buscó y ofrece la salida (limpiar los filtros).

import { PackageSearch } from "lucide-react";

import GenericButton from "@/components/buttons/GenericButton";
import { cn } from "@/lib/utils";

interface ProductsEmptyStateProps {
    /** Término buscado — se cita para que se vea si hubo una errata. */
    query: string;
    onClearFilters: () => void;
    className?: string;
}

export default function ProductsEmptyState({
    query,
    onClearFilters,
    className,
}: ProductsEmptyStateProps) {
    const trimmedQuery = query.trim();

    return (
        <div
            className={cn(
                "flex flex-col items-center justify-center gap-4 px-6 py-16 text-center",
                className
            )}
        >
            <div className="flex size-14 items-center justify-center rounded-full bg-neutral-200">
                <PackageSearch
                    size={26}
                    aria-hidden="true"
                    className="text-neutral-600"
                />
            </div>

            <div className="flex max-w-sm flex-col gap-1.5">
                <p className="text-base font-semibold text-neutral-800">
                    No encontramos productos
                </p>

                <p className="text-sm text-neutral-600">
                    {trimmedQuery
                        ? `Ningún producto de esta categoría coincide con “${trimmedQuery}”. Revisa la escritura o prueba con otro término.`
                        : "Esta categoría todavía no tiene productos en la carta."}
                </p>
            </div>

            {/* Única salida del callejón sin salida, así que va en primario:
                la variante `secondary` deja el texto en neutral-500 y no llega
                al contraste mínimo sobre blanco. */}
            <GenericButton
                variant="primary"
                size="medium"
                label="Limpiar filtros"
                onClick={onClearFilters}
            />
        </div>
    );
};
