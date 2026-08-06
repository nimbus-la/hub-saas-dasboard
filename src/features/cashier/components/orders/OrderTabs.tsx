"use client";

export type OrderTab = "all" | "pending" | "paid";

interface OrderTabsProps {
    value: OrderTab;
    onValueChange: (value: OrderTab) => void;
}

const tabs: {
    label: string;
    value: OrderTab;
}[] = [
        {
            label: "Todas",
            value: "all",
        },
        {
            label: "Pendientes",
            value: "pending",
        },
        {
            label: "Pagadas",
            value: "paid",
        },
    ];

export default function OrderTabs({
    value,
    onValueChange,
}: OrderTabsProps) {
    return (
        <div className="flex w-fit items-center gap-2 rounded-xl border border-neutral-200 bg-white p-1">

            {tabs.map((tab) => {
                const active = value === tab.value;

                return (
                    <button
                        key={tab.value}
                        type="button"
                        onClick={() => onValueChange(tab.value)}
                        className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${active
                            ? "bg-primary text-white"
                            : "text-neutral-600 hover:bg-neutral-100"
                            }`}
                    >
                        {tab.label}
                    </button>
                );
            })}

        </div>
    );
}