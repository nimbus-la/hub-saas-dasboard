import { ApiEnvelope } from "@/interfaces";

export interface RefreshSessionContent {
  sessionToken: string;
  expiredAt: string;
  refreshExpiresAt: string;
}
export type RefreshSessionResponse = ApiEnvelope<RefreshSessionContent>;
export interface RefreshSessionService {
  refresh(): Promise<RefreshSessionResponse>;
}
