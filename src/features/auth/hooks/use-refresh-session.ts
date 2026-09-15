"use client";

import React from "react";
import { useHttpClient } from "@/context";
import { notify } from "@/components";
import {
  RefreshSessionResponse,
  RefreshSessionService,
} from "../types/refresh-session.types";
import { createRefreshSessionService } from "../services/refresh-session.service";
import { HttpError } from "@/lib/http";
import { useAuthStore } from "@/store/auth/auth.store";

let refreshPromise: Promise<RefreshSessionResponse> | null = null;

export function useRefreshSession() {
  const http = useHttpClient();

  const updateSessionExpiration = useAuthStore(
    (state) => state.updateSessionExpiration
  );

  const service = React.useMemo<RefreshSessionService>(
    () => createRefreshSessionService(http),
    [http],
  );

  const [isLoading, setIsLoading] = React.useState(false);

  const refresh = async (): Promise<RefreshSessionResponse> => {
    if (refreshPromise) {
      return refreshPromise;
    }

    setIsLoading(true);

    refreshPromise = service
      .refresh()
      .then((response) => {
        updateSessionExpiration(
          response.content.expiredAt,
          response.content.refreshExpiresAt
        );

        return response;
      })
      .catch((error) => {
        if (error instanceof HttpError) {
          notify.error(error.api?.apiMessage ?? error.message);
        }

        throw error;
      })
      .finally(() => {
        refreshPromise = null;
        setIsLoading(false);
      });

    return refreshPromise;
  };

  return {
    refresh,
    isLoading,
  };
}