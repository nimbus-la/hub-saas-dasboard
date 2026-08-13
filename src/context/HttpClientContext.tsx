"use client";

import React from "react";

import { httpClient } from "@/lib/http";
import type { HttpClient } from "@/interfaces";


/**
 * Inyección del cliente HTTP
 * 
 * Los componentes y hooks del cliente piden su cliente HTTP con
 * `useHttpClient()` en lugar de importar la instancia compartida. Parece un
 * rodeo, y compra dos cosas concretas:
 * 
 * - Pruebas y Storybook pueden envolver el árbol con un cliente falso que
 *   devuelve datos fijos, sin tocar la red ni parchear módulos.
 * - Si el día de mañana el cliente necesita algo del contexto de React
 *   —el token de la sesión, la sucursal activa— se construye aquí con esos
 *   datos y todo lo de abajo lo recibe sin cambiar una línea.
 * 
 * Aviso de Next: este proveedor lleva su propio valor por defecto en vez de
 * recibirlo desde el layout. Un layout es Server Component, y todo lo que pasa
 * por props a un componente cliente tiene que ser serializable — una instancia
 * de clase no lo es. Al construirse aquí dentro, del lado cliente, nunca cruza
 * la frontera.
 */


const HttpClientContext = React.createContext<HttpClient | undefined>(undefined);

export function HttpClientProvider({
    children,
    client = httpClient,
}: {
    children: React.ReactNode;
    /** Sustituto del cliente compartido. Sólo desde código cliente (pruebas). */
    client?: HttpClient;
}) {
    return (
        <HttpClientContext.Provider value={client}>
            {children}
        </HttpClientContext.Provider>
    );
};

/**
 * Cliente HTTP del árbol actual.
 *
 * Lanza si falta el proveedor en lugar de caer al cliente compartido: un
 * componente que se cuela fuera del proveedor debe fallar en la primera
 * ejecución, no funcionar en desarrollo y saltarse el cliente falso en las
 * pruebas.
 */
export function useHttpClient(): HttpClient {
    const context = React.useContext(HttpClientContext);

    if (!context) {
        throw new Error("useHttpClient debe usarse dentro de <HttpClientProvider>");
    };

    return context;
};
