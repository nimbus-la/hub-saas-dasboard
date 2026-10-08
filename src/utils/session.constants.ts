import { StoredAuthSession } from "@/interfaces";

export const SESSION_COOKIES = {
    ACCESS_TOKEN: "jwt_access",
    REFRESH_TOKEN: "jwt_refresh"
} as const;


export const SESSION_STORAGE_KEY = "vorea-auth";


export const LOGIN_HREF = "/login";


export const DEFAULT_HOME_HREF = "/dashboard";


export const NO_SESSION_DATA: StoredAuthSession = {
    user: null,
    accessExpiresAt: null,
    refreshExpiresAt: null
}