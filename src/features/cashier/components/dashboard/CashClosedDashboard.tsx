"use client";

import type { ReactNode } from "react";
import {
    Wallet,
    ShoppingCart,
    ClipboardList,
    CreditCard,
    TrendingUp,
    CalendarDays,
    Clock3,
    Shield,
    Headphones,
} from "lucide-react";

import GenericButton from "@/components/buttons/GenericButton";
import CashierClosedHero from "./CashierClosedHero";
import CashSummaryCard from "./CashSummaryCard";

interface CashClosedDashboardProps {
    onOpenCash: () => void;
}

export default function CashClosedDashboard({
    onOpenCash,
}: CashClosedDashboardProps) {
    return (
        <div className="space-y-6">

            <CashierClosedHero
                onOpenCash={onOpenCash}
            />

            <section className="rounded-2xl border border-neutral-200 bg-white p-6">

                <div className="mb-6 flex items-center gap-3">

                    <div className="rounded-xl bg-violet-100 p-3">
                        <CalendarDays className="text-violet-600" />
                    </div>

                    <div>
                        <h3 className="text-xl font-semibold">
                            Resumen del día anterior
                        </h3>

                        <p className="text-sm text-neutral-500">
                            Último cierre: 04 mayo 2025 · 11:45 PM
                        </p>
                    </div>

                </div>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">

                    <CashSummaryCard
                        icon={<Wallet size={22} />}
                        title="Fondo inicial"
                        value="$200.000"
                        subtitle="Monto inicial registrado"
                    />

                    <CashSummaryCard
                        icon={<ShoppingCart size={22} />}
                        title="Ventas"
                        value="$860.000"
                        subtitle="Ventas del turno anterior"
                    />

                    <CashSummaryCard
                        icon={<ClipboardList size={22} />}
                        title="Órdenes"
                        value="28"
                        subtitle="Órdenes procesadas"
                    />

                    <CashSummaryCard
                        icon={<CreditCard size={22} />}
                        title="Pagos"
                        value="28"
                        subtitle="Pagos realizados"
                    />

                    <CashSummaryCard
                        icon={<TrendingUp size={22} />}
                        title="Efectivo"
                        value="$420.000"
                        subtitle="Cobros en efectivo"
                    />

                </div>

            </section>

            <section className="grid gap-5 lg:grid-cols-3 rounded-2xl border border-neutral-200 bg-white p-6">

                <Info
                    icon={<Clock3 />}
                    title="Horario del turno"
                    description="El último turno inició a las 8:00 AM y finalizó a las 11:45 PM."
                />

                <Info
                    icon={<CalendarDays />}
                    title="Cierre de caja"
                    description="Recuerda contar el efectivo antes de finalizar el turno."
                />

                <Info
                    icon={<Shield />}
                    title="Seguridad"
                    description="Solo el cajero responsable puede abrir o cerrar la caja."
                />

            </section>

            <section className="flex flex-col gap-4 rounded-2xl bg-violet-50 p-6 lg:flex-row lg:items-center lg:justify-between">

                <div className="flex items-center gap-4">

                    <div className="rounded-xl bg-violet-100 p-3">
                        <Headphones className="text-violet-600" />
                    </div>

                    <div>

                        <h3 className="text-lg font-semibold">
                            ¿Necesitas ayuda?
                        </h3>

                        <p className="text-sm text-neutral-600">
                            Si tienes algún inconveniente durante el turno, contacta al administrador.
                        </p>

                    </div>

                </div>

                <GenericButton
                    label="Contactar soporte"
                    variant="secondary"
                />

            </section>

        </div>
    );
}

interface InfoProps {
    icon: ReactNode;
    title: string;
    description: string;
}

function Info({
    icon,
    title,
    description,
}: InfoProps) {
    return (
        <div className="flex gap-4">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
                {icon}
            </div>

            <div>

                <h4 className="font-semibold text-neutral-900">
                    {title}
                </h4>

                <p className="mt-2 text-sm text-neutral-500">
                    {description}
                </p>

            </div>

        </div>
    );
}