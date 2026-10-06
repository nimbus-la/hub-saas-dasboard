import { HttpClient } from "@/interfaces";
import { ENDPOINTS } from "@/utils";

export function createLogoutService(httpClient: HttpClient) {
    return {
        logout: () =>
            httpClient.post<unknown>(ENDPOINTS.AUTH_LOGOUT, {}, {
                skipAuthRefresh: true,
            }),
    };
}
