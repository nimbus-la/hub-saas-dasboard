import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";

import "@/style/style.css";
import { HttpClientProvider, QueryProvider, SidebarLayoutProvider } from "@/context";
import { DEFAULT_LOCALE, messages } from "@/messages";
import AlertToaster from "@/components/alerts/AlertToaster";
import AppShell from "@/components/layout/AppShell";
import { cn } from "@/lib/utils";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: messages.navigation.app.name,
  description: messages.navigation.app.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang={DEFAULT_LOCALE}
      className={cn("h-full", jakarta.variable, "font-sans")}
      suppressHydrationWarning
    >
      <body>
        <HttpClientProvider>
          <QueryProvider>
            <SidebarLayoutProvider>
              <AppShell>
                {children}
              </AppShell>
            </SidebarLayoutProvider>

            <AlertToaster />
          </QueryProvider>
        </HttpClientProvider>
      </body>
    </html>
  );
};
