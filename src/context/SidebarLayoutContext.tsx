"use client";

import React from "react";

interface SidebarLayoutContextValue {
    isCollapsed: boolean;
    toggleCollapsed: () => void;
    isMobileOpen: boolean;
    toggleMobileOpen: () => void;
    closeMobile: () => void;
};


const SidebarLayoutContext = React.createContext<SidebarLayoutContextValue | undefined>(undefined);


export function SidebarLayoutProvider({ children }: { children: React.ReactNode }) {
    const [isCollapsed, setIsCollapsed] = React.useState<boolean>(false);
    const [isMobileOpen, setIsMobileOpen] = React.useState<boolean>(false);

    return (
        <SidebarLayoutContext.Provider
            value={{
                isCollapsed,
                isMobileOpen,
                toggleCollapsed: () => setIsCollapsed((prev: boolean) => !prev),
                toggleMobileOpen: () => setIsMobileOpen((prev: boolean) => !prev),
                closeMobile: () => setIsMobileOpen(false),
            }}
        >
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