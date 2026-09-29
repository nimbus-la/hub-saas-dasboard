import { infiniteQueryOptions } from "@tanstack/react-query";

import type { ApiResponseWithPagination, HttpClient, PaginationParams } from "@/interfaces";
import { DEFAULT_PAGE_SIZE, FIRST_PAGE, emptyPage, getNextPageNumber } from "@/lib/pagination";
import { ENDPOINTS } from "@/utils";
import type { CategoriesService, CategoryFilters, CategoryListApiResponse, CategoryListParams } from "../interfaces";
import { toCategoryList } from "../mappers";

/**
 * Peticiones al backend para las categorías de productos. El cliente HTTP
 * llega por parámetro para poder usar este servicio tanto en el servidor como
 * en el navegador.
 */


/**
 * Página que se pide por defecto. El servidor y el navegador deben usar la
 * misma, si no la tabla vuelve a pedir el listado al cargar.
 */
export const DEFAULT_CATEGORIES_PAGINATION: PaginationParams = {
    pageNumber: FIRST_PAGE,
    pageSize: DEFAULT_PAGE_SIZE,
};


/**
 * Categorías por tanda en las pestañas del listado y en el selector del alta.
 * Ocho caben enteras en un carril de escritorio y desbordan el panel del
 * selector, así que en los dos casos la siguiente llega al desplazar.
 */
export const CATEGORY_BATCH_SIZE = 8;


/**
 * Filtro de las pestañas y del selector: solo tiene sentido filtrar o crear
 * productos con una categoría activa. Las precargas del servidor usan la misma
 * constante para que el navegador encuentre la primera tanda en la caché, y
 * como la clave es la misma, pestañas y selector la comparten.
 */
export const ACTIVE_CATEGORY_FILTERS: CategoryFilters = { isActive: true };


/**
 * Claves de caché de las categorías. Están aquí porque la página del servidor
 * también las necesita. Cada combinación de página y filtros guarda su propia
 * respuesta.
 *
 * Las del scroll infinito cuelgan también de `lists()`: así, al crear o editar
 * una categoría, la misma invalidación refresca la tabla y las pestañas.
 */
export const categoryKeys = {
    all: ["products_categories"] as const,
    lists: () => [...categoryKeys.all, "products_categories_list"] as const,
    list: (params: CategoryListParams) => [...categoryKeys.lists(), params] as const,
    infinite: (filters: CategoryFilters) => [...categoryKeys.lists(), "infinite", filters] as const,
};


export function createCategoriesService(http: HttpClient): CategoriesService {
    return {
        list: async (params, config) => {
            const { content } = await http.get<ApiResponseWithPagination<CategoryListApiResponse[]> | null>(
                ENDPOINTS.PRODUCTS_CATEGORY,
                {
                    ...config,
                    params: { ...config?.params, ...params }
                }
            );

            // Sin resultados el backend no manda página.
            const page = content ?? emptyPage(params);

            // Solo se convierten las filas. El total se deja igual porque la
            // tabla lo usa para saber cuántas páginas hay.
            return { ...page, rows: toCategoryList(page.rows) };
        },

        create: (payload, config) =>
            http.post(ENDPOINTS.PRODUCTS_CATEGORY, payload, config),

        update: (payload, config) =>
            http.patch(ENDPOINTS.PRODUCTS_CATEGORY_UPDATE, payload, config),
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


/**
 * Categorías en tandas para las pestañas del listado y el selector del alta,
 * con la misma forma que el scroll infinito de productos. Compartida con el
 * servidor para que la precarga y el navegador usen la misma clave.
 */
export function categoriesInfiniteQueryOptions(
    service: CategoriesService,
    filters: CategoryFilters = ACTIVE_CATEGORY_FILTERS
) {
    return infiniteQueryOptions({
        queryKey: categoryKeys.infinite(filters),
        queryFn: ({ pageParam, signal }) =>
            service.list({ ...filters, pageNumber: pageParam, pageSize: CATEGORY_BATCH_SIZE }, { signal }),
        initialPageParam: FIRST_PAGE,
        getNextPageParam: getNextPageNumber,
    });
}
