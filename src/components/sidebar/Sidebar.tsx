"use client";
import React from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { MenuStructureItems, MenuStructurePrimary } from "@/interfaces";
import SidebarGroup from "./SidebarGroup";
import { DATA_MENU, getMenuIcon } from "@/utils";
import SidebarButton from "./SidebarButton";
import { useSidebarLayout } from "@/context";
import { ICON_TOKENS } from "@/tokens";


export default function Sidebar() {
    const pathname = usePathname();

    const { isCollapsed, isMobileOpen, toggleCollapsed, closeMobile } = useSidebarLayout();

    // Cierra el drawer móvil al cambiar de ruta
    React.useEffect(() => {
        closeMobile();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname]);

    return (
        <>
            {isMobileOpen && (
                <div
                    onClick={closeMobile}
                    className="fixed inset-0 z-40 bg-neutral-900/40 md:hidden"
                />
            )}

            <aside className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-neutral-200 bg-white transition-all duration-200 ${isCollapsed ? "md:w-20" : "md:w-64"} ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}>
                {/* Logo */}
                <div className="flex h-16 items-center justify-between border-b border-neutral-200 px-4">
                    <div className="flex items-center gap-1">
                        <ICON_TOKENS.FLAME size={28} fontWeight={4} fill="var(--color-primary-main)" stroke="var(--color-primary-main)" />

                        {!isCollapsed && (
                            <span className="truncate text-sm font-semibold tracking-tight text-neutral-900">Vorea</span>
                        )}
                    </div>

                    {!isCollapsed && (
                        <ICON_TOKENS.PANEL_RIGHT_OPEN
                            onClick={toggleCollapsed}
                            size={14}
                            className="text-neutral-600 cursor-pointer transition-colors duration-150 ease-out hover:text-neutral-800"
                        />
                    )}
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto py-4">
                    <ul className="space-y-4">
                        {DATA_MENU.map((section: MenuStructurePrimary, index: number) => {

                            return (
                                <div key={index}>
                                    {/* Section title — dropdown trigger */}
                                    <SidebarGroup label={section.title}>
                                        {
                                            section.items.map(
                                                (item: MenuStructureItems, index: number) => {
                                                    const isActive = pathname === item.url;
                                                    const StartIcon = getMenuIcon(item.icon);

                                                    return (
                                                        <li key={index}>
                                                            <Link href={item.url}>
                                                                <SidebarButton
                                                                    icon={StartIcon}
                                                                    label={item.title}
                                                                    selected={isActive}
                                                                    size="medium"
                                                                />
                                                            </Link>
                                                        </li>
                                                    );
                                                }
                                            )
                                        }
                                    </SidebarGroup>
                                </div>
                            )
                        })}
                    </ul>
                </nav>

                {/* Flecha de colapso — mitad afuera del borde, junto al título */}
                {isCollapsed && (
                    <button
                        onClick={toggleCollapsed}
                        aria-label="Expandir sidebar"
                        className="absolute -right-3 top-5 z-10 hidden h-6 w-6 items-center justify-center cursor-pointer rounded-full border border-neutral-300 bg-white text-neutral-500 shadow-sm transition-colors hover:bg-neutral-100 hover:text-neutral-800 md:flex"
                    >
                        <ICON_TOKENS.PANEL_RIGHT_CLOSE size={14} />
                    </button>
                )}
            </aside>
        </>
    );
}