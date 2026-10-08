"use client";

import { useRouter } from "next/navigation";

import { useMutation } from "@tanstack/react-query";

import { useHttpClient } from "@/context";
import { useAuthStore } from "@/store";
import { notify } from "@/components";
import { messages } from "@/messages";
import { getApiErrorMessage, isHttpError, resolveApiAlert } from "@/lib/http";

import { LoginCredentials } from "../interfaces";
import { createAuthService } from "../services";
import { toSession } from "../mappers";


const texts = messages.auth.login;


export function useLogin(redirectTo: string) {
  const http = useHttpClient();
  const router = useRouter();
  const startSession = useAuthStore((state) => state.startSession);

  const service = createAuthService(http);

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => service.login(credentials),

    // Cada intento abre su propio aviso y lo convierte en su resultado. Como
    // el id es nuevo en cada intento, los errores de intentos distintos se
    // apilan en vez de pisarse.
    onMutate: () => ({ alertId: notify.loading(texts.submitting) }),

    onSuccess: (envelope, _credentials, context) => {
      notify.success(resolveApiAlert(envelope)?.message ?? texts.success, { id: context.alertId });

      startSession(toSession(envelope.content));
      router.replace(redirectTo);
    },

    onError: (error, _credentials, context) => {
      const message = isHttpError(error) && error.isUnauthorized
        ? error.apiMessage ?? texts.invalidCredentials
        : getApiErrorMessage(error);

      // Sin contexto no llegó a abrirse el aviso de carga; el error sale solo.
      notify.error(message, context ? { id: context.alertId } : {});
    },

    // Los avisos de esta mutación los lleva el hook de principio a fin: si la
    // caché pusiera los suyos, saldrían duplicados junto al de carga.
    meta: { alertOnError: false, alertOnSuccess: false, globalLoading: false },
  })
}
