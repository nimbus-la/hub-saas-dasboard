import type { ApiResponseWithPagination, HttpClient } from "@/interfaces";
import { DEFAULT_PAGE_SIZE, FIRST_PAGE, emptyPage } from "@/lib/pagination";
import { ENDPOINTS } from "@/utils";
import type { ProductApiResponse, ProductListParams, ProductsService } from "../interfaces";
import { toProductList } from "../mappers";

/**
 * Peticiones al backend para el catálogo de productos. Igual que en
 * categorías, el cliente HTTP llega por parámetro para servir al servidor y
 * al navegador.
 */


/**
 * Primera página sin filtros. La precarga del servidor y el listado usan la
 * misma para que el navegador encuentre los datos en la caché.
 */
export const DEFAULT_PRODUCTS_PARAMS: ProductListParams = {
    pageNumber: FIRST_PAGE,
    pageSize: DEFAULT_PAGE_SIZE,
};


/** Claves de caché de los productos. Cada página y filtro guarda su respuesta. */
export const productKeys = {
    all: ["products"] as const,
    lists: () => [...productKeys.all, "products_list"] as const,
    list: (params: ProductListParams) => [...productKeys.lists(), params] as const,
};


export function createProductsService(http: HttpClient): ProductsService {
    return {
        list: async (params, config) => {
            const { content } = await http.get<ApiResponseWithPagination<ProductApiResponse[]> | null>(
                ENDPOINTS.PRODUCTS,
                {
                    ...config,
                    params: { ...config?.params, ...params }
                }
            );

            // Sin resultados el backend no manda página.
            const page = content ?? emptyPage(params);

            return { ...page, rows: toProductList(page.rows) };
        },
    };
}


/** Configuración del listado para TanStack Query, compartida con el servidor. */
export function productsQueryOptions(
    service: ProductsService,
    params: ProductListParams = DEFAULT_PRODUCTS_PARAMS
) {
    return {
        queryKey: productKeys.list(params),
        queryFn: ({ signal }: { signal: AbortSignal }) =>
            service.list(params, { signal }),
    };
}
