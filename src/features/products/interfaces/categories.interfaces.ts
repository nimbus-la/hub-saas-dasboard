import type { ApiEnvelope, ApiResponseWithPagination, HttpRequestConfig, PaginationParams } from "@/interfaces";


/** Categoría tal como la envía el backend. */
export interface CategoryListApiResponse {
    id: string;
    name: string;

    /** Es opcional porque muchas categorías no necesitan descripción. */
    description?: string;

    /** Indica si la categoría se ofrece hoy en la carta. */
    isActive: boolean;

    /** Fechas en formato ISO 8601. */
    updatedAt: string;
    createdAt: string;
}


/** Categoría ya convertida, que es la que usa la aplicación. */
export interface CategoryList {
    id: string;
    name: string;

    /** Queda vacía cuando la categoría no tiene descripción. */
    description: string;

    isActive: boolean;

    /** Fecha de la última actualización, ya formateada para mostrarse. */
    updatedAt: string;
}


/**
 * Datos para crear una categoría. No incluye el estado porque el backend crea
 * todas las categorías activas.
 */
export interface CreateCategoryParams {
    name: string;

    /** No se envía si está vacía. */
    description?: string;
}


/**
 * Datos para editar una categoría. El backend espera el id en el cuerpo, y el
 * estado solo se envía si cambió.
 */
export type UpdateCategoryParams = CreateCategoryParams & {
    categoryId: string;
    isActive?: boolean;
};


/**
 * Filtros del listado, con los mismos nombres que usa el backend. El texto se
 * busca en el nombre y en la descripción. Un filtro sin elegir no se envía,
 * porque el backend lo tomaría como un filtro vacío y no devolvería nada.
 */
export interface CategoryFilters {
    text?: string;

    /** Si es true trae solo activas, si es false solo inactivas, y si falta trae todas. */
    isActive?: boolean;
}


/**
 * Página y filtros juntos. Se usan como clave de caché, porque cada
 * combinación es una respuesta distinta del backend.
 */
export type CategoryListParams = PaginationParams & CategoryFilters;


/**
 * Operaciones disponibles sobre las categorías de productos. El servicio
 * toma sus tipos de aquí, así que cualquier cambio en una firma se hace en
 * este archivo.
 */
export interface CategoriesService {
    /**
     * Devuelve una página del listado con los filtros ya aplicados. La página
     * es obligatoria porque el backend no permite pedir todas las categorías
     * de una vez. El total que llega es el de los resultados filtrados.
     */
    list(
        params: CategoryListParams,
        config?: HttpRequestConfig
    ): Promise<ApiResponseWithPagination<CategoryList[]>>;

    /** Crea una categoría. El backend responde sin datos. */
    create(
        payload: CreateCategoryParams,
        config?: HttpRequestConfig
    ): Promise<ApiEnvelope<null>>;

    /** Actualiza una categoría. El backend responde sin datos. */
    update(
        payload: UpdateCategoryParams,
        config?: HttpRequestConfig
    ): Promise<ApiEnvelope<null>>;

    /** Elimina una categoría. El backend no devuelve datos al eliminar. */
    remove(config?: HttpRequestConfig): Promise<unknown>;
}
