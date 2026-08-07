import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";

import "@/style/style.css";
import { HttpClientProvider, QueryProvider, SidebarLayoutProvider } from "@/context";
import AppShell from "@/components/layout/AppShell";
import { cn } from "@/lib/utils";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Vorea",
  description: "Panel de control para la gestión de sucursales, ventas e inventario.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", jakarta.variable, "font-sans")}
      suppressHydrationWarning
    >
      <body>
        {/*
          Orden de los proveedores, de fuera a dentro:

          1. `HttpClientProvider` — no depende de nadie y todo depende de él.
          2. `QueryProvider`      — sus hooks resuelven el cliente HTTP del
                                    proveedor anterior.
          3. `SidebarLayoutProvider` — estado de interfaz, ajeno a los datos.
        */}
        <HttpClientProvider>
          <QueryProvider>
            <SidebarLayoutProvider>
              <AppShell>
                {children}
              </AppShell>
            </SidebarLayoutProvider>
          </QueryProvider>
        </HttpClientProvider>
      </body>
    </html>
  );
};
