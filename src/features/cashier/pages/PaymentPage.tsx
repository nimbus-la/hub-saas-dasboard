"use client";

import { useState } from "react";

import type { PaymentMethod } from "../types/payment";

import PaymentHeader from "../components/payment/PaymentHeader";
import PaymentMethods from "../components/payment/PaymentMethods";
import PaymentInformation from "../components/payment/PaymentInformation";
import PaymentSummary from "../components/payment/PaymentSummary";
import { CashierOrder } from "../types/cashier";

interface PaymentPageProps {
    order: CashierOrder;
    onBack: () => void;
    onConfirm: () => void;
}

export default function PaymentPage({
    order,
    onBack,
    onConfirm,
}: PaymentPageProps) {
    const [paymentMethod, setPaymentMethod] =
        useState<PaymentMethod>("cash");

    return (
        <div className="space-y-6">

            <PaymentHeader
                order={order}
                onBack={onBack}
            />

            <div className="grid gap-6 xl:grid-cols-3">

                <div className="space-y-6 xl:col-span-2">

                    <PaymentMethods
                        paymentMethod={paymentMethod}
                        onChange={setPaymentMethod}
                    />

                    <PaymentInformation
                        paymentMethod={paymentMethod}
                        total={order.total}
                    />

                </div>

                <PaymentSummary
                    order={order}
                    onConfirm={onConfirm}
                    onCancel={onBack}
                />

            </div>

        </div>
    );
}