"use client";

import { useState } from "react";

import { useSidebarLayout } from "@/context";
import { Bell, MapPin, Menu, X } from "lucide-react";
import { InputSelector } from "./inputs/InputSelector";
import { Avatar, AvatarBadge, AvatarFallback, AvatarImage } from "./ui/avatar";

interface NavbarProps {
    title?: string;
    subtitle?: string;
    /** Datos del bloque de perfil (opcionales, con valores por defecto). */
    userName?: string;
    userRole?: string;
    userAvatarUrl?: string;
}

const sucursales = [
    { label: "Cocina Central", value: "cc" },
    { label: "Comedor Norte", value: "cn" },
    { label: "Sucursal Poblado", value: "sp" },
    { label: "Barra Sur", value: "bs" },
    { label: "Terraza Centro", value: "tc" },
];

/** Botón de icono: 36x36, un solo radio, foco visible, sin sombra. */
const iconButton =
    "flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-lg text-neutral-600 " +
    "transition-colors duration-150 ease-out hover:bg-neutral-100 hover:text-neutral-800 " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-main/30 " +
    "active:scale-95 motion-reduce:transition-none motion-reduce:active:scale-100";

function initialsFrom(name: string) {
    return name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((word) => word[0]?.toUpperCase() ?? "")
        .join("");
}

export default function Navbar({
    title = "Dashboard",
    subtitle,
    userName = "Juan Manuel",
    userRole = "Administrador",
    userAvatarUrl = "",
}: NavbarProps) {
    const { toggleMobileOpen } = useSidebarLayout();
    const [isSelectorOpen, setIsSelectorOpen] = useState(false);

    return (
        <header className="sticky top-0 z-40 h-16 border-b border-neutral-200 bg-white">
            <nav
                aria-label="Barra superior"
                className="relative flex h-full items-center justify-between gap-4 px-4 md:px-6"
            >
                {/* ─── Izquierda: menú móvil + selector ─────────────────────── */}
                <div className="flex min-w-0 items-center gap-2">
                    <button
                        type="button"
                        onClick={toggleMobileOpen}
                        aria-label="Abrir menú"
                        className={`${iconButton} md:hidden`}
                    >
                        <Menu size={20} strokeWidth={1.5} aria-hidden="true" />
                    </button>

                    {/* Selector de sucursal (≥640px) */}
                    <div className="hidden w-full max-w-50 sm:block lg:max-w-xs">
                        <InputSelector
                            leftIcon={<MapPin strokeWidth={1.5} />}
                            placeholder="Selecionar sucursal"
                            options={sucursales}
                            size="sm"
                            className="w-xs"
                        />
                    </div>
                </div>

                {/* ─── Derecha: acciones + perfil ──────────────── */}
                <div className="flex shrink-0 items-center gap-2">

                    {/* Selector colapsado en icono (<640px) */}
                    <button
                        type="button"
                        onClick={() => setIsSelectorOpen(true)}
                        aria-label="Seleccionar sucursal"
                        aria-expanded={isSelectorOpen}
                        className={`${iconButton} sm:hidden`}
                    >
                        <MapPin size={20} strokeWidth={1.5} aria-hidden="true" />
                    </button>

                    {/* Notificaciones */}
                    <button
                        type="button"
                        onClick={() => console.log('Hola!')}
                        aria-label="Ver notificaciones"
                        className={`relative ${iconButton}`}
                    >
                        <Bell size={18} strokeWidth={1.5} aria-hidden="true" />
                        <span
                            aria-hidden="true"
                            className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-error-main ring-2 ring-background"
                        />
                    </button>

                    {/* Perfil */}
                    <div className="ml-2 flex items-center gap-3 border-l border-neutral-300 pl-3">
                        <Avatar className="size-9">
                            <AvatarImage src={userAvatarUrl} alt="" />

                            <AvatarFallback className="text-xs font-medium">
                                {initialsFrom(userName)}
                            </AvatarFallback>

                            <AvatarBadge className="bg-success-main dark:bg-success-dark" />
                        </Avatar>

                        <div className="hidden flex-col leading-tight sm:flex">
                            <span className="text-sm font-medium text-neutral-800">
                                {userName}
                            </span>

                            <span className="text-xs text-neutral-600">
                                {userRole}
                            </span>
                        </div>
                    </div>
                </div>

                {/* ─── Overlay del selector en móvil ──────────────────────── */}
                {isSelectorOpen && (
                    <div
                        onKeyDown={(event) => {
                            if (event.key === "Escape") setIsSelectorOpen(false);
                        }}
                        className="absolute inset-x-0 top-0 flex h-full items-center gap-2 bg-background px-4 sm:hidden"
                    >
                        <div className="min-w-0 flex-1">
                            <InputSelector
                                leftIcon={<MapPin strokeWidth={1.5} />}
                                placeholder="Selecionar sucursal"
                                options={sucursales}
                                size="sm"
                            />
                        </div>

                        <button
                            type="button"
                            autoFocus
                            onClick={() => setIsSelectorOpen(false)}
                            aria-label="Cerrar selector de sucursal"
                            className={iconButton}
                        >
                            <X size={20} strokeWidth={1.5} aria-hidden="true" />
                        </button>
                    </div>
                )}
            </nav>
        </header>
    );
}
