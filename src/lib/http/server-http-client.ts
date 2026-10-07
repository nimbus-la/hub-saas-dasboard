import { cookies } from "next/headers";

import type { HttpClient } from "@/interfaces";
import { SESSION_COOKIES } from "@/utils";

import { createHttpClient } from "./http-client";


/**
 * Cliente para Server Components, firmado con la sesión de quien pide la
 * página.
 *
 * En el navegador las cookies viajan solas (`credentials: "include"`). En el
 * servidor no: la petición al backend la hace Next, y Next no tiene cookies
 * propias. Sin esto, cada precarga salía anónima, el backend respondía 401 y
 * la página llegaba vacía para que el navegador la pidiera otra vez.
 *
 * Solo se reenvía `jwt_access`. El refresco no se intenta aquí: rotaría
 * `jwt_refresh`, y un Server Component no puede devolverle la cookie nueva al
 * navegador, que se quedaría con una ya gastada. Si el acceso caducó, la
 * precarga falla en silencio y el navegador renueva y pide por su cuenta.
 *
 * Se crea uno por petición porque las cookies son de cada visita. Vive fuera
 * del barril de `@/lib/http` a propósito: importa `next/headers`, que no
 * existe en el navegador, y el barril lo consumen también los hooks.
 */
export async function createServerHttpClient(): Promise<HttpClient> {
    const accessToken = (await cookies()).get(SESSION_COOKIES.ACCESS_TOKEN)?.value;

    if (!accessToken) return createHttpClient();

    const sessionCookie = `${SESSION_COOKIES.ACCESS_TOKEN}=${accessToken}`;

    return createHttpClient({
        onRequest: (request) => ({
            ...request,
            headers: { ...request.headers, Cookie: sessionCookie },
        }),
    });
}
