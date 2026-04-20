"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { MenuStructureItems, MenuStructurePrimary } from "@/types";
import SidebarGroup from "./SidebarGroup";
import { DATA_MENU } from "@/utils";


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

                                                return (
                                                    <li key={index}>
                                                        <Link
                                                            href={item.url}
                                                            className={`relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${isActive
                                                                ? "bg-primary-main/10 text-primary-light"
                                                                : "text-slate-400 hover:bg-slate-800 hover:text-slate-100"
                                                                }`}
                                                        >
                                                            <span className={isActive ? "text-primary-light" : "text-slate-500"}>
                                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                    <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
                                                                    <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
                                                                </svg>
                                                            </span>

                                                            {item.title}
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