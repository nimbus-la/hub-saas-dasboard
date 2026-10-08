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

    onSuccess: (envelope) => {
      notify.success(resolveApiAlert(envelope)?.message ?? texts.success);

      startSession(toSession(envelope.content));
      router.replace(redirectTo);
    },

    onError: (error) => {
      const message = isHttpError(error) && error.isUnauthorized
        ? error.apiMessage ?? texts.invalidCredentials
        : getApiErrorMessage(error);

      notify.error(message);
    },

    // La espera la enseña el loader global, como en el resto del panel. Los
    // avisos de éxito y error los pone el hook porque el 401 aquí no es una
    // sesión caducada sino credenciales malas, y necesita su propio texto.
    meta: { alertOnError: false, alertOnSuccess: false, loadingMessage: texts.submitting },
  })
}
