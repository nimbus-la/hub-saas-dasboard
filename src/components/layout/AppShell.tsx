"use client";

import { usePathname } from "next/navigation";
import { cx } from "class-variance-authority";

import { useSidebarLayout } from "@/context";
import { useSessionRefresh, useSessionSync } from "@/features/auth/hooks";
import { LOGIN_HREF } from "@/utils";

import Sidebar from "../sidebar/Sidebar";
import Navbar from "../navbar/Navbar";


export default function AppShell({ children }: { children: React.ReactNode }) {
    const { isCollapsed } = useSidebarLayout();

    const pathname = usePathname();
    const isLogin = pathname === LOGIN_HREF;

    useSessionRefresh(!isLogin);
    useSessionSync();

    if (isLogin) {
        return <>{children}</>;
    }

    return (
        <div className="flex min-h-screen">
            <Sidebar />

            <div
                className={cx(
                    "w-full bg-neutral-50 transition-[padding] duration-200",
                    isCollapsed ? "md:pl-20" : "md:pl-64"
                )}
            >
                <Navbar />

                <main className="isolate mx-auto w-full max-w-screen-2xl overflow-hidden p-4 md:p-6 2xl:p-10">
                    {children}
                </main>
            </div>
        </div>
    );
};
