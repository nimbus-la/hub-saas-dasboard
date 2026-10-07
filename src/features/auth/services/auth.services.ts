import { ApiEnvelope, HttpClient } from "@/interfaces";
import { ENDPOINTS } from "@/utils";

import { AuthService, LoginContentResponse, LoginCredentials } from "../interfaces";


export function createAuthService(http: HttpClient): AuthService {
    return {
        login: (credentials: LoginCredentials): Promise<ApiEnvelope<LoginContentResponse>> =>
            http.post<LoginContentResponse>(
                ENDPOINTS.AUTH_LOGIN,
                credentials,
                { skipAuthRefresh: true }
            ),
    }
}