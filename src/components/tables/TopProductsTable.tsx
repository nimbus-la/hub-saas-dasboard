// ── Tabla: productos más vendidos (nivel global) ────────────────────────────
// Presentacional: recibe la lista por props. Sin estado ni hooks → puede ser
// Server Component.
//
// Ubicación sugerida: src/components/tables/TopProductsTable.tsx

import { cn } from "@/lib/utils";
import type { TopProduct } from "@/lib/top-products";

interface TopProductsTableProps {
    products: TopProduct[];
    className?: string;
}

const compact = new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 });
const fmtMoney = (n: number) => "$" + compact.format(n);
const fmtUnits = (n: number) => n.toLocaleString("es-MX");

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
            <div className="mb-4 flex flex-col gap-1">
                <h3 className="text-lg font-bold text-neutral-800">Productos más vendidos</h3>
                <p className="text-sm text-neutral-500">Nivel global · Este mes</p>
            </div>

            {/* ── Tabla ──────────────────────────────────────────────────── */}
            <table className="w-full border-collapse">
                <thead>
                    <tr className="border-b border-neutral-200">
                        <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500">
                            Producto
                        </th>
                        <th className="pb-3 text-right text-xs font-semibold uppercase tracking-wide text-neutral-500">
                            Unidades
                        </th>
                        <th className="pb-3 text-right text-xs font-semibold uppercase tracking-wide text-neutral-500">
                            Ingresos
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((p, i) => (
                        <tr key={p.id} className="border-b border-neutral-100 last:border-0">
                            {/* ── Producto: ranking + nombre + categoría ─────── */}
                            <td className="py-3 align-middle">
                                <div className="flex items-center gap-3">
                                    <span
                                        className={cn(
                                            "flex size-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold",
                                            i === 0
                                                ? "bg-primary-lighter text-primary-main"
                                                : "bg-neutral-100 text-neutral-600"
                                        )}
                                    >
                                        {i + 1}
                                    </span>
                                    <div className="flex min-w-0 flex-col">
                                        <span className="truncate text-sm font-semibold text-neutral-800">
                                            {p.name}
                                        </span>
                                        <span className="truncate text-xs text-neutral-500">
                                            {p.category}
                                        </span>
                                    </div>
                                </div>
                            </td>

                            {/* ── Unidades ───────────────────────────────────── */}
                            <td className="py-3 text-right align-middle text-sm font-semibold tabular-nums text-neutral-800">
                                {fmtUnits(p.units)}
                            </td>

                            {/* ── Ingresos ───────────────────────────────────── */}
                            <td className="py-3 text-right align-middle text-sm tabular-nums text-neutral-600">
                                {fmtMoney(p.revenue)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};