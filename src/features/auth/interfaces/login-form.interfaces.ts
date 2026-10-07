import type { LoginCredentials } from "./auth.interfaces";


export interface LoginFormProps {
    onSubmit: (credentials: LoginCredentials) => void;

    /**
     * El inicio de sesión está en curso.
     *
     * Llega de fuera y no del `isSubmitting` del formulario porque quien envía
     * es la mutación: el `onSubmit` vuelve al instante y el formulario creería
     * que ya terminó.
     */
    isPending: boolean;
}