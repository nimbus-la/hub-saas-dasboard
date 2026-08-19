import type { PaginationParams } from "@/interfaces";


export interface CategoryListApiResponse {
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
    updatedAt: string;
    createdAt: string;
}


// respuesta mapeada
export interface CategoryList {
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
    updatedAt: string; // ISO 8601
}


/**
 * Lo que se manda al crear una categoría.
 *
 * Sin `isActive`: el backend da de alta toda categoría como activa, y mandarlo
 * desde aquí sería duplicar esa regla en dos sitios que pueden discrepar. Que
 * el tipo ni siquiera admita el campo es más fuerte que acordarse de no
 * ponerlo — mandarlo pasa a ser un error de compilación.
 *
 * `id` y `placedAt` tampoco están: los pone el servidor.
 */
export interface CreateCategoryParams {
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
export type UpdateCategoryParams = CreateCategoryParams & {
    isActive?: boolean;
};

/* -------------------------------------------------------------------------- */
/*  Consulta del listado                                                       */
/* -------------------------------------------------------------------------- */

/**
 * Filtros que entiende el backend.
 *
 * Los nombres son los suyos: `text` para el texto libre —que él busca en el
 * nombre **y** en la descripción, por eso es uno y no dos— e `isActive` para el
 * estado.
 *
 * Los dos son opcionales y se construyen **por omisión**: un filtro sin elegir
 * no se manda vacío. `?text=` o `?isActive=` no significan "sin filtro" para el
 * backend, significan "filtra por cadena vacía", y devolverían cero resultados.
 * De traducir la pantalla a esta forma se encarga `toCategoryFilters`.
 */
export interface CategoryFilters {
    /** Texto libre. Ya recortado; si no hay nada que buscar, no está la clave. */
    text?: string;

    /** `true` sólo activas, `false` sólo inactivas, ausente ambas. */
    isActive?: boolean;
}


/**
 * Todo lo que define una página del listado: qué trozo y de qué resultados.
 *
 * Van juntos en un solo objeto porque juntos son la identidad de la respuesta,
 * y es exactamente lo que tiene que entrar en la clave de caché: la página 2 de
 * "café" no tiene nada que ver con la página 2 sin filtros.
 */
export type CategoryListParams = PaginationParams & CategoryFilters;
