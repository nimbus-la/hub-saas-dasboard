"use client";

import { useState } from "react";

import { Bell, LogOut, MapPin, Menu, X } from "lucide-react";

import { useSidebarLayout } from "@/context";
import { cn } from "@/lib/utils";
import { messages } from "@/messages";
import { ICON_SIZE, ICON_STROKE } from "@/tokens";
import { useAuthStore } from "@/store";
import { useLogout } from "@/features/auth/hooks";

import { InputSelector } from "../inputs/InputSelector";
import {
    Avatar,
    AvatarBadge,
    AvatarFallback,
    AvatarImage,
} from "../avatars/Avatar";
import {
    navbarBranchOverlayVariants,
    navbarBranchSelectorVariants,
    navbarIconButtonVariants,
    navbarInnerVariants,
    navbarNotificationDotVariants,
    navbarProfileTextVariants,
    navbarProfileVariants,
    navbarSectionVariants,
    navbarUserNameVariants,
    navbarUserPlaceholderVariants,
    navbarUserRoleVariants,
    navbarVariants,
} from "./navbar.style";


const sucursales = [
    { label: "Cocina Central", value: "cc" },
    { label: "Comedor Norte", value: "cn" },
    { label: "Sucursal Poblado", value: "sp" },
    { label: "Barra Sur", value: "bs" },
    { label: "Terraza Centro", value: "tc" },
];

/**
 * Peso de los iconos de la barra.
 *
 * 20px con trazo fino: es chrome, no contenido. Es justo el trazo que
 * `ICON_STROKE_BY_SIZE` recomienda a este tamaño.
 */
const CHROME_ICON_SIZE = ICON_SIZE.xl;
const CHROME_ICON_STROKE = ICON_STROKE.light;


function initialsFrom(name: string) {
    return name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((word) => word[0]?.toUpperCase() ?? "")
        .join("");
}

export default function Navbar() {
    const user = useAuthStore((state) => state.user);

    const { toggleMobileOpen } = useSidebarLayout();
    const { mutate: logout, isPending: isLoggingOut } = useLogout();

    const [isSelectorOpen, setIsSelectorOpen] = useState(false);

    const userName = `${user?.firstName ?? ""} ${user?.firstLastName ?? ""}`.trim();
    const userAvatarUrl = "";

    return (
        <header className={navbarVariants()}>
            <nav
                aria-label={messages.navigation.navbar.label}
                className={navbarInnerVariants()}
            >
                {/* ─── Izquierda: menú móvil + selector ─────────────────────── */}
                <div className={cn(navbarSectionVariants(), "min-w-0")}>
                    <button
                        type="button"
                        onClick={toggleMobileOpen}
                        aria-label={messages.navigation.navbar.openMenu}
                        className={cn(navbarIconButtonVariants(), "md:hidden")}
                    >
                        <Menu
                            size={CHROME_ICON_SIZE}
                            strokeWidth={CHROME_ICON_STROKE}
                            aria-hidden="true"
                        />
                    </button>

                    {/* Selector de sucursal (≥640px) */}
                    <div className={navbarBranchSelectorVariants()}>
                        <InputSelector
                            leftIcon={<MapPin strokeWidth={CHROME_ICON_STROKE} />}
                            placeholder={messages.navigation.navbar.branchPlaceholder}
                            options={sucursales}
                            size="sm"
                            className="w-full"
                        />
                    </div>
                </div>

                {/* ─── Derecha: acciones + perfil ──────────────── */}
                <div className={cn(navbarSectionVariants(), "shrink-0")}>
                    {/* Selector colapsado en icono (<640px) */}
                    <button
                        type="button"
                        onClick={() => setIsSelectorOpen(true)}
                        aria-label={messages.navigation.navbar.selectBranch}
                        aria-expanded={isSelectorOpen}
                        className={cn(navbarIconButtonVariants(), "sm:hidden")}
                    >
                        <MapPin
                            size={CHROME_ICON_SIZE}
                            strokeWidth={CHROME_ICON_STROKE}
                            aria-hidden="true"
                        />
                    </button>

                    {/* Notificaciones */}
                    <button
                        type="button"
                        onClick={() => console.log('Hola!')}
                        aria-label={messages.navigation.navbar.notifications}
                        className={cn(navbarIconButtonVariants(), "relative")}
                    >
                        <Bell
                            size={CHROME_ICON_SIZE}
                            strokeWidth={CHROME_ICON_STROKE}
                            aria-hidden="true"
                        />
                        <span
                            aria-hidden="true"
                            className={navbarNotificationDotVariants()}
                        />
                    </button>

                    {/* Perfil */}
                    <div className={navbarProfileVariants()}>
                        <Avatar size="sm">
                            <AvatarImage src={userAvatarUrl} alt="" />

                            <AvatarFallback>
                                {initialsFrom(userName)}
                            </AvatarFallback>

                            <AvatarBadge className="bg-success-main" />
                        </Avatar>

                        <div className={navbarProfileTextVariants()}>
                            {user ? (
                                <>
                                    <span className={navbarUserNameVariants()}>
                                        {userName}
                                    </span>

                                    <span className={navbarUserRoleVariants()}>
                                        {user.rolName}
                                    </span>
                                </>
                            ) : (
                                <>
                                    <span aria-hidden="true" className={navbarUserPlaceholderVariants({ line: "name" })} />
                                    <span aria-hidden="true" className={navbarUserPlaceholderVariants({ line: "role" })} />
                                </>
                            )}
                        </div>
                        <button
                            type="button"
                            onClick={() => logout()}
                            disabled={isLoggingOut}
                            aria-label={messages.navigation.navbar.logout}
                            className={navbarIconButtonVariants()}
                        >
                            <LogOut size={CHROME_ICON_SIZE} strokeWidth={CHROME_ICON_STROKE} aria-hidden="true" />
                        </button>
                    </div>
                </div>

                {/* ─── Overlay del selector en móvil ──────────────────────── */}
                {isSelectorOpen && (
                    <div
                        onKeyDown={(event) => {
                            if (event.key === "Escape") setIsSelectorOpen(false);
                        }}
                        className={navbarBranchOverlayVariants()}
                    >
                        <div className="min-w-0 flex-1">
                            <InputSelector
                                leftIcon={<MapPin strokeWidth={CHROME_ICON_STROKE} />}
                                placeholder={messages.navigation.navbar.branchPlaceholder}
                                options={sucursales}
                                size="sm"
                            />
                        </div>

                        <button
                            type="button"
                            autoFocus
                            onClick={() => setIsSelectorOpen(false)}
                            aria-label={messages.navigation.navbar.closeBranchSelector}
                            className={navbarIconButtonVariants()}
                        >
                            <X
                                size={CHROME_ICON_SIZE}
                                strokeWidth={CHROME_ICON_STROKE}
                                aria-hidden="true"
                            />
                        </button>
                    </div>
                )}
            </nav>
        </header>
    );
}
