"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { MenuStructureItems, MenuStructurePrimary } from "@/types";
import SidebarGroup from "./SidebarGroup";
import { DATA_MENU, getMenuIcon } from "@/utils";
import GenericButton from "../buttons/GenericButton";


export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-neutral-300 bg-white">
            {/* Logo */}
            <div className="flex h-16 items-center gap-3 px-6">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                    </svg>
                </div>

                <span className="text-sm font-semibold tracking-tight text-neutral-900">Mi App</span>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto px-3 py-4">
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
                                                            <GenericButton
                                                                label={item.title}
                                                                selected={isActive}
                                                                startIcon={StartIcon}
                                                                variant="ghost"
                                                                size="medium"
                                                                align="start"
                                                                fullWidth
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
        </aside>
    );
}