"use client";

import React from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { MenuStructurePrimary } from "@/interfaces";
import { DATA_MENU, collectMenuUrls, getActiveMenuUrl } from "@/utils";
import { useSidebarLayout } from "@/context";
import { ICON_TOKENS } from "@/tokens";
import { cn } from "@/lib/utils";

import SidebarGroup from "./SidebarGroup";
import SidebarNavItem from "./SidebarNavItem";


/** Botón de icono del encabezado: mismo lenguaje que el de la Navbar. */
const headerIconButton =
    "flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-neutral-600 " +
    "transition-colors duration-150 ease-out hover:bg-neutral-100 hover:text-neutral-800 " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-main/30 " +
    "active:scale-95 motion-reduce:transition-none motion-reduce:active:scale-100";

const MENU_URLS = collectMenuUrls(DATA_MENU);


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
                    className="fixed inset-0 z-40 bg-neutral-900/50 md:hidden"
                />
            )}

            <aside
                // Fuera de pantalla en móvil: se saca del orden de tabulación.
                inert={!isDesktop && !isMobileOpen}
                className={cn(
                    "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-neutral-200 bg-white",
                    "transition-[width,transform] duration-200 ease-out motion-reduce:transition-none",
                    isCollapsed ? "md:w-20" : "md:w-64",
                    isMobileOpen ? "translate-x-0" : "-translate-x-full",
                    "md:translate-x-0"
                )}
            >
                {/* ── Encabezado ─────────────────────────────────────────── */}
                <div
                    className={cn(
                        "flex h-16 shrink-0 items-center border-b border-neutral-200",
                        isRail ? "justify-center px-0" : "justify-between px-4"
                    )}
                >
                    <Link
                        href="/"
                        aria-label="Vorea — ir al inicio"
                        className="flex min-w-0 items-center gap-1 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-main/30"
                    >
                        <ICON_TOKENS.FLAME
                            size={28}
                            aria-hidden="true"
                            fill="var(--color-primary-main)"
                            stroke="var(--color-primary-main)"
                        />

                        {!isRail && (
                            <span className="truncate text-sm font-semibold tracking-tight text-neutral-900">
                                Vorea
                            </span>
                        )}
                    </Link>

                    {!isRail && (
                        <div className="flex items-center gap-1">
                            {/* Colapsar (desktop) */}
                            <button
                                type="button"
                                onClick={toggleCollapsed}
                                aria-label="Colapsar menú lateral"
                                className={cn(headerIconButton, "hidden md:flex")}
                            >
                                <ICON_TOKENS.PANEL_RIGHT_OPEN size={16} aria-hidden="true" />
                            </button>

                            {/* Cerrar drawer (móvil) */}
                            <button
                                type="button"
                                onClick={closeMobile}
                                aria-label="Cerrar menú"
                                className={cn(headerIconButton, "md:hidden")}
                            >
                                <ICON_TOKENS.CLOSE size={18} aria-hidden="true" />
                            </button>
                        </div>
                    )}
                </div>

                {/* ── Navegación ─────────────────────────────────────────── */}
                <nav
                    aria-label="Navegación principal"
                    className="flex-1 overflow-y-auto px-3 py-4"
                >
                    <div className="space-y-6">
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
                        className="absolute -right-3 top-5 z-10 hidden h-6 w-6 cursor-pointer items-center justify-center rounded-full border border-neutral-300 bg-white text-neutral-500 shadow-sm transition-colors duration-150 ease-out hover:bg-neutral-100 hover:text-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-main/30 motion-reduce:transition-none md:flex"
                    >
                        <ICON_TOKENS.PANEL_RIGHT_CLOSE size={14} aria-hidden="true" />
                    </button>
                )}
            </aside>
        </>
    );
};
