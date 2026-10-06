import type { RefreshSessionResponse } from "@/features/auth/types/refresh-session.types";
import { clearAccessToken, setAccessToken } from "./access-token";

type RefreshRequest = () => Promise<RefreshSessionResponse>;
type SessionExpired = () => void;

export function createSessionManager(
  refreshRequest: RefreshRequest,
  onSessionExpired?: SessionExpired,
) {
  let refreshPromise: Promise<string> | null = null;

  const refreshAccessToken = async (): Promise<string> => {
    if (refreshPromise) {
      return refreshPromise;
    }

    refreshPromise = refreshRequest()
      .then((response) => {
        const token = response.content.sessionToken;

        setAccessToken(token);

        return token;
      })
      .finally(() => {
        refreshPromise = null;
      });

    return refreshPromise;
  };

    const clearSession = (): void => {
      clearAccessToken();
      onSessionExpired?.();
    };

  return {
    refreshAccessToken,
    clearSession,
  };
}
