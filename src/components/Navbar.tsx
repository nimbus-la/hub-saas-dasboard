"use client";

import { useSidebarLayout } from "@/context";
import { Bell, MapPin, Menu } from "lucide-react";
import { InputSelector } from "./inputs/InputSelector";
import { Avatar, AvatarBadge, AvatarFallback, AvatarImage } from "./ui/avatar";

interface NavbarProps {
    title?: string;
    subtitle?: string;
}

const sucursales = [
    { label: "Cocina Central", value: "cc" },
    { label: "Comedor Norte", value: "cn" },
    { label: "Sucursal Poblado", value: "sp" },
    { label: "Barra Sur", value: "bs" },
    { label: "Terraza Centro", value: "tc" },
];

export default function Navbar({ title = "Dashboard", subtitle }: NavbarProps) {
    const { toggleMobileOpen } = useSidebarLayout();

    return (
        <header className="sticky top-0 z-40 flex h-18 items-center justify-between px-8 border-b border-neutral-300 backdrop-blur-sm">
            {/* Left: Page title */}
            <div className="flex items-center gap-3">
                <button
                    onClick={toggleMobileOpen}
                    aria-label="Abrir menú"
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-neutral-600 transition-colors hover:bg-neutral-100 md:hidden"
                >
                    <Menu size={18} />
                </button>

                <div className="flex flex-col items-start gap-0.5">
                    <h1 className="text-lg font-semibold text-slate-900">
                        {title}
                    </h1>

                    {subtitle && (
                        <p className="text-sm leading-5 text-slate-500">
                            {subtitle}
                        </p>
                    )}
                </div>
            </div>

            {/* Right: Search + actions */}
            <div className="flex items-center gap-3">
                {/* Search */}
                <InputSelector
                    leadingIcon={<MapPin />}
                    placeholder="Selecionar sucursal"
                    options={sucursales}
                />

                {/* Notifications */}
                <Bell
                    className="cursor-pointer text-slate-500 transition-colors hover:text-slate-900"
                    onClick={() => console.log('Hola!')}
                />

                {/* Avatar */}
                <Avatar>
                    <AvatarImage src="" alt="@shadcn" />
                    <AvatarFallback>JM</AvatarFallback>
                    <AvatarBadge className="bg-success-main dark:bg-success-dark" />
                </Avatar>
            </div>
        </header>
    );
}