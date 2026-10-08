import { useAuthStore } from "@/store";
import { HttpClient, SessionExpiration, SessionManager } from "@/interfaces";
import { ENDPOINTS, LOGIN_HREF, buildLoginHref } from "@/utils";

import { isHttpError } from "@/lib/http/http-error";


/**
 * Nombre del candado de Web Locks (`navigator.locks`) que serializa la
 * renovación entre pestañas. No es una cookie ni se manda al backend: es un
 * identificador que el navegador comparte entre las pestañas del mismo origen.
 *
 * Hace falta porque las pestañas comparten la cookie `jwt_refresh` pero no la
 * memoria. El backend rota esa cookie en cada uso y revoca la sesión entera si
 * recibe una ya rotada: dos pestañas renovando a la vez bastan para sacar al
 * usuario. Con el candado, la segunda espera a que termine la primera y, al
 * entrar, ve que la sesión ya se renovó y no pide otra (ver `requestRefresh`).
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
function redirectToLogin(from?: string): void {
  if (typeof window === "undefined" || window.location.pathname === LOGIN_HREF) return;

  window.location.href = buildLoginHref(from);
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
   *
   * Por lo mismo, si el logout falla no se toca nada. Vaciar el
   * almacenamiento con las cookies todavía puestas deja un panel sin usuario
   * al que el proxy deja pasar, y `useSessionRefresh`, al verlo vacío, vuelve
   * a expulsar: un bucle de redirecciones mientras el backend no conteste, y
   * una sesión que sigue abierta aunque la pantalla diga lo contrario.
   */
  const endSession = async (from?: string): Promise<void> => {
    await client.post<unknown>(ENDPOINTS.AUTH_LOGOUT, {}, { skipAuthRefresh: true });

    useAuthStore.getState().clearSession();
    redirectToLogin(from);
  };

  /**
   * El usuario sale. El login no recuerda dónde estaba: quien entre después
   * puede ser otra persona, y llevarla a la pantalla del anterior no tiene
   * sentido.
   *
   * Si falla, el error llega a la mutación de `useLogout` y la caché lo avisa:
   * quien pulsó "Cerrar sesión" tiene que saber que sigue dentro.
   */
  const closeSession = (): Promise<void> => endSession();

  /**
   * La sesión dejó de valer. El login recuerda la pantalla para devolver al
   * usuario a ella al volver a entrar. La ruta se toma antes de la petición,
   * que es asíncrona y podría resolverse ya en otra página.
   *
   * Un fallo aquí se calla: nadie pidió salir, y el siguiente 401 lo vuelve a
   * intentar. Quien llama lo hace sin esperar, así que tampoco hay a quién
   * devolverle el error.
   */
  const expireSession = async (): Promise<void> => {
    const from = typeof window === "undefined"
      ? undefined
      : window.location.pathname + window.location.search;

    try {
      await endSession(from);
    } catch {
      // Ver arriba: sin logout, la sesión se queda como está.
    }
  };

  /**
   * `knownExpiresAt` es la caducidad que esta pestaña tenía al decidir
   * renovar. Las pestañas comparten la misma fecha, así que sus temporizadores
   * saltan a la vez y todas acaban en la cola del candado: sin esta
   * comprobación, cada una renovaría al llegar su turno y N pestañas harían N
   * renovaciones —y N rotaciones— por ciclo.
   *
   * Se relee el almacenamiento y no la memoria porque el evento `storage` que
   * trae la fecha nueva puede llegar después de que el candado se suelte.
   */
  const requestRefresh = async (knownExpiresAt: string | null): Promise<void> => {
    await useAuthStore.persist.rehydrate();

    // Otra pestaña renovó mientras ésta esperaba: la cookie del navegador ya
    // es la nueva, y quien pidió la renovación puede seguir con ella.
    if (useAuthStore.getState().accessExpiresAt !== knownExpiresAt) return;

    const { content } = await client.post<SessionExpiration>(
      ENDPOINTS.AUTH_REFRESH,
      {},
      { skipAuthRefresh: true }
    );

    useAuthStore.getState().updateSession(content);
  }

  const refreshSession = (): Promise<void> => {
    if (pendingRefresh) return pendingRefresh;

    const knownExpiresAt = useAuthStore.getState().accessExpiresAt;

    pendingRefresh = runWithCrossTabLock(() => requestRefresh(knownExpiresAt))
      .catch((error: unknown) => {
        // Solo un 401 dice que la sesión ya no existe. Un timeout o un 503 del
        // refresh son pasajeros: expulsar por ellos obligaría a volver a
        // iniciar sesión por un fallo que se arregla solo.
        if (isHttpError(error) && error.isUnauthorized) void expireSession();

        throw error;
      })
      .finally(() => { pendingRefresh = null; });

    return pendingRefresh;
  };

  return {
    refreshSession,
    closeSession,
    expireSession,
  };
}
