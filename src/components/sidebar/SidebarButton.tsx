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

import { ChevronRight } from "lucide-react";

import { useSidebarLayout } from "@/context";
import type { SidebarButtonProps } from "@/interfaces";
import { cn } from "@/lib/utils";
import { ICON_SIZE, ICON_STROKE } from "@/tokens";

import {
    sidebarButtonBadgeVariants,
    sidebarButtonChevronVariants,
    sidebarButtonIconVariants,
    sidebarButtonIndicatorVariants,
    sidebarButtonLabelVariants,
    sidebarButtonTrailingVariants,
    sidebarButtonVariants,
} from "./sidebar-button.style";


/**
 * Lado del icono del item.
 *
 * Único para todos los escalones, y forma parte de la cadena horizontal: el
 * riel del submenú se coloca a `SIDEBAR.paddingX` + la mitad de este número.
 * Cambiarlo obliga a mover el `ml-5.25` de `sidebar-nav-item.style.ts`.
 */
const ITEM_ICON_SIZE = ICON_SIZE.lg;


export default function SidebarButton({
    label,
    icon: Icon,
    href,
    level = "secondary",
    size = "md",
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

    const hasTrailing = !isRail && (isNew || expandable);

    const content = (
        <>
            {/* ── Indicador de selección (barra izquierda) ─────────────────── */}
            <span
                aria-hidden="true"
                className={sidebarButtonIndicatorVariants({ level })}
            />

            {Icon && (
                <Icon
                    size={ITEM_ICON_SIZE}
                    strokeWidth={ICON_STROKE.regular}
                    aria-hidden="true"
                    className={sidebarButtonIconVariants()}
                />
            )}

            {!isRail && (
                <span className={sidebarButtonLabelVariants()}>{label}</span>
            )}

            {hasTrailing && (
                <span className={sidebarButtonTrailingVariants()}>
                    {isNew && (
                        <span className={sidebarButtonBadgeVariants()}>Nuevo</span>
                    )}

                    {expandable && (
                        <ChevronRight
                            size={ICON_SIZE.sm}
                            strokeWidth={ICON_STROKE.bold}
                            aria-hidden="true"
                            className={sidebarButtonChevronVariants({ expanded })}
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
