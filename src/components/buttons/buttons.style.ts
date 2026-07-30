import { cva } from "class-variance-authority";

export const linkButtonVariants = cva(
    // ── Base — sólo texto: ni fondo ni borde ──────────────────────────────────
    [
        "group inline-flex w-fit shrink-0 cursor-pointer items-center gap-1.5",
        "rounded-sm bg-transparent font-semibold text-primary-main",
        "transition-colors duration-150",
        "hover:text-primary-dark",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-main",
        // ── Deshabilitado ─────────────────────────────────────────────────
        "disabled:cursor-not-allowed disabled:text-neutral-400",
    ],
    {
        variants: {
            // ── Tamaño (el ícono se escala en paralelo, ver ICON_SIZE) ────
            size: {
                large: "text-[16px] leading-5",
                medium: "text-[14px] leading-5",
                small: "text-[12px] leading-4",
            },
        },
        defaultVariants: { size: "medium" },
    }
);