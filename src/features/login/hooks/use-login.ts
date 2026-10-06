"use client";

import React from "react";

import { useHttpClient } from "@/context";
import { notify } from "@/components";

import {
  LoginCredentials,
  LoginResponse,
  LoginService,
} from "../types/login.types";

import { createLoginService } from "../services/login.service";
import { HttpError } from "@/lib/http";

export function useLogin() {
  const http = useHttpClient();

  const service = React.useMemo<LoginService>(
    () => createLoginService(http),
    [http]
  );

  const [isLoading, setIsLoading] = React.useState(false);

  const login = async (
    credentials: LoginCredentials
  ): Promise<LoginResponse> => {
    setIsLoading(true);

    try {
      return await service.login(credentials);
    } catch (error) {
      if (error instanceof HttpError) {
        notify.error(
          error.api?.apiMessage ?? error.message
        );
      }

      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    login,
    isLoading,
  };
}