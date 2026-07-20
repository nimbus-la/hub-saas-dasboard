"use client";

import { useSidebarLayout } from "@/context";
import { MapPin, Menu } from "lucide-react";
import { InputSelector } from "./inputs/InputSelector";

interface NavbarProps {
    title?: string;
}

const sucursales = [
    { label: "Cocina Central", value: "cc" },
    { label: "Comedor Norte", value: "cn" },
    { label: "Sucursal Poblado", value: "sp" },
    { label: "Barra Sur", value: "bs" },
    { label: "Terraza Centro", value: "tc" },
];

export default function Navbar({ title = "Dashboard" }: NavbarProps) {
    const { toggleMobileOpen } = useSidebarLayout();

    return (
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-neutral-300 bg-white px-6 backdrop-blur-sm">
            {/* Left: Page title */}
            <div className="flex items-center gap-3">
                <button
                    onClick={toggleMobileOpen}
                    aria-label="Abrir menú"
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-neutral-600 transition-colors hover:bg-neutral-100 md:hidden"
                >
                    <Menu size={18} />
                </button>

                <h1 className="text-base font-semibold text-slate-900">{title}</h1>
            </div>

            {/* Right: Search + actions */}
            <div className="flex items-center gap-3">
                {/* Search */}
                <InputSelector
                    leadingIcon={<MapPin />}
                    placeholder="Buscar sucursal..."
                    options={sucursales}
                />

                {/* Notifications */}
                <button className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-700">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                    </svg>
                    <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-indigo-500" />
                </button>

                {/* Avatar */}
                <button className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-500/10 text-xs font-semibold text-indigo-600 transition-colors hover:bg-indigo-500/20 dark:text-indigo-400">
                    JD
                </button>
            </div>
        </header>
    );
}