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