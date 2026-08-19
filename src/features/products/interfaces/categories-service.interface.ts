import { ApiResponseWithPagination, HttpRequestConfig } from "@/interfaces";
import { CategoryList, CreateCategoryParams, UpdateCategoryPayload } from "../interfaces";

export interface CategoriesService {
    list(
        config?: HttpRequestConfig
    ): Promise<ApiResponseWithPagination<CategoryList[]>>;

    detail(
        id: string,
        config?: HttpRequestConfig
    ): Promise<CategoryList>;

    create(
        payload: CreateCategoryParams,
        config?: HttpRequestConfig
    ): Promise<ApiResponseWithPagination<null>>;

    update(
        id: string,
        payload: UpdateCategoryPayload,
        config?: HttpRequestConfig
    ): Promise<{ data: CategoryList; message: string }>;
    remove(id: string, config?: HttpRequestConfig): Promise<unknown>;
}