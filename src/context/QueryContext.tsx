"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import React from "react";

import { notifyApi } from "@/components";
import { getQueryClient } from "@/lib/query/query-client";


/**
 * Proveedor de la caché de estado de servidor
 * 
 * Envuelve la aplicación para que los hooks de `*.queries.ts` tengan dónde
 * guardar y compartir sus datos. No configura nada: toda la política vive en
 * `src/lib/query/query-client.ts`.
 *
 * Devtools (opcional, muy recomendable cuando haya varias pantallas vivas):
 *
 *     pnpm add -D @tanstack/react-query-devtools
 *
 * y se monta como hermano de `children`. Sólo se incluye en desarrollo; el
 * propio paquete se excluye del bundle de producción.
 */


export function QueryProvider({ children }: { children: React.ReactNode }) {
    // `getQueryClient` ya resuelve el caso servidor (instancia nueva por
    // render) y el caso navegador (una sola compartida), así que llamarlo en
    // el render es correcto y no crea clientes de más.
    const queryClient = getQueryClient(notifyApi);

    return (
        <QueryClientProvider client={queryClient}>
            {children}

            {process.env.NODE_ENV === "development" && (
                <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-right" />
            )}
        </QueryClientProvider>
    );
};
