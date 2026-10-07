"use client";

import React from "react";

import { useAuthStore } from "@/store";
import { DEFAULT_HOME_HREF, LOGIN_HREF, SESSION_STORAGE_KEY } from "@/utils";


/**
 * Mantiene la sesión igual en todas las pestañas.
 *
 * Las pestañas comparten el `localStorage` pero no la memoria: sin esto, la
 * que no cerró sesión seguiría enseñando al usuario hasta recargar, y la que
 * no renovó el token lo renovaría otra vez con su fecha vieja. El evento
 * `storage` solo llega a las otras pestañas, nunca a la que escribió.
 *
 * Si otra pestaña cerró sesión, ésta se va al login; si otra la abrió
 * mientras ésta estaba en el login, se va al panel. Las dos con navegación
 * completa, por lo mismo que `redirectToLogin`: no queda nada en memoria del
 * estado anterior.
 */
export function useSessionSync() {
  React.useEffect(() => {
    const onStorage = async (event: StorageEvent) => {
      // `key` llega a `null` cuando se vacía el almacenamiento entero.
      if (event.key !== null && event.key !== SESSION_STORAGE_KEY) return;

      await useAuthStore.persist.rehydrate();

      const hasSession = useAuthStore.getState().user !== null;
      const isOnLogin = window.location.pathname === LOGIN_HREF;

      if (!hasSession && !isOnLogin) window.location.href = LOGIN_HREF;
      if (hasSession && isOnLogin) window.location.href = DEFAULT_HOME_HREF;
    };

    window.addEventListener("storage", onStorage);

    return () => {
      window.removeEventListener("storage", onStorage);
    };
  }, []);
}
