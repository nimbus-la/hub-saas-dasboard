/**
 * Sobre de respuesta del backend
 *
 * Este backend no devuelve el recurso pelado: lo envuelve junto a un estado, un
 * código y unos mensajes. Todas sus rutas responden con esta forma, así que es
 * una característica del **transporte** y no del dominio de categorías, de
 * productos ni de ventas.
 *
 * De ahí que el desenvuelto viva en `EnvelopeHttpClient` y no en cada servicio.
 * Si cada uno hiciera su `.data`, serían cuarenta sitios donde repetirlo y
 * cuarenta donde olvidarlo — y olvidarlo no da un error de compilación, da un
 * `undefined` que revienta tres capas más arriba.
 */


/**
 * Estado declarado por el backend.
 *
 * Es informativo. Quien decide si la operación salió bien es `code`: un
 * `WARNING` puede acompañar perfectamente a una respuesta correcta.
 */
export type ApiStatus = "SUCCESS" | "ERROR" | "INFO" | "WARNING";


export interface ApiEnvelope<TData> {
    status: ApiStatus;

    /**
     * Código de resultado. `"0000"` es éxito; cualquier otro es un fallo.
     *
     * Es una cadena y no un número a propósito del backend: los ceros a la
     * izquierda son significativos y `0000` como número sería `0`.
     */
    code: string;

    /**
     * Código HTTP que el backend considera equivalente.
     *
     * Puede no coincidir con el de la respuesta real: hay backends que
     * responden `200 OK` con `httpStatus: 422` dentro. Cuando el sobre indica
     * fallo, éste es el estado que se propaga en el `HttpError`, porque
     * describe el problema mejor que el `200` del sobre.
     */
    httpStatus: number;

    /** Mensajes para la interfaz. Puede venir como lista o como texto suelto. */
    messages?: string[] | string;

    /** El recurso de verdad: objeto, lista o `null`. */
    data: TData;
}
