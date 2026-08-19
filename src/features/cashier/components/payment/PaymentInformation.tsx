"use client";

import { useEffect, useMemo, useState } from "react";
import {
    Banknote,
    CreditCard,
    Smartphone,
    Landmark,
} from "lucide-react";

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

    // Tarjeta
    const [cardNumber, setCardNumber] = useState("");
    const [cardName, setCardName] = useState("");
    const [cardExpiry, setCardExpiry] = useState("");
    const [cardCvv, setCardCvv] = useState("");

    // Nequi
    const [nequiPhone, setNequiPhone] = useState("");

    // Transferencia
    const [transferReference, setTransferReference] = useState("");
    const [transferBank, setTransferBank] = useState("");

    useEffect(() => {
        setReceived("");
        setCardNumber("");
        setCardName("");
        setCardExpiry("");
        setCardCvv("");
        setNequiPhone("");
        setTransferReference("");
        setTransferBank("");
    }, [paymentMethod]);

    const receivedAmount = Number(received) || 0;

    const change = useMemo(() => {
        if (receivedAmount <= total) return 0;

        return receivedAmount - total;
    }, [receivedAmount, total]);

    // =========================
    // EFECTIVO
    // =========================

    if (paymentMethod === "cash") {
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

    // =========================
    // TARJETAS
    // =========================

    if (paymentMethod === "card") {
        return (
            <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">

                <div className="mb-6 flex items-center gap-3">

                    <div className="rounded-xl bg-blue-100 p-3 text-blue-600">
                        <CreditCard size={24} />
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold">
                            Pago con tarjeta
                        </h2>

                        <p className="text-sm text-neutral-500">
                            Débito o crédito
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
                            Número de tarjeta
                        </label>

                        <input
                            type="text"
                            value={cardNumber}
                            onChange={(e) =>
                                setCardNumber(e.target.value)
                            }
                            placeholder="1234 5678 9012 3456"
                            maxLength={19}
                            className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none transition focus:border-primary"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium">
                            Nombre del titular
                        </label>

                        <input
                            type="text"
                            value={cardName}
                            onChange={(e) =>
                                setCardName(e.target.value)
                            }
                            placeholder="Nombre completo"
                            className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none transition focus:border-primary"
                        />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">

                        <div>
                            <label className="mb-2 block text-sm font-medium">
                                Fecha de vencimiento
                            </label>

                            <input
                                type="text"
                                value={cardExpiry}
                                onChange={(e) =>
                                    setCardExpiry(e.target.value)
                                }
                                placeholder="MM/AA"
                                maxLength={5}
                                className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none transition focus:border-primary"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium">
                                CVV
                            </label>

                            <input
                                type="password"
                                value={cardCvv}
                                onChange={(e) =>
                                    setCardCvv(e.target.value)
                                }
                                placeholder="123"
                                maxLength={4}
                                className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none transition focus:border-primary"
                            />
                        </div>

                    </div>

                </div>

            </div>
        );
    }

    // =========================
    // NEQUI
    // =========================

    if (paymentMethod === "nequi") {
        return (
            <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">

                <div className="mb-6 flex items-center gap-3">

                    <div className="rounded-xl bg-violet-100 p-3 text-violet-600">
                        <Smartphone size={24} />
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold">
                            Pago con Nequi
                        </h2>

                        <p className="text-sm text-neutral-500">
                            Realiza el pago desde tu cuenta Nequi
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
                            Número de celular Nequi
                        </label>

                        <input
                            type="tel"
                            value={nequiPhone}
                            onChange={(e) =>
                                setNequiPhone(e.target.value)
                            }
                            placeholder="3001234567"
                            maxLength={10}
                            className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none transition focus:border-primary"
                        />
                    </div>

                    <div className="rounded-xl bg-violet-50 p-4 text-sm text-violet-700">
                        Confirma el pago desde la aplicación de Nequi.
                    </div>

                </div>

            </div>
        );
    }

    // =========================
    // TRANSFERENCIA
    // =========================

    if (paymentMethod === "bank") {
        return (
            <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">

                <div className="mb-6 flex items-center gap-3">

                    <div className="rounded-xl bg-purple-100 p-3 text-purple-600">
                        <Landmark size={24} />
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold">
                            Transferencia bancaria
                        </h2>

                        <p className="text-sm text-neutral-500">
                            Registra la transferencia realizada
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
                            Banco
                        </label>

                        <select
                            value={transferBank}
                            onChange={(e) =>
                                setTransferBank(e.target.value)
                            }
                            className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none transition focus:border-primary"
                        >
                            <option value="">
                                Selecciona un banco
                            </option>

                            <option value="bancolombia">
                                Bancolombia
                            </option>

                            <option value="davivienda">
                                Davivienda
                            </option>

                            <option value="bbva">
                                BBVA
                            </option>

                            <option value="bogota">
                                Banco de Bogotá
                            </option>

                            <option value="otro">
                                Otro banco
                            </option>
                        </select>
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium">
                            Número de referencia
                        </label>

                        <input
                            type="text"
                            value={transferReference}
                            onChange={(e) =>
                                setTransferReference(e.target.value)
                            }
                            placeholder="Ej. 458921"
                            className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none transition focus:border-primary"
                        />
                    </div>

                    <div className="rounded-xl bg-purple-50 p-4 text-sm text-purple-700">
                        Realiza la transferencia y registra aquí la
                        referencia de la operación.
                    </div>

                </div>

            </div>
        );
    }

    return null;
}