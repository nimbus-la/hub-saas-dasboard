import { Nullable } from "../generic-types.interfaces";

export type RolScope = "ADMINISTRATIVE" | "OPERATIONAL";


export interface UserData {
    tenantId: string;
    branchId: string | null;
    userId: string;
    rolName: string;
    rolScope: RolScope;
    userName: string;
    firstName: string;
    secondName: string | null;
    firstLastName: string;
    secondLastName: string | null;
    sex: string;
}


export interface SessionExpiration {
    accessExpiresAt: string;
    refreshExpiresAt: string;
}


export interface AuthSession extends SessionExpiration {
    user: UserData;
}


export type StoredAuthSession = Nullable<AuthSession>;


export interface AuthState extends StoredAuthSession {
    startSession: (session: AuthSession) => void;
    updateSession: (expiration: SessionExpiration) => void;
    clearSession: () => void;
}



export interface SessionManager {
    refreshSession: () => Promise<void>;
    /** El usuario cierra sesión: vuelve al login sin recordar dónde estaba. */
    closeSession: () => Promise<void>;

    /** La sesión caducó: vuelve al login recordando la pantalla en `from`. */
    expireSession: () => Promise<void>;
}