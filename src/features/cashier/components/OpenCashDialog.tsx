"use client";

import { useState } from "react";
import { Wallet } from "lucide-react";

import GenericButton from "@/components/buttons/GenericButton";

interface OpenCashDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (amount: number) => void;
}

export default function OpenCashDialog({
    isOpen,
    onClose,
    onConfirm,
}: OpenCashDialogProps) {
    const [amount, setAmount] = useState("");

    if (!isOpen) return null;

    const handleConfirm = () => {
        const value = Number(amount);

        if (!value || value <= 0) return;

        onConfirm(value);
        setAmount("");
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">

            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">

                <div className="mb-6 flex items-center gap-3">

                    <div className="rounded-xl bg-violet-100 p-3">

                        <Wallet
                            size={22}
                            className="text-violet-600"
                        />

                    </div>

                    <div>

                        <h2 className="text-xl font-semibold">
                            Apertura de Caja
                        </h2>

                        <p className="text-sm text-neutral-500">
                            Ingresa el monto inicial de tu turno.
                        </p>

                    </div>

                </div>

                <div className="space-y-2">

                    <label className="text-sm font-medium">
                        Monto inicial
                    </label>

                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="Ej: 200000"
                        className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-violet-500"
                    />

                </div>

                <div className="mt-8 flex justify-end gap-3">

                    <GenericButton
                        variant="secondary"
                        label="Cancelar"
                        onClick={onClose}
                    />

                    <GenericButton
                        label="Abrir Caja"
                        onClick={handleConfirm}
                    />

                </div>

            </div>

        </div>
    );
}