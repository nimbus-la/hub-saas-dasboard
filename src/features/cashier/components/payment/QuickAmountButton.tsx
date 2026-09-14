"use client";

interface QuickAmountButtonProps {
    amount: number;
    onClick: (amount: number) => void;
}

export default function QuickAmountButton({
    amount,
    onClick,
}: QuickAmountButtonProps) {
    return (
        <button
            type="button"
            onClick={() => onClick(amount)}
            className="
                rounded-xl
                border
                border-neutral-200
                bg-white
                px-4
                py-3
                text-sm
                font-semibold
                text-neutral-700
                transition-all
                duration-200
                hover:border-primary
                hover:bg-primary/5
                hover:text-primary
                active:scale-95
            "
        >
            ${amount.toLocaleString("es-CO")}
        </button>
    );
}