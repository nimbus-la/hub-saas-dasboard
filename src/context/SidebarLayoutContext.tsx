"use client";

import React from "react";

interface SidebarLayoutContextValue {
    isCollapsed: boolean;
    toggleCollapsed: () => void;
    expandSidebar: () => void;
    isMobileOpen: boolean;
    toggleMobileOpen: () => void;
    closeMobile: () => void;
    /** ≥768px. El colapso sólo existe en desktop; en móvil el sidebar es un drawer. */
    isDesktop: boolean;
    /**
     * Modo riel: sidebar reducido a iconos. Es `isCollapsed` acotado a desktop,
     * para que el drawer móvil nunca herede el estado colapsado.
     */
    isRail: boolean;
};


const SidebarLayoutContext = React.createContext<SidebarLayoutContextValue | undefined>(undefined);

const DESKTOP_MEDIA_QUERY = "(min-width: 768px)";

function subscribeToDesktop(onStoreChange: () => void) {
    const mediaQuery = window.matchMedia(DESKTOP_MEDIA_QUERY);
    mediaQuery.addEventListener("change", onStoreChange);

    return () => mediaQuery.removeEventListener("change", onStoreChange);
};

function useIsDesktop(): boolean {
    return React.useSyncExternalStore(
        subscribeToDesktop,
        () => window.matchMedia(DESKTOP_MEDIA_QUERY).matches,
        () => false, // En el servidor asumimos móvil: el drawer arranca cerrado.
    );
};


export function SidebarLayoutProvider({ children }: { children: React.ReactNode }) {
    const [isCollapsed, setIsCollapsed] = React.useState<boolean>(false);
    const [isMobileOpen, setIsMobileOpen] = React.useState<boolean>(false);

    const isDesktop = useIsDesktop();

    const value = React.useMemo<SidebarLayoutContextValue>(
        () => ({
            isCollapsed,
            isMobileOpen,
            isDesktop,
            isRail: isCollapsed && isDesktop,
            toggleCollapsed: () => setIsCollapsed((prev: boolean) => !prev),
            expandSidebar: () => setIsCollapsed(false),
            toggleMobileOpen: () => setIsMobileOpen((prev: boolean) => !prev),
            closeMobile: () => setIsMobileOpen(false),
        }),
        [isCollapsed, isMobileOpen, isDesktop]
    );

    return (
        <SidebarLayoutContext.Provider value={value}>
            {children}
        </SidebarLayoutContext.Provider>
    );
};


export function useSidebarLayout() {
    const context = React.useContext(SidebarLayoutContext);

    if (!context) {
        throw new Error("useSidebarLayout debe usarse dentro de <SidebarLayoutProvider>");
    };

    return context;
};
