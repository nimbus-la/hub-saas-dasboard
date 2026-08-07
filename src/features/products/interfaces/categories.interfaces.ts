export interface CategoryApiResponse {
    /** Identificador que publica el backend. Se muestra tal cual. */
    id: string;
    name: string;
    /**
     * Descripción para la carta.
     *
     * Opcional a propósito: la mayoría de las categorías se explican solas y
     * obligar a escribir una frase produce descripciones que repiten el
     * nombre.
     */
    description?: string;
    /** ¿Se ofrece hoy en la carta? */
    isActive: boolean;
    /**
     * Fecha de la última actualización, en ISO 8601.
     *
     * Opcional porque el backend todavía no la publica. Declararla obligatoria
     * sería mentirle al compilador: el tipo diría que siempre llega y en
     * ejecución llegaría `undefined`, que es justo el caso que el mapper tiene
     * que resolver.
     */
    placedAt?: string;
}


// respuesta mapeada
export interface Category {
    /** Identificador que publica el backend. Se muestra tal cual. */
    id: string;
    name: string;
    /**
     * Descripción para la carta.
     *
     * Opcional a propósito: la mayoría de las categorías se explican solas y
     * obligar a escribir una frase produce descripciones que repiten el
     * nombre.
     */
    description: string;
    /** ¿Se ofrece hoy en la carta? */
    isActive: boolean;
    placedAt: string; // ISO 8601
}


/**
 * Lo que se manda al **crear**.
 *
 * Sin `isActive`: el backend da de alta toda categoría como activa, y mandarlo
 * desde aquí sería duplicar esa regla en dos sitios que pueden discrepar. Que
 * el tipo ni siquiera admita el campo es más fuerte que acordarse de no
 * ponerlo — mandarlo pasa a ser un error de compilación.
 *
 * `id` y `placedAt` tampoco están: los pone el servidor.
 */
export interface CreateCategoryPayload {
    name: string;
    /** Se omite cuando está vacía: `""` significaría "guarda una vacía". */
    description?: string;
}


/**
 * Lo que se manda al **editar**: lo mismo, más el estado.
 *
 * Aquí `isActive` sí es obligatorio, y por eso son dos tipos y no uno con el
 * campo opcional. El interruptor del modal solo aparece al editar, así que este
 * es el único momento en que alguien decide sobre él; con un `isActive?`
 * compartido, olvidarlo en la llamada compilaría sin protestar y la categoría
 * se guardaría perdiendo su estado.
 */
export type UpdateCategoryPayload = CreateCategoryPayload & {
    estado: boolean;
};