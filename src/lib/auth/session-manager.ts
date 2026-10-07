import { useAuthStore } from "@/store";
import { HttpClient, SessionExpiration, SessionManager } from "@/interfaces";
import { ENDPOINTS, LOGIN_HREF } from "@/utils";

import { isHttpError } from "@/lib/http/http-error";


/**
 * Nombre del candado de Web Locks (`navigator.locks`) que serializa la
 * renovación entre pestañas. No es una cookie ni se manda al backend: es un
 * identificador que el navegador comparte entre las pestañas del mismo origen.
 *
 * Hace falta porque las pestañas comparten la cookie `jwt_refresh` pero no la
 * memoria. El backend rota esa cookie en cada uso y revoca la sesión entera si
 * recibe una ya rotada: dos pestañas renovando a la vez bastan para sacar al
 * usuario. Con el candado, la segunda espera a que termine la primera y sale
 * ya con la cookie nueva.
 */
const CROSS_TAB_REFRESH_LOCK = "vorea:session-refresh";


/**
 * Renovación en curso dentro de esta pestaña.
 *
 * Es el mismo problema que el candado, pero dentro de una pestaña: la
 * renovación programada y la que dispara un 401 pueden coincidir. Vive fuera
 * de la fábrica para que la compartan todos los gestores de la página.
 */
let pendingRefresh: Promise<void> | null = null;


/** Ejecuta `task` con el candado entre pestañas. Sin Web Locks, la ejecuta tal cual. */
async function runWithCrossTabLock<T>(task: () => Promise<T>): Promise<T> {
  if (typeof navigator === "undefined" || !navigator.locks) return task();

  return await navigator.locks.request(CROSS_TAB_REFRESH_LOCK, task);
}


/**
 * Vuelve al login con una navegación completa y no con el router: así se
 * descartan la caché de TanStack Query y todo el estado en memoria, y lo que
 * vio un usuario no asoma en la pantalla del siguiente.
 */
function redirectToLogin(): void {
  if (typeof window === "undefined" || window.location.pathname === LOGIN_HREF) return;

  window.location.href = LOGIN_HREF;
}


/**
 * Gestor de la sesión del navegador.
 *
 * Recibe el cliente sin la capa de autenticación: si la propia renovación
 * pasara por `AuthHttpClient`, un 401 suyo intentaría renovar otra vez.
 */
export function createSessionManager(client: HttpClient): SessionManager {
  /**
   * Siempre pasa por `/auth/logout`, también cuando la sesión ya caducó: las
   * cookies son HttpOnly y solo el backend puede borrarlas. Si `jwt_refresh`
   * se quedara en el navegador, el proxy devolvería al panel a quien acabamos
   * de mandar al login.
   */
  const closeSession = async (): Promise<void> => {
    try {
      await client.post<unknown>(ENDPOINTS.AUTH_LOGOUT, {}, { skipAuthRefresh: true });

    } finally {
      useAuthStore.getState().clearSession();
      redirectToLogin();
    };
  };

  const requestRefresh = async (): Promise<void> => {
    const { content } = await client.post<SessionExpiration>(
      ENDPOINTS.AUTH_REFRESH,
      {},
      { skipAuthRefresh: true }
    );

    useAuthStore.getState().updateSession(content);
  }

  const refreshSession = (): Promise<void> => {
    pendingRefresh ??= runWithCrossTabLock(requestRefresh)
      .catch((error: unknown) => {
        // Solo un 401 dice que la sesión ya no existe. Un timeout o un 503 del
        // refresh son pasajeros: expulsar por ellos obligaría a volver a
        // iniciar sesión por un fallo que se arregla solo.
        if (isHttpError(error) && error.isUnauthorized) void closeSession();

        throw error;
      })
      .finally(() => { pendingRefresh = null; });

    return pendingRefresh;
  };

  return {
    refreshSession,
    closeSession,
  };
}
