"use client";

import React from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { MenuStructurePrimary } from "@/interfaces";
import { DATA_MENU, collectMenuUrls, getActiveMenuUrl } from "@/utils";
import { useSidebarLayout } from "@/context";
import { CONTROL_SIZE, ICON_TOKENS } from "@/tokens";
import { cn } from "@/lib/utils";

import SidebarGroup from "./SidebarGroup";
import SidebarNavItem from "./SidebarNavItem";
import {
    sidebarExpandButtonVariants,
    sidebarHeaderActionsVariants,
    sidebarHeaderVariants,
    sidebarIconButtonVariants,
    sidebarLogoVariants,
    sidebarNavVariants,
    sidebarOverlayVariants,
    sidebarSectionsVariants,
    sidebarVariants,
    sidebarWordmarkVariants,
} from "./sidebar.style";


const MENU_URLS = collectMenuUrls(DATA_MENU);

/**
 * Lado del logotipo.
 *
 * No sale de `ICON_SIZE`: es una marca, no un icono de interfaz. La escala de
 * iconos dimensiona glifos que acompañan a un texto, y aquí el glifo ES el
 * texto.
 */
const LOGO_SIZE = 28;


export default function Sidebar() {
    const pathname = usePathname();

    const {
        isCollapsed,
        isRail,
        isDesktop,
        isMobileOpen,
        toggleCollapsed,
        closeMobile,
    } = useSidebarLayout();

    const activeUrl = React.useMemo(
        () => getActiveMenuUrl(pathname, MENU_URLS),
        [pathname]
    );

    // Cierra el drawer móvil al cambiar de ruta
    React.useEffect(() => {
        closeMobile();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname]);

    // Escape cierra el drawer móvil
    React.useEffect(() => {
        if (!isMobileOpen) return;

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") closeMobile();
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isMobileOpen, closeMobile]);

    return (
        <>
            {isMobileOpen && (
                <div
                    onClick={closeMobile}
                    aria-hidden="true"
                    className={sidebarOverlayVariants()}
                />
            )}

            <aside
                // Fuera de pantalla en móvil: se saca del orden de tabulación.
                inert={!isDesktop && !isMobileOpen}
                className={sidebarVariants({
                    collapsed: isCollapsed,
                    open: isMobileOpen,
                })}
            >
                {/* ── Encabezado ─────────────────────────────────────────── */}
                <div className={sidebarHeaderVariants({ rail: isRail })}>
                    <Link
                        href="/"
                        aria-label="Vorea — ir al inicio"
                        className={sidebarLogoVariants()}
                    >
                        <ICON_TOKENS.FLAME
                            size={LOGO_SIZE}
                            aria-hidden="true"
                            fill="var(--color-primary-main)"
                            stroke="var(--color-primary-main)"
                        />

                        {!isRail && (
                            <span className={sidebarWordmarkVariants()}>Vorea</span>
                        )}
                    </Link>

                    {!isRail && (
                        <div className={sidebarHeaderActionsVariants()}>
                            {/* Colapsar (escritorio) */}
                            <button
                                type="button"
                                onClick={toggleCollapsed}
                                aria-label="Colapsar menú lateral"
                                className={cn(sidebarIconButtonVariants(), "hidden md:flex")}
                            >
                                <ICON_TOKENS.PANEL_RIGHT_OPEN
                                    size={CONTROL_SIZE.sm.iconSize}
                                    aria-hidden="true"
                                />
                            </button>

                            {/* Cerrar drawer (móvil) */}
                            <button
                                type="button"
                                onClick={closeMobile}
                                aria-label="Cerrar menú"
                                className={cn(sidebarIconButtonVariants(), "md:hidden")}
                            >
                                <ICON_TOKENS.CLOSE
                                    size={CONTROL_SIZE.sm.iconSize}
                                    aria-hidden="true"
                                />
                            </button>
                        </div>
                    )}
                </div>

                {/* ── Navegación ─────────────────────────────────────────── */}
                <nav
                    aria-label="Navegación principal"
                    className={sidebarNavVariants()}
                >
                    <div className={sidebarSectionsVariants()}>
                        {DATA_MENU.map((section: MenuStructurePrimary, index: number) => (
                            <SidebarGroup
                                key={section.title}
                                label={section.title}
                                showRailSeparator={index > 0}
                            >
                                {section.items.map((item) => (
                                    <SidebarNavItem
                                        key={item.title}
                                        item={item}
                                        activeUrl={activeUrl}
                                    />
                                ))}
                            </SidebarGroup>
                        ))}
                    </div>
                </nav>

                {/* Expandir — mitad afuera del borde, a la altura del logo */}
                {isRail && (
                    <button
                        type="button"
                        onClick={toggleCollapsed}
                        aria-label="Expandir menú lateral"
                        className={sidebarExpandButtonVariants()}
                    >
                        <ICON_TOKENS.PANEL_RIGHT_CLOSE
                            size={CONTROL_SIZE.xs.iconSize}
                            aria-hidden="true"
                        />
                    </button>
                )}
            </aside>
        </>
    );
};
