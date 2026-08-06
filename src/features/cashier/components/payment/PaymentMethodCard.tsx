"use client";

import type { ReactNode } from "react";
import { Check } from "lucide-react";

interface PaymentMethodCardProps {
    icon: ReactNode;
    title: string;
    description: string;
    selected: boolean;
    onClick: () => void;
    iconBackground: string;
    iconColor: string;
}

export default function PaymentMethodCard({
    icon,
    title,
    description,
    selected,
    onClick,
    iconBackground,
    iconColor,
}: PaymentMethodCardProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`
                relative w-full rounded-2xl border bg-white p-6 text-left
                transition-all duration-200

                ${
                    selected
                        ? "border-primary shadow-lg ring-2 ring-primary/10"
                        : "border-neutral-200 hover:border-primary/40 hover:shadow-md"
                }
            `}
        >
            {selected && (
                <div className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white">
                    <Check size={18} />
                </div>
            )}

            <div
                className={`mb-5 flex h-16 w-16 items-center justify-center rounded-2xl ${iconBackground} ${iconColor}`}
            >
                {icon}
            </div>

            <h3 className="text-lg font-semibold text-neutral-900">
                {title}
            </h3>

            <p className="mt-1 text-sm text-neutral-500">
                {description}
            </p>
        </button>
    );
}