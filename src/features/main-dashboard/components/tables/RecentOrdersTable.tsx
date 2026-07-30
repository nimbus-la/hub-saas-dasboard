"use client";

import type { ColumnDef } from "@tanstack/react-table";

import StatusBadge from "@/components/badges/StatusBadge";
import LinkButton from "@/components/buttons/LinkButton";
import DataTable from "@/components/tables/DataTable";
import TitleSubtitleCell from "@/components/tables/TitleSubtitleCell";
import { ORDER_STATUS_LABELS, type Order, type OrderStatus } from "@/lib/recent-orders";
import { cn } from "@/lib/utils";
import { BadgeTone } from "@/interfaces";


// ── Formateadores ───────────────────────────────────────────────────────────
// Se crean una sola vez a nivel de módulo (instanciar Intl en cada celda es caro).
// La fecha se formatea en UTC para que servidor y cliente coincidan y no haya
// desajustes de hidratación por la zona horaria del navegador.
const currencyFormatter = new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
});

const dateFormatter = new Intl.DateTimeFormat("es-MX", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "UTC",
});


// Color de la insignia según el estado de la orden (tokens del design system).
const STATUS_TONES: Record<OrderStatus, BadgeTone> = {
    completado: "success",
    pendiente: "warning",
    cancelado: "error",
};


// ── Columnas ────────────────────────────────────────────────────────────────
// Constante de módulo: la referencia es estable entre renders, así el DataTable
// no recalcula su modelo de columnas innecesariamente.
const orderColumns: ColumnDef<Order>[] = [
    {
        accessorKey: "orderNumber",
        header: "N.º de orden",
        cell: ({ row }) => (
            <span className="font-semibold tabular-nums text-neutral-800">
                #{row.original.orderNumber}
            </span>
        ),
    },
    {
        accessorKey: "customerName",
        header: "Cliente",
        cell: ({ row }) => (
            <TitleSubtitleCell
                title={row.original.customerName}
                subtitle={row.original.customerEmail}
            />
        ),
    },
    {
        accessorKey: "amount",
        header: "Monto",
        meta: { align: "right" },
        cell: ({ row }) => (
            <span className="font-semibold tabular-nums text-neutral-800">
                {currencyFormatter.format(row.original.amount)}
            </span>
        ),
    },
    {
        accessorKey: "status",
        header: "Estado",
        cell: ({ row }) => (
            <StatusBadge
                tone={STATUS_TONES[row.original.status]}
                label={ORDER_STATUS_LABELS[row.original.status]}
            />
        ),
    },
    {
        accessorKey: "placedAt",
        header: "Fecha de la orden",
        cell: ({ row }) => (
            <time dateTime={row.original.placedAt} className="tabular-nums">
                {dateFormatter.format(new Date(row.original.placedAt))}
            </time>
        ),
    },
];


interface RecentOrdersTableProps {
    orders: Order[];
    className?: string;
};


export default function RecentOrdersTable({ orders, className }: RecentOrdersTableProps) {
    return (
        <div
            className={cn(
                "flex w-full min-w-0 flex-col gap-5 rounded-lg border border-neutral-200 bg-white p-6",
                className
            )}
        >
            {/* ── Cabecera ───────────────────────────────────────────────── */}
            <div className="flex items-start justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <h3 className="text-lg font-bold text-neutral-800">Órdenes recientes</h3>
                    <p className="text-sm text-neutral-500">
                        Últimas órdenes registradas en tus sucursales
                    </p>
                </div>

                {/* Cuando exista la ruta del listado completo, basta añadir
                    `href="/orders"` para que navegue en lugar de ejecutar. */}
                <LinkButton label="Ver todas" />
            </div>

            {/* ── Tabla ──────────────────────────────────────────────────── */}
            <DataTable
                data={orders}
                columns={orderColumns}
                enableRowSelection
                getRowId={(order) => order.id}
                initialSorting={[{ id: "placedAt", desc: true }]}
                emptyMessage="Aún no se han registrado órdenes."
            />
        </div>
    );
};
