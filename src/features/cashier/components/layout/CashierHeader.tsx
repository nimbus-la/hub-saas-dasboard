"use client";

import { Store, Lock, Unlock } from "lucide-react";

import GenericButton from "@/components/buttons/GenericButton";

interface CashierHeaderProps {
    isOpen: boolean;
    onOpenCash: () => void;
    onCloseCash: () => void;
}

export default function CashierHeader({
    isOpen,
    onOpenCash,
    onCloseCash,
}: CashierHeaderProps) {
    return (
        <div className="flex flex-col gap-4 rounded-xl border border-neutral-200 bg-white p-6 shadow-sm lg:flex-row lg:items-center lg:justify-between">

            <div className="flex items-center gap-4">

                <div
                    className={`flex h-14 w-14 items-center justify-center rounded-xl ${isOpen
                            ? "bg-success-lighter text-success-main"
                            : "bg-error-lighter text-error-main"
                        }`}
                >
                    <Store size={26} />
                </div>

                <div>

                    <h1 className="text-2xl font-semibold text-neutral-900">
                        Caja
                    </h1>

                    <p className="mt-1 text-sm text-neutral-500">
                        Gestiona las órdenes pendientes y controla la apertura y cierre de caja.
                    </p>

                </div>

            </div>

            <div className="flex items-center gap-3">

                <div
                    className={`rounded-full px-4 py-2 text-sm font-medium ${isOpen
                            ? "bg-success-lighter text-success-main"
                            : "bg-error-lighter text-error-main"
                        }`}
                >
                    {isOpen ? "Caja Abierta" : "Caja Cerrada"}
                </div>

                {isOpen ? (
                    <GenericButton
                        label="Cerrar Caja"
                        onClick={onCloseCash}
                        startIcon={Lock}
                    />
                ) : (
                    <GenericButton
                        label="Abrir Caja"
                        onClick={onOpenCash}
                        startIcon={Unlock}
                    />
                )}

            </div>

        </div>
    );
}