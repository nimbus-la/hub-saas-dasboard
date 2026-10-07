"use client";

import React from "react";

import { useHttpClient } from "@/context";
import { useAuthStore } from "@/store";
import { createSessionManager } from "@/lib";


const REFRESH_BEFORE_EXPIRATION_MS = 60 * 1000;


export function useSessionRefresh() {
  const http = useHttpClient();
  const accessExpiresAt = useAuthStore((state) => state.accessExpiresAt);

  const { refreshSession } = React.useMemo(() => createSessionManager(http), [http]);

  React.useEffect(() => {
    if (!accessExpiresAt) return;

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
  }, [accessExpiresAt, refreshSession]);
}
