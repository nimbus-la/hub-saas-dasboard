"use client";

// ── Top de productos más vendidos ───────────────────────────────────────────
// Tarjeta compuesta: cabecera + dona de participación + lista de productos.
// Aquí solo vive el estado del producto señalado, que es lo que mantiene
// sincronizados el gráfico y la lista; los datos llegan por props (ver
// `getTopProducts` en @/lib/top-products).

import { useState } from "react";

import { cn } from "@/lib/utils";
import type { RankedProduct } from "@/lib/top-products";
import TopProductsDataTable from "./TopProductsDataTable";
import TopProductsDonut from "./TopProductsDonut";
import TopProductsList from "./TopProductsList";
import { LinkButton } from "@/components";

interface TopProductsCardProps {
    products: RankedProduct[];
    totalUnits: number;
    className?: string;
}

export default function TopProductsCard({
    products,
    totalUnits,
    className,
}: TopProductsCardProps) {
    // null = nada señalado; el índice coincide con el orden de `products`.
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const hasData = products.length > 0;

    return (
        <section
            aria-labelledby="top-products-title"
            className={cn(
                "flex w-full min-w-0 flex-col rounded-2xl border border-neutral-200 bg-white p-6",
                className
            )}
        >
            {/* ── Cabecera ───────────────────────────────────────────────── */}
            {/* Sin `flex-wrap`: el título rompe línea dentro de su columna y
                "Ver todos" se mantiene arriba a la derecha en cualquier ancho. */}
            <div className="flex items-start justify-between gap-4">
                <div className="flex min-w-0 flex-col gap-1">
                    <h3
                        id="top-products-title"
                        className="text-lg font-bold text-neutral-800"
                    >
                        Top {products.length || 5} productos más vendidos
                    </h3>
                    <p className="text-sm text-neutral-500">
                        Participación en unidades · Este mes
                    </p>
                </div>

                <LinkButton label="Ver todos" />
            </div>

            {hasData ? (
                <>
                    <TopProductsDonut
                        className="mt-4"
                        products={products}
                        totalUnits={totalUnits}
                        activeIndex={activeIndex}
                        onActiveIndexChange={setActiveIndex}
                    />

                    <div className="mt-5 border-t border-neutral-200 pt-4">
                        <TopProductsList
                            products={products}
                            activeIndex={activeIndex}
                            onActiveIndexChange={setActiveIndex}
                        />
                    </div>

                    <TopProductsDataTable products={products} totalUnits={totalUnits} />
                </>
            ) : (
                /* ── Sin datos: el hueco se explica, no se deja en blanco ── */
                <div className="mt-4 flex h-52 flex-col items-center justify-center gap-1 rounded-xl bg-neutral-100/60 px-6 text-center">
                    <p className="text-sm font-semibold text-neutral-800">
                        Aún no hay ventas registradas
                    </p>
                    <p className="text-sm text-neutral-500">
                        El ranking aparecerá cuando se registre el primer pedido.
                    </p>
                </div>
            )}
        </section>
    );
};
