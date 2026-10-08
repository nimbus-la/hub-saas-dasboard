"use client";

import React from "react";

import { useAuthStore } from "@/store";


/**
 * Borra del almacenamiento la sesión que quedó de una visita anterior.
 *
 * Si la sesión caduca con la pestaña cerrada, nadie llama a `/auth/logout` y
 * el nombre, el rol y los ids del usuario se quedan en `localStorage`. En un
 * equipo compartido los vería quien lo use después.
 *
 * Es seguro hacerlo al cargar el login: el proxy solo lo deja ver sin
 * ninguna cookie de sesión, y como las cookies son de todo el navegador,
 * ninguna otra pestaña puede tener una sesión válida que esto le quite. Las
 * que sigan abiertas reciben el cambio por `useSessionSync` y vuelven al login.
 *
 * Solo al montar: después, lo que entra en el store es la sesión nueva que
 * acaba de abrir el formulario.
 */
export function useDiscardStaleSession() {
  React.useEffect(() => {
    const { user, clearSession } = useAuthStore.getState();

    if (user !== null) clearSession();
  }, []);
}
