import { QueryClient } from "@tanstack/react-query";

import { isRetryableError } from "@/lib/http";
import {
    QUERY_DEFAULT_GC_TIME_MS,
    QUERY_DEFAULT_STALE_TIME_MS,
    QUERY_MAX_RETRIES,
    QUERY_MAX_RETRY_DELAY_MS,
    QUERY_RETRY_BASE_DELAY_MS,
} from "@/utils";


/**
 * Configuración de la caché de estado de servidor
 * 
 * El único sitio donde se decide cuándo un dato se considera viejo, cuándo se
 * vuelve a pedir y qué se reintenta. Si estas decisiones se dejan a cada
 * `useQuery`, en seis meses hay quince criterios distintos y ninguna pantalla
 * se comporta como la de al lado.
 */


export function makeQueryClient(): QueryClient {
    return new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: QUERY_DEFAULT_STALE_TIME_MS,
                gcTime: QUERY_DEFAULT_GC_TIME_MS,

                // La librería reintenta cualquier error tres veces. Aquí sólo
                // se reintenta lo que puede arreglarse solo: ver
                // `isRetryableError`. Un 404 o un 422 fallan una vez y se
                // muestran de inmediato.
                retry: (failureCount, error) =>
                    failureCount < QUERY_MAX_RETRIES && isRetryableError(error),

                retryDelay: (attemptIndex) =>
                    Math.min(
                        QUERY_RETRY_BASE_DELAY_MS * 2 ** attemptIndex,
                        QUERY_MAX_RETRY_DELAY_MS
                    ),

                // Volver a la pestaña es la señal más honesta de "quiero ver
                // esto otra vez". Combinado con `staleTime`, no genera tráfico
                // extra si el dato aún está fresco.
                refetchOnWindowFocus: true,

                // Recuperar la conexión sí obliga a refrescar: mientras no la
                // había, el dato pudo quedarse atrás sin que nadie se enterara.
                refetchOnReconnect: "always",
            },

            mutations: {
                // Las mutaciones no se reintentan solas: repetir un POST que
                // quizá sí llegó al servidor puede crear el registro dos veces.
                // Reintentar es decisión del usuario, con un botón.
                retry: false,
            },
        },
    });
}

/**
 * Instancia del navegador.
 *
 * En el servidor **no** puede haber una compartida: sería una caché común a
 * todos los usuarios que atiende el proceso, y el pedido de un restaurante
 * acabaría en la pantalla de otro. Por eso cada render del servidor crea la
 * suya y se descarta al terminar.
 */
let browserQueryClient: QueryClient | undefined;

export function getQueryClient(): QueryClient {
    if (typeof window === "undefined") return makeQueryClient();

    // En el navegador se reutiliza para que la caché sobreviva a las
    // navegaciones. El `??=` evita recrearla si React vuelve a montar el
    // proveedor (algo que en desarrollo, con Strict Mode, ocurre siempre).
    browserQueryClient ??= makeQueryClient();

    return browserQueryClient;
}
