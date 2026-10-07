"use client";

import React from "react";

import { useHttpClient } from "@/context";
import { useAuthStore } from "@/store";
import { createSessionManager } from "@/lib";


const REFRESH_BEFORE_EXPIRATION_MS = 60 * 1000;


/**
 * Programa la renovación del token un minuto antes de que caduque.
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

    const refreshTime = new Date(accessExpiresAt).getTime() - REFRESH_BEFORE_EXPIRATION_MS;
    const delay = Math.max(refreshTime - Date.now(), 0);

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
