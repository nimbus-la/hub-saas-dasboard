import { ENDPOINTS } from "@/utils";
import { LoginContent, LoginCredentials, LoginService } from "../types/login.types";
import { HttpClient, HttpRequestConfig } from "@/interfaces";

export function createLoginService(httpClient: HttpClient): LoginService {
    return {
        login: (credentials: LoginCredentials, config?: HttpRequestConfig) => 
        httpClient.post<LoginContent>(ENDPOINTS.AUTH_LOGIN, credentials, config)
    };
}