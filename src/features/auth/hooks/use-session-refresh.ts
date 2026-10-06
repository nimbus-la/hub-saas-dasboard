"use client";

import { useEffect, useMemo } from "react";
import { useHttpClient } from "@/context";
import { createBrowserSessionManager } from "@/lib/http";
import { useAuthStore } from "@/store/auth/auth.store";

const REFRESH_BEFORE_EXPIRATION_MS = 60 * 1000;

export function useSessionRefresh() {
  const http = useHttpClient();
  const expiredAt = useAuthStore((state) => state.expiredAt);
  const refreshExpiresAt = useAuthStore((state) => state.refreshExpiresAt);

  // La identidad importa: es dependencia del efecto y un gestor nuevo en cada
  // render reprogramaría el temporizador sin parar.
  const { refreshAccessToken } = useMemo(() => createBrowserSessionManager(http), [http]);

  useEffect(() => {
    if (!expiredAt || !refreshExpiresAt) {
      return;
    }

    const refreshTime = new Date(expiredAt).getTime() - REFRESH_BEFORE_EXPIRATION_MS;
    const delay = Math.max(refreshTime - Date.now(), 0);

    // El fallo no se avisa aquí: un 401 ya cierra la sesión en el gestor, y
    // cualquier otro lo vuelve a intentar la primera petición que reciba un 401.
    const timeoutId = window.setTimeout(() => {
      refreshAccessToken().catch(() => {});
    }, delay);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [expiredAt, refreshExpiresAt, refreshAccessToken]);
}
