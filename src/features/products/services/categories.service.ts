import type { ApiResponseWithPagination, HttpClient, HttpRequestConfig, PaginationParams } from "@/interfaces";
import { DEFAULT_PAGE_SIZE, FIRST_PAGE } from "@/lib/pagination";
import { ENDPOINTS } from "@/utils";
import type { CategoriesService, CategoryListApiResponse, CategoryListParams } from "../interfaces";
import { toCategoryList } from "../mappers";

/**
 * Peticiones al backend para las categorías de productos. El cliente HTTP
 * llega por parámetro para poder usar este servicio tanto en el servidor como
 * en el navegador.
 */


/**
 * Agrega la página y los filtros a la URL. No hace falta renombrarlos porque
 * ya se llaman igual que en el backend.
 */
const withListParams = (
    params: CategoryListParams,
    config?: HttpRequestConfig
): HttpRequestConfig => ({
    ...config,
    params: { ...config?.params, ...params },
});


/**
 * Página que se pide por defecto. El servidor y el navegador deben usar la
 * misma, si no la tabla vuelve a pedir el listado al cargar.
 */
export const DEFAULT_CATEGORIES_PAGINATION: PaginationParams = {
    pageNumber: FIRST_PAGE,
    pageSize: DEFAULT_PAGE_SIZE,
};


/**
 * Claves de caché de las categorías. Están aquí porque la página del servidor
 * también las necesita. Cada combinación de página y filtros guarda su propia
 * respuesta.
 */
export const categoryKeys = {
    all: ["products_categories"] as const,
    lists: () => [...categoryKeys.all, "products_categories_list"] as const,
    list: (params: CategoryListParams) => [...categoryKeys.lists(), params] as const,
};


export function createCategoriesService(http: HttpClient): CategoriesService {
    return {
        list: async (params, config) => {
            const { content } = await http.get<ApiResponseWithPagination<CategoryListApiResponse[]>>(
                ENDPOINTS.PRODUCTS_CATEGORY,
                withListParams(params, config)
            );

            // Solo se convierten las filas. El total se deja igual porque la
            // tabla lo usa para saber cuántas páginas hay.
            return { ...content, rows: toCategoryList(content.rows) };
        },

        create: (payload, config) =>
            http.post(ENDPOINTS.PRODUCTS_CATEGORY, payload, config),

        update: (payload, config) =>
            http.patch(ENDPOINTS.PRODUCTS_CATEGORY_UPDATE, payload, config),

        // El backend no devuelve datos al eliminar.
        remove: (config) =>
            http.delete("Aqui va la url del servicio de eliminar categoria", config),
    };
}


/**
 * Configuración del listado para TanStack Query. El servidor y el navegador la
 * usan para que la clave de caché sea la misma. Si la consulta se cancela,
 * también se cancela la petición.
 */
export function categoriesQueryOptions(
    service: CategoriesService,
    params: CategoryListParams = DEFAULT_CATEGORIES_PAGINATION
) {
    return {
        queryKey: categoryKeys.list(params),
        queryFn: ({ signal }: { signal: AbortSignal }) =>
            service.list(params, { signal }),
    };
}
