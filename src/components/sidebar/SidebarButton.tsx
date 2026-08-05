"use client";

// ── Botón de navegación exclusivo para el Sidebar ───────────────────────────
// Renderiza un <Link> cuando recibe `href` y un <button> cuando actúa como
// disparador de acordeón (`expandable`) — nunca uno dentro del otro.
//
// Dos niveles jerárquicos:
//   • secondary → item con icono (segundo nivel del menú).
//   • tertiary  → sub-item de sólo texto, colgado del riel vertical del padre.
//
// Estados: default, hover, selected, highlighted (padre con hijo activo)
// y disabled. "selected" añade un indicador vertical en color primary.

import Link from "next/link";

import { cva, VariantProps } from "class-variance-authority";
import { ChevronRight, LucideIcon } from "lucide-react";

import { useSidebarLayout } from "@/context";
import { cn } from "@/lib/utils";


const sidebarButtonVariants = cva(
    // ── Base ──────────────────────────────────────────────────────────────────
    [
        "group relative flex w-full cursor-pointer select-none items-center gap-3",
        "rounded-lg px-3 font-medium",
        "transition-colors duration-150 ease-out motion-reduce:transition-none",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-main/30",

        // ── hover ─────────────────────────────────────────────────────────
        "hover:bg-neutral-200 hover:text-neutral-800",

        // ── selected ──────────────────────────────────────────────────────
        "data-[selected=true]:bg-primary-main/10",
        "data-[selected=true]:text-primary-main",
        "data-[selected=true]:font-semibold",
        "data-[selected=true]:hover:bg-primary-main/15",
        "data-[selected=true]:hover:text-primary-main",

        // ── highlighted: padre colapsado con una página hija activa ───────
        "data-[highlighted=true]:text-neutral-900",
        "data-[highlighted=true]:font-semibold",

        // ── disabled ──────────────────────────────────────────────────────
        "disabled:pointer-events-none disabled:bg-transparent disabled:text-neutral-400",
        "aria-disabled:pointer-events-none aria-disabled:bg-transparent aria-disabled:text-neutral-400",
    ],
    {
        variants: {
            // ── Nivel jerárquico ──────────────────────────────────────────
            level: {
                secondary: "text-neutral-700",
                tertiary: "text-neutral-600",
            },

            // ── Tamaño ────────────────────────────────────────────────────
            size: {
                large: "h-11 text-[16px] leading-5",
                medium: "h-10 text-[14px] leading-5",
                small: "h-9 text-[13px] leading-5",
            },

            // ── Modo riel (sidebar colapsado en desktop) ──────────────────
            rail: {
                true: "justify-center px-0",
                false: "",
            },
        },

        defaultVariants: { level: "secondary", size: "medium", rail: false },
    }
);

type SidebarButtonLevel = NonNullable<VariantProps<typeof sidebarButtonVariants>["level"]>;
type SidebarButtonSize = NonNullable<VariantProps<typeof sidebarButtonVariants>["size"]>;

interface SidebarButtonProps {
    label: string;
    icon?: LucideIcon | undefined;
    /** Presente → se renderiza como <Link>. Ausente → como <button>. */
    href?: string | undefined;
    level?: SidebarButtonLevel | undefined;
    size?: SidebarButtonSize | undefined;
    /** La ruta de este item es la ruta actual. */
    selected?: boolean | undefined;
    /** Alguna de sus páginas hijas es la ruta actual. */
    highlighted?: boolean | undefined;
    /** Muestra el chevron que indica que el item agrupa más menús. */
    expandable?: boolean | undefined;
    expanded?: boolean | undefined;
    disabled?: boolean | undefined;
    isNew?: boolean | undefined;
    onClick?: (() => void) | undefined;
    className?: string | undefined;
    "aria-controls"?: string | undefined;
};

// ─── Tamaño de icono según el size del botón ──────────────────────────────────
const ICON_SIZE: Record<SidebarButtonSize, number> = {
    large: 18,
    medium: 18,
    small: 15,
};

// ─── Indicador de selección ───────────────────────────────────────────────────
// El offset negativo lo saca de la píldora: en `secondary` aterriza en el borde
// del sidebar; en `tertiary` justo sobre el riel que dibuja SidebarNavItem
// (ml-[21px] + border-l + pl-[14px] → 15px a la izquierda del sub-item).
const INDICATOR_BASE =
    "pointer-events-none absolute top-1/2 -translate-y-1/2 bg-primary-main opacity-0 " +
    "transition-opacity duration-150 ease-out motion-reduce:transition-none " +
    "group-data-[selected=true]:opacity-100";

const INDICATOR_BY_LEVEL: Record<SidebarButtonLevel, string> = {
    secondary: "-left-3 h-5 w-[3px] rounded-r-full",
    tertiary: "-left-[15px] h-8 w-[1.4px] rounded-full",
};


export default function SidebarButton({
    label,
    icon: Icon,
    href,
    level = "secondary",
    size = "medium",
    selected = false,
    highlighted = false,
    expandable = false,
    expanded = false,
    disabled = false,
    isNew = false,
    onClick,
    className,
    "aria-controls": ariaControls,
}: SidebarButtonProps) {
    const { isRail } = useSidebarLayout();

    const iconSize = ICON_SIZE[size];
    const hasTrailing = !isRail && (isNew || expandable);

    const content = (
        <>
            {/* ── Indicador de selección (barra izquierda) ─────────────────── */}
            <span aria-hidden="true" className={cn(INDICATOR_BASE, INDICATOR_BY_LEVEL[level])} />

            {Icon && <Icon size={iconSize} strokeWidth={2} aria-hidden="true" className="shrink-0" />}

            {!isRail && <span className="truncate">{label}</span>}

            {hasTrailing && (
                <span className="ml-auto flex shrink-0 items-center gap-2">
                    {isNew && (
                        <span className="inline-flex items-center rounded-full bg-primary-main px-2 py-1 text-[10px] font-semibold leading-none text-white">
                            Nuevo
                        </span>
                    )}

                    {expandable && (
                        <ChevronRight
                            size={14}
                            strokeWidth={2.5}
                            aria-hidden="true"
                            className={cn(
                                "text-current opacity-60 transition-[transform,opacity] duration-200",
                                "group-hover:opacity-100",
                                expanded ? "rotate-90" : "rotate-0"
                            )}
                        />
                    )}
                </span>
            )}
        </>
    );

    const sharedProps = {
        className: cn(sidebarButtonVariants({ level, size, rail: isRail }), className),
        "data-selected": selected,
        "data-highlighted": highlighted,
        // En modo riel el label desaparece: se conserva como tooltip nativo y
        // como nombre accesible del control.
        title: isRail ? label : undefined,
        "aria-label": isRail ? label : undefined,
    };

    if (href) {
        return (
            <Link
                href={href}
                {...(onClick ? { onClick } : {})}
                aria-current={selected ? "page" : undefined}
                aria-disabled={disabled || undefined}
                tabIndex={disabled ? -1 : undefined}
                {...sharedProps}
            >
                {content}
            </Link>
        );
    };

    return (
        <button
            type="button"
            disabled={disabled}
            onClick={onClick}
            aria-expanded={expandable ? expanded : undefined}
            aria-controls={ariaControls}
            {...sharedProps}
        >
            {content}
        </button>
    );
};
