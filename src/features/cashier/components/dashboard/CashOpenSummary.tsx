"use client";

import {
    Wallet,
    ShoppingCart,
    Banknote,
    ClipboardList,
} from "lucide-react";

interface CashOpenSummaryProps {
    initialAmount: number;
    cashSales: number;
    totalSales: number;
    totalOrders: number;
}

export default function CashOpenSummary({
    initialAmount,
    cashSales,
    totalSales,
    totalOrders,
}: CashOpenSummaryProps) {
    const cards = [
        {
            title: "Fondo inicial",
            value: `$${initialAmount.toLocaleString("es-CO")}`,
            icon: <Wallet size={22} />,
            color: "bg-violet-100 text-violet-600",
        },
        {
            title: "Ventas",
            value: `$${totalSales.toLocaleString("es-CO")}`,
            icon: <ShoppingCart size={22} />,
            color: "bg-emerald-100 text-emerald-600",
        },
        {
            title: "Efectivo",
            value: `$${cashSales.toLocaleString("es-CO")}`,
            icon: <Banknote size={22} />,
            color: "bg-orange-100 text-orange-600",
        },
        {
            title: "Órdenes",
            value: totalOrders.toString(),
            icon: <ClipboardList size={22} />,
            color: "bg-sky-100 text-sky-600",
        },
    ];

    return (
        <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">

            <div className="mb-6">

                <h2 className="text-2xl font-semibold text-neutral-900">
                    Turno Actual
                </h2>

                <p className="mt-1 text-sm text-neutral-500">
                    Resumen en tiempo real de la caja abierta.
                </p>

            </div>

            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">

                {cards.map((card) => (
                    <div
                        key={card.title}
                        className="rounded-xl border border-neutral-200 p-5 transition-all hover:shadow-md"
                    >
                        <div
                            className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${card.color}`}
                        >
                            {card.icon}
                        </div>

                        <p className="text-sm text-neutral-500">
                            {card.title}
                        </p>

                        <h3 className="mt-2 text-3xl font-bold text-neutral-900">
                            {card.value}
                        </h3>
                    </div>
                ))}

            </div>

        </section>
    );
}