import { ApiResponseWithPagination, HttpRequestConfig } from "@/interfaces";
import { CategoryList, CreateCategoryParams, UpdateCategoryParams } from "../interfaces";

export interface CategoriesService {
    list(
        config?: HttpRequestConfig
    ): Promise<ApiResponseWithPagination<CategoryList[]>>;

    detail(
        id: string,
        config?: HttpRequestConfig
    ): Promise<ApiResponseWithPagination<CategoryList>>;

    create(
        payload: CreateCategoryParams,
        config?: HttpRequestConfig
    ): Promise<void>;

    update(
        id: string,
        payload: UpdateCategoryParams,
        config?: HttpRequestConfig
    ): Promise<void>;

    remove(id: string, config?: HttpRequestConfig): Promise<unknown>;
}