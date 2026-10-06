/**
 * Token de acceso de la sesión actual.
 *
 * Vive solo en memoria. El refresh token permanece en la cookie HttpOnly que
 * administra la API y se conectará en la siguiente fase de autenticación.
 */
let accessToken: string | null = null;

export function setAccessToken(token: string): void {
    accessToken = token;
}

export function getAccessToken(): string | undefined {
    return accessToken ?? undefined;
}

export function clearAccessToken(): void {
    accessToken = null;
}
