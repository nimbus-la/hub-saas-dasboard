"use client";

import { ReactNode } from "react";

interface CashSummaryCardProps {
    icon: ReactNode;
    title: string;
    value: string;
    subtitle?: string;
}

export default function CashSummaryCard({
    icon,
    title,
    value,
    subtitle,
}: CashSummaryCardProps) {
    return (
        <div className="rounded-2xl border border-neutral-200 bg-white p-5 transition-all hover:shadow-md">

            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
                {icon}
            </div>

            <p className="text-sm text-neutral-500">
                {title}
            </p>

            <h3 className="mt-2 text-3xl font-bold text-neutral-900">
                {value}
            </h3>

            {subtitle && (
                <p className="mt-2 text-xs text-neutral-400">
                    {subtitle}
                </p>
            )}

        </div>
    );
}