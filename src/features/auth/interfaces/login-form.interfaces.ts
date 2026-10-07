import type { LoginCredentials } from "./auth.interfaces";


export interface LoginFormProps {
    /**
     * Envía las credenciales y se resuelve cuando el backend contesta.
     *
     * Devuelve la promesa para que el formulario sepa cuándo terminó y si
     * falló: con eso mantiene el botón bloqueado mientras dura la petición y
     * devuelve el foco a la contraseña tras un rechazo. El aviso del error no
     * es asunto suyo, lo da el hook.
     */
    onSubmit: (credentials: LoginCredentials) => Promise<unknown>;
}
