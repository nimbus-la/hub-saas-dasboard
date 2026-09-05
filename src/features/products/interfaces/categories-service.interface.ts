import { ApiEnvelope, ApiResponseWithPagination, HttpRequestConfig } from "@/interfaces";
import { CategoryList, CategoryListParams, CreateCategoryParams, UpdateCategoryParams } from "../interfaces";

export interface CategoriesService {
    /**
     * Una página del listado, con los filtros ya aplicados por el backend.
     *
     * La paginación es obligatoria y va aparte de `config`: pedir "todas las
     * categorías" no es una opción que este servicio ofrezca, porque tampoco la
     * ofrece el backend. Los filtros son opcionales; los que no aplican no se
     * mandan. El contenido que devuelve trae `total` —el de los resultados, no
     * el del catálogo—, que es de donde sale el número de páginas del pie.
     */
    list(
        params: CategoryListParams,
        config?: HttpRequestConfig
    ): Promise<ApiResponseWithPagination<CategoryList[]>>;

    /** Una categoría suelta. No pagina: su `content` es la categoría. */
    detail(
        id: string,
        config?: HttpRequestConfig
    ): Promise<CategoryList>;

    create(
        payload: CreateCategoryParams,
        config?: HttpRequestConfig
    ): Promise<ApiEnvelope<null>>;

    update(
        id: string,
        payload: UpdateCategoryParams,
        config?: HttpRequestConfig
    ): Promise<ApiEnvelope<null>>;

    remove(id: string, config?: HttpRequestConfig): Promise<unknown>;
}