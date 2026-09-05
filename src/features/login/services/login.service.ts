import { ENDPOINTS } from "@/utils";
import { LoginCredentials, LoginResponse } from "../types/login.types";

const API_URL = process.env["NEXT_PUBLIC_API_URL"];

export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await fetch(`${API_URL}/${ENDPOINTS.AUTH_LOGIN}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Error al iniciar sesión");
    }

    return data as LoginResponse;
}