import { isHttpError } from "@/lib/http/http-error";
import { clearAccessToken, getAccessToken, setAccessToken } from "./access-token";

/** Lo que el backend devuelve al renovar y la sesión necesita guardar. */
export interface RefreshedSession {
  sessionToken: string;
  expiredAt: string;
  refreshExpiresAt: string;
}

export interface SessionManagerOptions {
  refreshRequest: () => Promise<RefreshedSession>;
  onRefreshed?: (session: RefreshedSession) => void;
  onSessionExpired?: () => void;
}

export interface SessionManager {
  getAccessToken: () => string | undefined;
  refreshAccessToken: () => Promise<string>;
  clearSession: () => void;
}

const REFRESH_LOCK_NAME = "vorea:session-refresh";

/**
 * Renovación en vuelo, compartida por todos los gestores de la página.
 *
 * Vive fuera de la fábrica porque la cookie de renovación es una sola por
 * navegador: el backend la rota en cada uso y, si recibe una ya rotada, revoca
 * la sesión entera. Dos renovaciones a la vez —la programada y la que dispara
 * un 401— bastan para sacar al usuario, aunque salgan de gestores distintos.
 */
let refreshInFlight: Promise<string> | null = null;

/**
 * Serializa la renovación entre pestañas.
 *
 * Las pestañas comparten la cookie pero no la memoria, así que la promesa de
 * arriba no las coordina: todas leen el mismo `expiredAt` y programarían la
 * renovación en el mismo instante. Con el candado, la segunda espera y sale
 * con la cookie que ya dejó rotada la primera. Sin Web Locks se renueva sin
 * candado, que es el comportamiento de siempre.
 */
async function withRefreshLock<T>(task: () => Promise<T>): Promise<T> {
  if (typeof navigator === "undefined" || !navigator.locks) return task();

  return await navigator.locks.request(REFRESH_LOCK_NAME, task);
}

export function createSessionManager({
  refreshRequest,
  onRefreshed,
  onSessionExpired,
}: SessionManagerOptions): SessionManager {
  const clearSession = (): void => {
    clearAccessToken();
    onSessionExpired?.();
  };

  const refreshAccessToken = (): Promise<string> => {
    refreshInFlight ??= withRefreshLock(refreshRequest)
      .then((session) => {
        setAccessToken(session.sessionToken);
        onRefreshed?.(session);

        return session.sessionToken;
      })
      .catch((error: unknown) => {
        // Solo un 401 dice que la sesión ya no existe. Un timeout o un 503 del
        // refresh son pasajeros: expulsar por ellos obligaría a volver a
        // iniciar sesión por un fallo que se arregla solo.
        if (isHttpError(error) && error.isUnauthorized) clearSession();

        throw error;
      })
      .finally(() => {
        refreshInFlight = null;
      });

    return refreshInFlight;
  };

  return {
    getAccessToken,
    refreshAccessToken,
    clearSession,
  };
}
