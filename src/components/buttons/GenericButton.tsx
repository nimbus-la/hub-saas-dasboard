import React from "react";

import { LucideIcon } from "lucide-react";
import { cva, VariantProps } from "class-variance-authority";


const buttonVariants = cva(
    // Base — clases compartidas por todas las variantes
    // ── Base ──────────────────────────────────────────────────────────────────
    [
        "inline-flex cursor-pointer select-none items-center justify-center gap-[10px]",
        "rounded-[10px] font-medium transition-colors duration-150",
        "focus-visible:outline-none",
        "disabled:cursor-not-allowed",
    ],
    {
        variants: {
            // ── Estilo ──────────────────────────────────────────────────────
            variant: {
                primary: [
                    "bg-primary-main text-white",
                    "hover:bg-primary-dark",
                    "focus-visible:ring-3 focus-visible:ring-primary-light",
                    "data-[selected=true]:bg-primary-main",
                    "disabled:bg-neutral-400 disabled:text-white",
                ],
                secondary: [
                    "bg-white text-neutral-500",
                    "hover:bg-neutral-200",
                    "focus-visible:ring-3 focus-visible:ring-neutral-200",
                    "data-[selected=true]:bg-primary-main/10 data-[selected=true]:text-primary-main",
                    "disabled:bg-white disabled:text-neutral-300",
                ],
                ghost: [
                    "bg-transparent text-neutral-600",
                    "hover:bg-neutral-200",
                    "focus-visible:ring-3 focus-visible:ring-neutral-200",

                    // ── selected ──────────────────────────────────────────────────
                    "data-[selected=true]:bg-primary-main/10",
                    "data-[selected=true]:text-primary-main",
                    "data-[selected=true]:font-semibold",

                    // ── selected + hover ──────────────────────────────────────────
                    "data-[selected=true]:hover:bg-primary-main/20",
                    "disabled:bg-white disabled:text-neutral-300",
                ],
            },

            // ── Tamaño — icon and text ──────────────────────────────────────
            size: {
                large: "h-[44px] px-4 py-3 text-[16px] leading-5",
                medium: "h-[40px] px-4 py-3 text-[14px] leading-5",
                small: "h-[32px] px-4 py-3 text-[12px] leading-5",
            },

            align: {
                start: "justify-start",
                center: "justify-center",
                end: "justify-end",
            },

            // ── Modo icono solo (cuadrado) ──────────────────────────────────
            iconOnly: {
                true: "",
                false: "",
            },

            // ── Ancho completo ──────────────────────────────────────────────
            fullWidth: {
                true: "w-full",
                false: "w-auto",
            },
        },

        // ── Combinaciones especiales (icon only → cuadrado) ─────────────────
        compoundVariants: [
            { iconOnly: true, size: "large", class: "size-[44px] p-3" },
            { iconOnly: true, size: "medium", class: "size-[40px] p-3" },
            { iconOnly: true, size: "small", class: "size-[32px] p-3" },
        ],

        defaultVariants: {
            variant: "primary",
            size: "medium",
            align: "center",
            iconOnly: false,
            fullWidth: false,
        },
    }
)

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
    label?: string;
    icon?: LucideIcon;
    startIcon?: LucideIcon;
    endIcon?: LucideIcon;
    selected?: boolean;
};

// Deriva el tipo directamente de las props — se actualiza solo si cambias las variantes
type ButtonSize = NonNullable<ButtonProps["size"]>;

// ─── Tamaño de icono según el size del botón ──────────────────────────────────

const ICON_SIZE: Record<ButtonSize, number> = {
    large: 18,
    medium: 18,
    small: 15,
};


export default function GenericButton({
    label,
    variant,
    size = "medium",
    align,
    iconOnly,
    fullWidth,
    startIcon: StartIcon,
    endIcon: EndIcon,
    icon: IconComponent,
    selected = false,
    disabled = false,
    className,
    ...props
}: ButtonProps) {
    const isIconOnly = iconOnly ?? (!label && !!IconComponent);
    const iconSize = ICON_SIZE[size ?? "medium"];

    return (
        <button
            disabled={disabled}
            data-selected={selected}
            className={buttonVariants({ variant, size, align, iconOnly, fullWidth, className })}
            {...props}
        >
            {isIconOnly && IconComponent && (
                <IconComponent size={iconSize} strokeWidth={2} />
            )}


            {/* ── Modo icono + texto ───────────────────────────────────── */}
            {!isIconOnly && (
                <>
                    {StartIcon && (
                        <StartIcon size={iconSize} strokeWidth={2} />
                    )}

                    {label}

                    {EndIcon && (
                        <EndIcon size={iconSize} strokeWidth={2} />
                    )}
                </>
            )}
        </button>
    );
};