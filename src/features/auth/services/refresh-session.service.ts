import { HttpClient } from "@/interfaces";
import { RefreshSessionContent, RefreshSessionService } from "../types/refresh-session.types";
import { ENDPOINTS } from "@/utils";

export function createRefreshSessionService(
  httpClient: HttpClient,
): RefreshSessionService {
  return {
    refresh: () =>
      httpClient.post<RefreshSessionContent>(ENDPOINTS.AUTH_REFRESH, {}),
  };
}
