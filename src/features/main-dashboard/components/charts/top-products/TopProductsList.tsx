"use client";

// ── Lista del top de productos (leyenda de la dona) ─────────────────────────
// Cada fila es una porción del gráfico: miniatura + nombre, las unidades
// vendidas debajo y el precio unitario a la derecha. Señalar una fila resalta
// su porción (y el hover del gráfico resalta la fila), así que la lista hace de
// leyenda sin depender solo del color: el puesto y el porcentaje van en texto.

import Image from "next/image";

import { cn } from "@/lib/utils";
import {
    formatShare,
    formatUnitPrice,
    formatUnits,
    type ProductAccent,
    type RankedProduct,
} from "@/lib/top-products";

interface TopProductsListProps {
    products: RankedProduct[];
    activeIndex: number | null;
    onActiveIndexChange: (index: number | null) => void;
}

// Fondo de la miniatura y punto de la leyenda (tokens del design system).
// Clases completas a propósito: Tailwind no detecta nombres construidos.
const ACCENT_STYLES: Record<ProductAccent, { tile: string; dot: string }> = {
    warning: { tile: "bg-warning-lighter", dot: "bg-warning-main" },
    error: { tile: "bg-error-lighter", dot: "bg-error-main" },
    success: { tile: "bg-success-lighter", dot: "bg-success-main" },
    info: { tile: "bg-info-lighter", dot: "bg-info-main" },
    secondary: { tile: "bg-secondary-lighter", dot: "bg-secondary-main" },
};

const THUMBNAIL_SIZE = 32;

export default function TopProductsList({
    products,
    activeIndex,
    onActiveIndexChange,
}: TopProductsListProps) {
    return (
        <div className="flex flex-col">
            {/* ── Encabezado de columnas ─────────────────────────────────── */}
            <div
                aria-hidden="true"
                className="flex items-center justify-between px-2 pb-2 text-[11px] font-semibold tracking-wide text-neutral-500 uppercase"
            >
                <span>Producto</span>
                <span>Precio unitario</span>
            </div>

            <ul className="flex flex-col">
                {products.map((product, index) => {
                    const accent = ACCENT_STYLES[product.accent];
                    const isActive = index === activeIndex;

                    return (
                        <li
                            key={product.id}
                            onMouseEnter={() => onActiveIndexChange(index)}
                            onMouseLeave={() => onActiveIndexChange(null)}
                            className={cn(
                                "flex items-center gap-3 rounded-xl px-2 py-2.5",
                                "transition-colors duration-150 ease-out motion-reduce:transition-none",
                                isActive ? "bg-neutral-100" : "bg-transparent"
                            )}
                        >
                            {/* ── Miniatura + puesto en el top ───────────── */}
                            <div
                                className={cn(
                                    "relative flex size-11 shrink-0 items-center justify-center rounded-xl",
                                    accent.tile
                                )}
                            >
                                <Image
                                    src={product.image}
                                    alt=""
                                    width={THUMBNAIL_SIZE}
                                    height={THUMBNAIL_SIZE}
                                    className="size-8"
                                />

                                <span
                                    aria-hidden="true"
                                    className="absolute -top-1.5 -left-1.5 flex size-4.5 items-center justify-center rounded-full bg-white text-[10px] font-bold text-neutral-600 ring-1 ring-neutral-300"
                                >
                                    {product.rank}
                                </span>
                            </div>

                            {/* ── Nombre + unidades vendidas ─────────────── */}
                            <div className="flex min-w-0 flex-col">
                                <span className="truncate text-sm font-semibold text-neutral-800">
                                    <span className="sr-only">Puesto {product.rank}: </span>
                                    {product.name}
                                </span>

                                <span className="truncate text-xs text-neutral-500 tabular-nums">
                                    {formatUnits(product.units)} unidades vendidas
                                </span>
                            </div>

                            {/* ── Precio unitario + participación ────────── */}
                            <div className="ml-auto flex shrink-0 flex-col items-end">
                                <span className="text-sm font-bold text-neutral-800 tabular-nums">
                                    <span className="sr-only">Precio unitario: </span>
                                    {formatUnitPrice(product.price)}
                                </span>

                                <span className="flex items-center gap-1.5 text-xs text-neutral-500 tabular-nums">
                                    <span
                                        aria-hidden="true"
                                        className={cn("size-2 shrink-0 rounded-full", accent.dot)}
                                    />
                                    {formatShare(product.share)}
                                    <span className="sr-only"> de las unidades del top</span>
                                </span>
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};
