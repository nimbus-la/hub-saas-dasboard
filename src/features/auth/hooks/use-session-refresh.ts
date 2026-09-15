"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/auth/auth.store";
import { useRefreshSession } from "./use-refresh-session";

const REFRESH_BEFORE_EXPIRATION_MS = 60 * 1000;

export function useSessionRefresh() {
  const expiredAt = useAuthStore((state) => state.expiredAt);
  const refreshExpiresAt = useAuthStore((state) => state.refreshExpiresAt);

  const { refresh } = useRefreshSession();

  useEffect(() => {
    if (!expiredAt || !refreshExpiresAt) {
      return;
    }

    const expirationTime = new Date(expiredAt).getTime();
    const refreshTime = expirationTime - REFRESH_BEFORE_EXPIRATION_MS;

    const delay = refreshTime - Date.now();

    if (delay <= 0) {
      refresh().catch(() => {});

      return;
    }

    const timeoutId = window.setTimeout(() => {
      refresh().catch(() => {});
    }, delay);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [expiredAt, refreshExpiresAt, refresh]);
}
