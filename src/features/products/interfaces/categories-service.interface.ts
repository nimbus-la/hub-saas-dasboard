import { ApiEnvelope, ApiResponseWithPagination, HttpRequestConfig, PaginationParams } from "@/interfaces";
import { CategoryList, CreateCategoryParams, UpdateCategoryParams } from "../interfaces";

export interface CategoriesService {
    /**
     * Una página del listado.
     *
     * La paginación es obligatoria y va aparte de `config`: pedir "todas las
     * categorías" no es una opción que este servicio ofrezca, porque tampoco la
     * ofrece el backend. El sobre que devuelve trae `total`, que es de donde
     * sale el número de páginas del pie.
     */
    list(
        pagination: PaginationParams,
        config?: HttpRequestConfig
    ): Promise<ApiResponseWithPagination<CategoryList[]>>;

    detail(
        id: string,
        config?: HttpRequestConfig
    ): Promise<ApiResponseWithPagination<CategoryList>>;

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