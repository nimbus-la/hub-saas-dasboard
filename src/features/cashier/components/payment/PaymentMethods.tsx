"use client";

import {
    Banknote,
    CreditCard,
    Landmark,
    Smartphone,
} from "lucide-react";

import PaymentMethodCard from "./PaymentMethodCard";
import {
    PaymentMethod,
    PaymentMethodItem,
} from "../../types/payment";

interface PaymentMethodsProps {
    paymentMethod: PaymentMethod;
    onChange: (method: PaymentMethod) => void;
}

const PAYMENT_METHODS: PaymentMethodItem[] = [
    {
        id: "cash",
        title: "Efectivo",
        description: "Pago en caja",
    },
    {
        id: "card",
        title: "Tarjetas",
        description: "Débito o Crédito",
    },
    {
        id: "nequi",
        title: "Nequi",
        description: "Transferencia móvil",
    },
    {
        id: "bank",
        title: "Transferencia",
        description: "Bancaria",
    },
];

export default function PaymentMethods({
    paymentMethod,
    onChange,
}: PaymentMethodsProps) {



    const getIcon = (method: PaymentMethod) => {
        switch (method) {
            case "cash":
                return <Banknote size={34} />;

            case "card":
                return <CreditCard size={34} />;

            case "nequi":
                return <Smartphone size={34} />;

            case "bank":
                return <Landmark size={34} />;
        }
    };

    const getBackground = (method: PaymentMethod) => {
        switch (method) {
            case "cash":
                return "bg-green-100";

            case "card":
                return "bg-blue-100";

            case "nequi":
                return "bg-violet-100";

            case "bank":
                return "bg-purple-100";
        }
    };

    const getColor = (method: PaymentMethod) => {
        switch (method) {
            case "cash":
                return "text-green-600";

            case "card":
                return "text-blue-600";

            case "nequi":
                return "text-violet-600";

            case "bank":
                return "text-purple-600";
        }
    };

    return (
        <div className="rounded-2xl border border-neutral-200 bg-white p-6">
            <h2 className="mb-6 text-xl font-semibold">
                Selecciona el medio de pago
            </h2>

            <div className="grid gap-5 md:grid-cols-2">
                {PAYMENT_METHODS.map((method) => (
                    <PaymentMethodCard
                        key={method.id}
                        title={method.title}
                        description={method.description}
                        icon={getIcon(method.id)}
                        selected={paymentMethod === method.id}
                        onClick={() => onChange(method.id)}
                        iconBackground={getBackground(
                            method.id,
                        )}
                        iconColor={getColor(method.id)}
                    />
                ))}
            </div>
        </div>
    );
}