"use client";

// ── Rejilla de productos ────────────────────────────────────────────────────
// Panel gobernado por las pestañas de categoría. Las tarjetas se reparten con
// `auto-fill` para que la rejilla se recomponga sola en cualquier ancho, sin
// puntos de ruptura que mantener.
//
// Va en una lista (`ul`/`li`) para que el lector de pantalla anuncie cuántos
// productos hay antes de recorrerlos uno a uno.

import type { ReactNode } from "react";

import ProductCard from "@/components/cards/ProductCard";
import { cn } from "@/lib/utils";
import type { Product } from "@/lib/products";

interface ProductsGridProps {
    products: Product[];
    /** Abre la edición de un producto. */
    onEditProduct?: ((product: Product) => void) | undefined;
    /** Pide eliminar un producto — la confirmación vive en la pantalla. */
    onDeleteProduct?: ((product: Product) => void) | undefined;
    /** Id del panel: las pestañas apuntan aquí con `aria-controls`. */
    panelId: string;
    /** Nombre accesible del panel, ej. "Productos de Bebidas". */
    panelLabel: string;
    /** Qué mostrar cuando el filtro no devuelve nada. */
    emptyState: ReactNode;
    className?: string;
}

export default function ProductsGrid({
    products,
    onEditProduct,
    onDeleteProduct,
    panelId,
    panelLabel,
    emptyState,
    className,
}: ProductsGridProps) {
    return (
        <div
            id={panelId}
            role="tabpanel"
            aria-label={panelLabel}
            className={cn("min-w-0", className)}
        >
            {products.length === 0 ? (
                emptyState
            ) : (
                <ul className="grid grid-cols-[repeat(auto-fill,minmax(min(15rem,100%),1fr))] gap-4 md:gap-5">
                    {products.map((product) => (
                        <li key={product.id} className="min-w-0">
                            <ProductCard
                                product={product}
                                onEdit={onEditProduct}
                                onDelete={onDeleteProduct}
                                className="h-full"
                            />
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};
