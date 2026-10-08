import type { Metadata } from "next";

import { messages } from "@/messages";
import { resolvePostLoginHref } from "@/utils";

import Login from "@/features/auth/page/Login";

export const metadata: Metadata = messages.auth.metadata.login;

interface LoginRouteProps {
    searchParams: Promise<{ from?: string | string[] }>;
}

/**
 * Ruta del inicio de sesión. El destino se valida aquí, en el servidor, para
 * que la pantalla reciba una ruta ya segura y no tenga que leer la URL.
 */
export default async function LoginPage({ searchParams }: LoginRouteProps) {
    const { from } = await searchParams;

    return <Login redirectTo={resolvePostLoginHref(from)} />;
}
