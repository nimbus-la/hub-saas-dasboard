"use client";

import React from "react";

import { useAuthStore } from "@/store";
import { DEFAULT_HOME_HREF, LOGIN_HREF, SESSION_STORAGE_KEY } from "@/utils";


/**
 * Lleva la pantalla a donde le toca según la sesión guardada: al login si ya
 * no hay usuario, al panel si lo hay y se está en el login. Con navegación
 * completa, por lo mismo que `redirectToLogin`: no queda nada en memoria del
 * estado anterior.
 */
async function followStoredSession(): Promise<void> {
  await useAuthStore.persist.rehydrate();

  const hasSession = useAuthStore.getState().user !== null;
  const isOnLogin = window.location.pathname === LOGIN_HREF;

  if (!hasSession && !isOnLogin) window.location.href = LOGIN_HREF;
  if (hasSession && isOnLogin) window.location.href = DEFAULT_HOME_HREF;
}


/**
 * Mantiene la sesión igual en todas las pestañas y en el historial.
 *
 * Las pestañas comparten el `localStorage` pero no la memoria: sin esto, la
 * que no cerró sesión seguiría enseñando al usuario hasta recargar, y la que
 * no renovó el token lo renovaría otra vez con su fecha vieja. El evento
 * `storage` solo llega a las otras pestañas, nunca a la que escribió.
 *
 * El botón "atrás" tiene el mismo problema dentro de una pestaña. El navegador
 * guarda la página entera en la bfcache y la restaura sin pedirla: no pasa por
 * el proxy ni vuelve a montar nada, así que tras cerrar sesión enseñaría los
 * datos de la pantalla anterior sin cookies. `pageshow` con `persisted` es el
 * único aviso de que eso acaba de pasar.
 */
export function useSessionSync() {
  React.useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      // `key` llega a `null` cuando se vacía el almacenamiento entero.
      if (event.key !== null && event.key !== SESSION_STORAGE_KEY) return;

      void followStoredSession();
    };

    const onPageShow = (event: PageTransitionEvent) => {
      if (event.persisted) void followStoredSession();
    };

    window.addEventListener("storage", onStorage);
    window.addEventListener("pageshow", onPageShow);

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("pageshow", onPageShow);
    };
  }, []);
}
