"use client";

import React from "react";
import { useRouter } from "next/navigation";

import { useMutation } from "@tanstack/react-query";

import { useHttpClient } from "@/context";
import { useAuthStore } from "@/store";
import { notify } from "@/components";
import { messages } from "@/messages";
import { getApiErrorMessage, isHttpError } from "@/lib/http";

import { AuthService, LoginCredentials } from "../interfaces";
import { createAuthService } from "../services";
import { toSession } from "../mappers";


export function useLogin() {
  const http = useHttpClient();
  const router = useRouter();
  const startSession = useAuthStore((state) => state.startSession);

  const service = React.useMemo<AuthService>(
    () => createAuthService(http),
    [http]
  );

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => service.login(credentials),

    onSuccess: ({ content }) => {
      startSession(toSession(content));
      router.replace("/dashboard");
    },

    onError: (error) => {
      const message = isHttpError(error) && error.isUnauthorized
        ? error.apiMessage ?? messages.auth.login.invalidCredentials
        : getApiErrorMessage(error);

      notify.error(message);
    },

    meta: { alertOnError: false, alertOnSuccess: false },
  })
}