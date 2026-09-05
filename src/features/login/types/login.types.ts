import type { ApiEnvelopeContent, HttpRequestConfig } from "@/interfaces";

export interface LoginCredentials {
    tenantSlug: string;
    username: string;
    password: string;
}

export interface LoginUser {
    tenantId: string;
    branchId: string | null;
    userId: string;
    rolName: string;
    rolScope: string;
    userName: string;
    firstName: string;
    secondName: string | null;
    firstLastName: string;
    secondLastName: string | null;
    sex: string;
}

export interface LoginContent {
    sessionToken: string;
    expiredAt: string;
    refreshToken: string;
    refreshExpiresAt: string;
    lastLogin: string;
    user: LoginUser;
}

export type LoginResponse = ApiEnvelopeContent<LoginContent>;

export interface LoginService {
    login(
        credentials: LoginCredentials,
        config?: HttpRequestConfig
    ): Promise<LoginResponse>;
}