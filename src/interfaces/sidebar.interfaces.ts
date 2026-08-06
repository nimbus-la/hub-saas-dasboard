import type { ReactNode } from "react";

import type { VariantProps } from "class-variance-authority";
import type { LucideIcon } from "lucide-react";

import { sidebarButtonVariants } from "@/components";
import type { MenuStructureItems } from "./menu.types";


/* ── SidebarButton ─────────────────────────────────────────────────────────── */

/** Nivel jerárquico: item con icono o sub-item de solo texto. */
export type SidebarButtonLevel = NonNullable<
    VariantProps<typeof sidebarButtonVariants>["level"]
>;

/**
 * Escalón del item. Los tres del sistema que caben en un menú lateral: `md`
 * (40px) es el de `SIDEBAR.itemHeight` y el que usan los items de segundo
 * nivel; `sm` queda para los sub-items del acordeón.
 */
export type SidebarButtonSize = NonNullable<
    VariantProps<typeof sidebarButtonVariants>["size"]
>;


export interface SidebarButtonProps {
    label: string;
    icon?: LucideIcon | undefined;
    /** Presente → se renderiza como `<Link>`. Ausente → como `<button>`. */
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


/* ── SidebarNavItem ────────────────────────────────────────────────────────── */

export interface SidebarNavItemProps {
    item: MenuStructureItems;
    /** Url del menú que corresponde a la ruta actual (la más específica). */
    activeUrl: string | null;
};


/* ── SidebarGroup ──────────────────────────────────────────────────────────── */

export interface SidebarGroupProps {
    label: string;
    /** En modo riel sustituye el título por un separador (salvo la 1ª sección). */
    showRailSeparator?: boolean;
    children: ReactNode;
};
