import { cva } from "class-variance-authority";

export const statusBadgeVariants = cva(
    [
        "inline-flex max-w-full items-center justify-center",
        "truncate rounded-md px-2 py-0.5",
        "text-xs font-semibold whitespace-nowrap",
    ],
    {
        variants: {
            // ── Tono semántico (token del design system) ─────────────────
            tone: {
                success: "bg-success-lighter text-success-dark",
                warning: "bg-warning-lighter text-warning-dark",
                error: "bg-error-lighter text-error-dark",
                info: "bg-info-lighter text-info-dark",
                primary: "bg-primary-lighter text-primary-dark",
                neutral: "bg-neutral-200 text-neutral-700",
            },
        },
        defaultVariants: { tone: "neutral" },
    }
);