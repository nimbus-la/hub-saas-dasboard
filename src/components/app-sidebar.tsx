"use client";

import React from "react";
import { BarChart3, Calendar, FolderGit2, Home, Inbox, Search, Users } from "lucide-react";

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
} from "@/components/ui/sidebar"

export function AppSidebar({ children }: React.PropsWithChildren) {
    const [active, setActive] = React.useState("Inicio");

    const mainItems = [
        { name: "Inicio", icon: Home },
        { name: "Bandeja", icon: Inbox, badge: "12" },
        { name: "Calendario", icon: Calendar },
        { name: "Buscar", icon: Search },
    ];

    const projectItems = [
        { name: "Acme Web", icon: FolderGit2 },
        { name: "Equipo", icon: Users },
        { name: "Métricas", icon: BarChart3 },
    ];

    return (
        <SidebarProvider>
            <Sidebar>
                {/* Header: selector de workspace */}
                <SidebarHeader>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton>
                                Acme Inc
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarHeader>

                {/* Content: grupos con menús */}
                <SidebarContent>
                    <SidebarGroup>
                        <SidebarGroupLabel>Aplicación</SidebarGroupLabel>
                        <SidebarMenu>
                            {mainItems.map((item) => (
                                <SidebarMenuItem key={item.name}>
                                    <SidebarMenuButton
                                        isActive={active === item.name}
                                        onClick={() => setActive(item.name)}
                                        title={item.name}
                                    >
                                        {item.name}
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroup>

                    <SidebarGroup>
                        <SidebarGroupLabel>Proyectos</SidebarGroupLabel>
                        <SidebarMenu>
                            {projectItems.map((item) => (
                                <SidebarMenuItem key={item.name}>
                                    <SidebarMenuButton
                                        isActive={active === item.name}
                                        onClick={() => setActive(item.name)}
                                        title={item.name}
                                    >
                                        {item.name}
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}

                            <SidebarMenuItem>
                                <SidebarMenuButton>
                                    Nuevo proyecto
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroup>
                </SidebarContent>

                {/* Footer: menú de usuario */}
                <SidebarFooter>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton>
                                Configuración
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton>
                                Ana Ruiz
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarFooter>
            </Sidebar>

            {children}
        </SidebarProvider>
    )
}