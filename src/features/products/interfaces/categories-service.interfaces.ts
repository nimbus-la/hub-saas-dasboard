import { ApiEnvelope, ApiResponseWithPagination, HttpRequestConfig } from "@/interfaces";
import { CategoryList, CategoryListParams, CreateCategoryParams, UpdateCategoryParams } from "../interfaces";

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
