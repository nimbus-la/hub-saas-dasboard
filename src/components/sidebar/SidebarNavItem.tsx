"use client";

// ── Item de segundo nivel del Sidebar ───────────────────────────────────────
// Sin `items` → enlace directo a su página.
// Con `items` → acordeón: chevron que indica que agrupa más menús y una lista
// de páginas (tercer nivel) colgada de un riel vertical alineado con el icono.

import React from "react";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import type { SidebarNavItemProps } from "@/interfaces";
import { getMenuIcon } from "@/utils";
import { useSidebarLayout } from "@/context";
import { DURATION } from "@/tokens";

import SidebarButton from "./SidebarButton";
import {
    sidebarSubmenuVariants,
    sidebarSubmenuWrapperVariants,
} from "./sidebar-nav-item.style";


/** framer-motion pide segundos; los tokens guardan milisegundos. */
const seconds = (ms: number) => ms / 1000;


export default function SidebarNavItem({ item, activeUrl }: SidebarNavItemProps) {
    const { isRail, expandSidebar } = useSidebarLayout();
    const prefersReducedMotion = useReducedMotion();

    const submenuId = React.useId();
    const Icon = getMenuIcon(item.icon);

    const subItems = item.items ?? [];
    const hasSubItems = subItems.length > 0;

    const isSelected = item.url !== undefined && item.url === activeUrl;
    const hasActiveSubItem = subItems.some((subItem) => subItem.url === activeUrl);

    // El estado por defecto lo dicta la ruta: si la página activa cuelga de este
    // item, el acordeón aparece abierto. El usuario puede sobreescribirlo, y esa
    // decisión sólo caduca cuando la ruta entra o sale de este item — así no
    // hace falta un efecto que sincronice estado con la navegación.
    const [manualState, setManualState] = React.useState<{ open: boolean; forActive: boolean } | null>(null);

    const isOpen =
        manualState !== null && manualState.forActive === hasActiveSubItem
            ? manualState.open
            : hasActiveSubItem;

    const setOpen = (open: boolean) => setManualState({ open, forActive: hasActiveSubItem });

    // ── Item simple ──────────────────────────────────────────────────────────
    if (!hasSubItems) {
        return (
            <li>
                <SidebarButton
                    href={item.url}
                    icon={Icon}
                    label={item.title}
                    selected={isSelected}
                    disabled={!item.active}
                />
            </li>
        );
    };

    // En modo riel no hay sitio para el submenú: pulsar el padre despliega el
    // sidebar y deja el acordeón abierto, en vez de dejar el item sin efecto.
    const handleToggle = () => {
        if (isRail) {
            expandSidebar();
            setOpen(true);
            return;
        };

        setOpen(!isOpen);
    };

    return (
        <li>
            <SidebarButton
                icon={Icon}
                label={item.title}
                expandable={!isRail}
                expanded={isOpen && !isRail}
                // En modo riel el submenú no se ve: el propio item toma el
                // estado activo para no perder el "estás aquí".
                selected={isRail && hasActiveSubItem}
                highlighted={!isRail && hasActiveSubItem}
                disabled={!item.active}
                onClick={handleToggle}
                {...(isRail ? {} : { "aria-controls": submenuId })}
            />

            <AnimatePresence initial={false}>
                {isOpen && !isRail && (
                    <motion.div
                        id={submenuId}
                        key="submenu"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={
                            prefersReducedMotion
                                ? { duration: 0 }
                                : { duration: seconds(DURATION.normal), ease: [0.16, 1, 0.3, 1] }
                        }
                        className={sidebarSubmenuWrapperVariants()}
                    >
                        <ul className={sidebarSubmenuVariants()}>
                            {subItems.map((subItem) => (
                                <li key={subItem.url}>
                                    <SidebarButton
                                        href={subItem.url}
                                        label={subItem.title}
                                        level="tertiary"
                                        size="sm"
                                        selected={subItem.url === activeUrl}
                                        disabled={!subItem.active}
                                    />
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>
        </li>
    );
};
