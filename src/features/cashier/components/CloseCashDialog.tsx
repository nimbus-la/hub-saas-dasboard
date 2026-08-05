"use client";

import { useEffect, useMemo, useState } from "react";
import {
    Calculator,
    Wallet,
    Banknote,
} from "lucide-react";

import GenericButton from "@/components/buttons/GenericButton";

interface CloseCashDialogProps {
    isOpen: boolean;
    initialAmount: number;
    cashSales: number;
    onClose: () => void;
    onConfirm: () => void;
}

interface SummaryRowProps {
    icon: React.ReactNode;
    label: string;
    value: number;
}

function SummaryRow({
    icon,
    label,
    value,
}: SummaryRowProps) {
    return (
        <div className="flex items-center justify-between rounded-xl border border-neutral-200 p-3">

            <div className="flex items-center gap-3">

                <div className="rounded-lg bg-violet-100 p-2 text-violet-600">
                    {icon}
                </div>

                <span className="text-base font-medium">
                    {label}
                </span>

            </div>

            <span className="text-xl font-bold">
                ${value.toLocaleString("es-CO")}
            </span>

        </div>
    );
}

export default function CloseCashDialog({
    isOpen,
    initialAmount,
    cashSales,
    onClose,
    onConfirm,
}: CloseCashDialogProps) {

    const [countedCash, setCountedCash] = useState("");

    useEffect(() => {
        if (isOpen) {
            setCountedCash("");
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const expectedCash = initialAmount + cashSales;

    const difference = useMemo(() => {
        if (!countedCash) return null;

        return Number(countedCash) - expectedCash;
    }, [countedCash, expectedCash]);

    const differenceColor =
        difference === null
            ? "text-neutral-500"
            : difference === 0
                ? "text-success-main"
                : difference > 0
                    ? "text-blue-600"
                    : "text-error-main";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

            <div className="w-full max-w-xl rounded-3xl bg-white shadow-2xl">

                <div className="p-6">

                    <div className="mb-6 flex items-center gap-4">

                        <div className="rounded-xl bg-orange-100 p-3">

                            <Calculator
                                size={22}
                                className="text-orange-600"
                            />

                        </div>

                        <div>

                            <h2 className="text-2xl font-bold">
                                Cierre de Caja
                            </h2>

                            <p className="text-sm text-neutral-500">
                                Verifica el efectivo antes de finalizar tu turno.
                            </p>

                        </div>

                    </div>

                    {/* Resumen */}

                    <div className="space-y-3">

                        <SummaryRow
                            icon={<Wallet size={18} />}
                            label="Fondo inicial"
                            value={initialAmount}
                        />

                        <SummaryRow
                            icon={<Banknote size={18} />}
                            label="Ventas en efectivo"
                            value={cashSales}
                        />

                        <SummaryRow
                            icon={<Calculator size={18} />}
                            label="Total esperado"
                            value={expectedCash}
                        />

                    </div>


                    <div className="mt-6">

                        <label className="text-sm font-semibold">

                            Total contado en caja

                        </label>

                        <p className="mb-2 mt-1 text-xs text-neutral-500">

                            Ingresa el efectivo incluyendo el fondo inicial.

                        </p>

                        <input
                            type="number"
                            value={countedCash}
                            onChange={(e) =>
                                setCountedCash(e.target.value)
                            }
                            placeholder={`Ej. ${expectedCash.toLocaleString("es-CO")}`}
                            className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-violet-500"
                        />

                    </div>

                    <div className="mt-5 rounded-xl bg-neutral-100 p-4">

                        <p className="text-sm text-neutral-500">

                            Diferencia

                        </p>

                        {difference === null ? (

                            <p className="mt-2 text-sm text-neutral-500">
                                Ingresa el efectivo para calcular la diferencia.
                            </p>

                        ) : (

                            <h3
                                className={`mt-2 text-3xl font-bold ${differenceColor}`}
                            >
                                ${difference.toLocaleString("es-CO")}
                            </h3>

                        )}

                    </div>

                </div>

                <div className="flex justify-end gap-3 border-t p-5">

                    <GenericButton
                        variant="secondary"
                        label="Cancelar"
                        onClick={onClose}
                    />

                    <GenericButton
                        label="Cerrar Caja"
                        onClick={onConfirm}
                        disabled={!countedCash}
                    />

                </div>

            </div>

        </div>
    );
}