"use client";

// ── Cabecera de la pantalla de productos ────────────────────────────────────
// Título, total del catálogo y la acción principal. El total va pegado al
// título — no en el buscador — porque cuenta todo el catálogo y no cambia al
// filtrar; lo que sí cambia se resume junto a la paginación.

import { Plus } from "lucide-react";

import GenericButton from "@/components/buttons/GenericButton";
import { cn } from "@/lib/utils";
import { formatProductCount } from "@/lib/products";

interface ProductsHeaderProps {
    /** Productos del catálogo completo, sin filtros aplicados. */
    totalProducts: number;
    onCreateProduct: () => void;
    className?: string;
}

export default function ProductsHeader({
    totalProducts,
    onCreateProduct,
    className,
}: ProductsHeaderProps) {
    return (
        <div
            className={cn(
                "flex flex-wrap items-start justify-between gap-x-4 gap-y-3",
                className
            )}
        >
            <div className="flex min-w-0 flex-col gap-1">
                <div className="flex flex-wrap items-center gap-2.5">
                    <h1 className="text-2xl font-bold tracking-tight text-neutral-800">
                        Productos
                    </h1>

                    <span className="inline-flex shrink-0 items-center rounded-md bg-neutral-200 px-2 py-0.5 text-xs font-semibold tabular-nums text-neutral-700">
                        {formatProductCount(totalProducts)}
                    </span>
                </div>

                <p className="text-sm text-neutral-600">
                    Gestiona la carta de tus sucursales y avisa al equipo cuando falte
                    un insumo.
                </p>
            </div>

            {/* Cuando exista el formulario, basta con navegar a su ruta desde
                `onCreateProduct` para que el botón deje de ser un gancho. */}
            <GenericButton
                label="Crear producto"
                startIcon={Plus}
                onClick={onCreateProduct}
                className="shrink-0"
            />
        </div>
    );
};
