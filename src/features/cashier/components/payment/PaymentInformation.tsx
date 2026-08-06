"use client";

import { useEffect, useMemo, useState } from "react";
import { Banknote } from "lucide-react";
import QuickAmountButton from "./QuickAmountButton";
import type { PaymentMethod } from "../../types/payment";

interface PaymentInformationProps {
    paymentMethod: PaymentMethod;
    total: number;
}

const QUICK_AMOUNTS = [
    20000,
    50000,
    100000,
    200000,
];

export default function PaymentInformation({
    paymentMethod,
    total,
}: PaymentInformationProps) {

    const [received, setReceived] = useState("");

    useEffect(() => {
        setReceived("");
    }, [paymentMethod]);

    const receivedAmount = Number(received) || 0;

    const change = useMemo(() => {
        if (receivedAmount <= total) return 0;

        return receivedAmount - total;
    }, [receivedAmount, total]);

    if (paymentMethod !== "cash") {
        return (
            <div className="rounded-2xl border border-neutral-200 bg-white p-6">
                <h2 className="text-xl font-semibold">
                    Información del pago
                </h2>

                <p className="mt-6 text-neutral-500">
                    Este formulario se implementará para{" "}
                    <strong>{paymentMethod}</strong>.
                </p>
            </div>
        );
    }

    return (
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">

            <div className="mb-6 flex items-center gap-3">

                <div className="rounded-xl bg-green-100 p-3 text-green-600">
                    <Banknote size={24} />
                </div>

                <div>
                    <h2 className="text-xl font-semibold">
                        Pago en efectivo
                    </h2>

                    <p className="text-sm text-neutral-500">
                        Ingresa el dinero recibido
                    </p>
                </div>

            </div>

            <div className="space-y-5">

                <div>
                    <label className="mb-2 block text-sm font-medium">
                        Total a pagar
                    </label>

                    <div className="rounded-xl border bg-neutral-100 px-4 py-3 text-xl font-bold">
                        $
                        {total.toLocaleString("es-CO")}
                    </div>
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium">
                        Dinero recibido
                    </label>

                    <input
                        type="number"
                        value={received}
                        onChange={(e) =>
                            setReceived(e.target.value)
                        }
                        placeholder="0"
                        className="
                            w-full rounded-xl border
                            border-neutral-300
                            px-4 py-3
                            outline-none
                            transition
                            focus:border-primary
                        "
                    />
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium">
                        Cambio
                    </label>

                    <div className="rounded-xl bg-success-lighter px-4 py-4 text-2xl font-bold text-success-main">
                        $
                        {change.toLocaleString("es-CO")}
                    </div>
                </div>

                <div>

                    <p className="mb-3 text-sm font-medium">
                        Montos rápidos
                    </p>

                    <div className="grid grid-cols-2 gap-3">
                        {QUICK_AMOUNTS.map((amount) => (
                            <QuickAmountButton
                                key={amount}
                                amount={amount}
                                onClick={(value) =>
                                    setReceived(String(value))
                                }
                            />
                        ))}
                    </div>

                </div>

            </div>

        </div>
    );
}