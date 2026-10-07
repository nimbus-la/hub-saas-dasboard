"use client";

import React from "react";

import { useHttpClient } from "@/context";
import { useAuthStore } from "@/store";
import { createSessionManager } from "@/lib";


/** Antelación con la que se renueva un token de vida larga. */
const REFRESH_BEFORE_EXPIRATION_MS = 60 * 1000;

/**
 * Espera mínima entre renovaciones.
 *
 * `accessExpiresAt` viene con la hora del servidor y se compara con la del
 * equipo. Si el reloj del equipo va adelantado más de lo que dura el token, el
 * momento de renovar siempre "ya pasó": sin este suelo, cada renovación
 * programaría la siguiente al instante y el panel martillearía al backend en
 * bucle.
 */
const MIN_REFRESH_DELAY_MS = 5 * 1000;


/**
 * Cuánto esperar antes de renovar.
 *
 * El margen es el menor entre un minuto y la mitad de la vida que le queda al
 * token: con uno de una hora se renueva un minuto antes, y con uno de diez
 * segundos —o uno que llega ya medio gastado— a mitad de camino, en vez de
 * "un minuto antes" de algo que dura menos de un minuto.
 */
function refreshDelayMs(accessExpiresAt: string): number {
  const remainingMs = new Date(accessExpiresAt).getTime() - Date.now();
  const marginMs = Math.min(REFRESH_BEFORE_EXPIRATION_MS, remainingMs / 2);

  return Math.max(remainingMs - marginMs, MIN_REFRESH_DELAY_MS);
}


/**
 * Programa la renovación del token antes de que caduque (ver `refreshDelayMs`).
 *
 * `enabled` va a `false` en el login: ahí lo que haya en el almacenamiento es
 * de una sesión anterior, y renovarla resucitaría una sesión con el formulario
 * todavía en pantalla.
 */
export function useSessionRefresh(enabled: boolean) {
  const http = useHttpClient();
  const accessExpiresAt = useAuthStore((state) => state.accessExpiresAt);

  const { refreshSession, expireSession } = React.useMemo(() => createSessionManager(http), [http]);

  // El proxy deja pasar con solo las cookies, pero el usuario vive en el
  // almacenamiento. Si alguien lo borró, no hay de dónde recuperarlo —el
  // backend no tiene un "quién soy" y la renovación solo trae fechas—, así que
  // se trata como una sesión caducada en vez de dejar un panel sin usuario y
  // sin renovación programada. Solo al entrar en el panel: los cambios que
  // llegan después los atiende `useSessionSync`.
  React.useEffect(() => {
    if (!enabled || !useAuthStore.persist.hasHydrated()) return;

    if (useAuthStore.getState().user === null) void expireSession();
  }, [enabled, expireSession]);

  React.useEffect(() => {
    if (!enabled || !accessExpiresAt) return;

    const delay = refreshDelayMs(accessExpiresAt);

    // El fallo no se avisa aquí: un 401 ya cierra la sesión en el gestor, y
    // cualquier otro lo vuelve a intentar la primera petición que reciba un 401.
    const timeoutId = window.setTimeout(() => {
      refreshSession().catch(() => {});
    }, delay);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [enabled, accessExpiresAt, refreshSession]);
}
