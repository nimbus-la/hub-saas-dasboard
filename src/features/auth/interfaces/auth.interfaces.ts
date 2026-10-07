import { ApiEnvelope, SessionExpiration, UserData } from "@/interfaces";

export interface LoginCredentials {
    tenantSlug: string;
    username: string;
    password: string;
}


export interface LoginContentResponse extends SessionExpiration {
    lastLogin: string;
    user: UserData;
}


export interface AuthService {
    login: (credentials: LoginCredentials) => Promise<ApiEnvelope<LoginContentResponse>>;
}