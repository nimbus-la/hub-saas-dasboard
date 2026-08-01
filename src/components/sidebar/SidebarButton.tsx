// ── Botón de navegación exclusivo para el Sidebar ───────────────────────────
// Soporta icono (lucide-react) + label y los estados: default, hover,
// selected y disabled. El estado "selected" añade un indicador vertical a

import { useSidebarLayout } from "@/context";
import { cva, VariantProps } from "class-variance-authority";
import { LucideIcon } from "lucide-react";

// la izquierda además del fondo/texto en color primary.
const sidebarButtonVariants = cva(
    // ── Base ──────────────────────────────────────────────────────────────────
    [
        "group relative inline-flex w-full cursor-pointer select-none items-center gap-3",
        "px-6 font-medium transition-colors duration-150",
        "text-neutral-600",
        "focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-neutral-200",

        // ── hover ─────────────────────────────────────────────────────────
        "hover:bg-neutral-200",

        // ── selected ──────────────────────────────────────────────────────
        "data-[selected=true]:bg-primary-main/10",
        "data-[selected=true]:text-primary-main",
        "data-[selected=true]:font-semibold",

        // ── selected + hover ─────────────────────────────────────────────
        "data-[selected=true]:hover:bg-primary-main/20",

        // ── disabled ──────────────────────────────────────────────────────
        "disabled:pointer-events-none disabled:cursor-not-allowed",
        "disabled:bg-transparent disabled:text-neutral-300",
        "disabled:data-[selected=true]:bg-neutral-100 disabled:data-[selected=true]:text-neutral-300",
    ],
    {
        variants: {
            // ── Tamaño ────────────────────────────────────────────────────
            size: {
                large: "h-[44px] text-[16px] leading-5",
                medium: "h-[40px] text-[14px] leading-5",
                small: "h-[32px] text-[12px] leading-5",
            },
            collapsed: {
                true: "justify-center px-0",
                false: "px-6",
            },
        },

        defaultVariants: { size: "medium", collapsed: false },
    }
);

interface SidebarButtonProps
    extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onClick">,
    Omit<VariantProps<typeof sidebarButtonVariants>, "collapsed"> {
    icon?: LucideIcon;
    label: string;
    selected?: boolean;
    isNew?: boolean;
    onClick?: () => void;
};

// Deriva el tipo directamente de las props — se actualiza solo si cambias las variantes
type SidebarButtonSize = NonNullable<SidebarButtonProps["size"]>;

// ─── Tamaño de icono según el size del botón ──────────────────────────────────
const ICON_SIZE: Record<SidebarButtonSize, number> = {
    large: 18,
    medium: 18,
    small: 15,
};


export default function SidebarButton({
    icon: Icon,
    label,
    size = "medium",
    disabled = false,
    selected = false,
    isNew = false,
    onClick,
    className,
    ...props
}: SidebarButtonProps) {
    const { isCollapsed } = useSidebarLayout();
    const iconSize = ICON_SIZE[size ?? "medium"];

    return (
        <button
            type="button"
            disabled={disabled}
            data-selected={selected}
            onClick={onClick}
            className={sidebarButtonVariants({ size, collapsed: isCollapsed, className })}
            {...props}
        >
            {/* ── Indicador de selección (barra izquierda) ─────────────────── */}
            <span
                aria-hidden="true"
                className="pointer-events-none absolute left-0 top-1/2 h-full w-[2px] -translate-y-1/2 rounded-full bg-primary-main opacity-0 transition-opacity duration-150 group-data-[selected=true]:opacity-100"
            />

            {Icon && <Icon size={iconSize} strokeWidth={2} className="shrink-0" />}

            {!isCollapsed && <span className="truncate">{label}</span>}

            {!isCollapsed && isNew && (
                <span className="ml-auto inline-flex shrink-0 items-center rounded-full bg-primary-main px-2 py-1 text-[10px] font-semibold leading-none text-white">
                    Nuevo
                </span>
            )}
        </button>
    );
};