// ── Productos más vendidos (nivel global) ───────────────────────────────────
// Lista con distribución: miniatura · nombre + unidades · precio + ventas.
// Presentacional: recibe la lista por props. Sin estado → Server Component.
//
// Ubicación sugerida: src/components/tables/TopProductsTable.tsx

import { cn } from "@/lib/utils";
import type { ProductAccent, TopProduct } from "@/lib/top-products";

interface TopProductsTableProps {
    products: TopProduct[];
    className?: string;
}

// Fondo del avatar según el color del producto (tokens del design system)
const ACCENT_BG: Record<ProductAccent, string> = {
    success: "bg-success-lighter",
    warning: "bg-warning-lighter",
    info: "bg-info-lighter",
    secondary: "bg-secondary-lighter",
    error: "bg-error-lighter",
};

const fmtUnits = (n: number) => n.toLocaleString("es-MX");
const fmtPrice = (n: number) => new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(n);
const compact = new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 });
const fmtRevenue = (n: number) => "$" + compact.format(n);

export default function TopProductsTable({ products, className }: TopProductsTableProps) {
    return (
        <div
            className={cn(
                "flex w-full min-w-0 flex-col rounded-2xl border border-neutral-200 bg-white p-6",
                "shadow-[0_1px_2px_rgba(145,158,171,0.16)]",
                className
            )}
        >
            {/* ── Cabecera ───────────────────────────────────────────────── */}
            <div className="mb-4 flex items-start justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <h3 className="text-lg font-bold text-neutral-800">Productos más vendidos</h3>
                    <p className="text-sm text-neutral-500">Nivel global · Este mes</p>
                </div>
                <button
                    type="button"
                    className="shrink-0 cursor-pointer text-sm font-semibold text-primary-main hover:underline"
                >
                    Ver todos
                </button>
            </div>

            {/* ── Lista de productos ─────────────────────────────────────── */}
            <ul className="flex flex-col gap-1">
                {products.map((p) => (
                    <li
                        key={p.id}
                        className="flex items-center gap-3 rounded-xl px-2 py-2.5 transition-colors hover:bg-neutral-50"
                    >
                        {/* ── Miniatura (emoji sobre fondo de color) ─────── */}
                        <div
                            className={cn(
                                "flex size-11 shrink-0 items-center justify-center rounded-xl text-xl",
                                ACCENT_BG[p.accent]
                            )}
                        >
                            {p.emoji}
                        </div>

                        {/* ── Nombre + unidades vendidas ─────────────────── */}
                        <div className="flex min-w-0 flex-col">
                            <span className="truncate text-sm font-semibold text-neutral-800">{p.name}</span>
                            <span className="truncate text-xs text-neutral-500">
                                {fmtUnits(p.units)} vendidos
                            </span>
                        </div>

                        {/* ── Precio + ventas totales ────────────────────── */}
                        <div className="ml-auto flex shrink-0 flex-col items-end">
                            <span className="text-sm font-bold text-neutral-800 tabular-nums">
                                {fmtPrice(p.price)}
                            </span>
                            <span className="text-xs text-neutral-500 tabular-nums">
                                Total en ventas: {fmtRevenue(p.revenue)}
                            </span>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};