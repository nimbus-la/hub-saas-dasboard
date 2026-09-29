import { infiniteQueryOptions } from "@tanstack/react-query";

import type { ApiResponseWithPagination, HttpClient } from "@/interfaces";
import { DEFAULT_PAGE_SIZE, FIRST_PAGE, emptyPage } from "@/lib/pagination";
import type { Product } from "@/lib/products";
import { ENDPOINTS } from "@/utils";
import type { ProductApiResponse, ProductFilters, ProductsService } from "../interfaces";
import { toProductList } from "../mappers";

/**
 * Peticiones al backend para el catálogo de productos. Igual que en
 * categorías, el cliente HTTP llega por parámetro para servir al servidor y
 * al navegador.
 */


/**
 * Productos por página del scroll infinito. Doce llena sin huecos las rejillas
 * de tres y cuatro columnas, así que cada tanda cierra filas completas.
 */
export const PRODUCTS_PAGE_SIZE = DEFAULT_PAGE_SIZE;


/**
 * Sin filtros. La precarga del servidor y el listado usan la misma constante
 * para que el navegador encuentre los datos en la caché.
 */
export const NO_PRODUCT_FILTERS: ProductFilters = {};


/**
 * Claves de caché de los productos. Cada combinación de filtros guarda sus
 * páginas juntas; la página no entra en la clave porque la lleva la consulta.
 */
export const productKeys = {
    all: ["products"] as const,
    lists: () => [...productKeys.all, "products_list"] as const,
    list: (filters: ProductFilters) => [...productKeys.lists(), filters] as const,
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


/**
 * La siguiente página, o `undefined` cuando ya se trajeron todas. Se decide
 * con el total y no con una página a medias porque la última puede llegar
 * exactamente llena.
 */
const getNextPageNumber = ({ pageNumber, pageSize, total }: ApiResponseWithPagination<Product[]>) =>
    pageNumber * pageSize < total ? pageNumber + 1 : undefined;


/** Configuración del listado para TanStack Query, compartida con el servidor. */
export function productsInfiniteQueryOptions(
    service: ProductsService,
    filters: ProductFilters = NO_PRODUCT_FILTERS
) {
    return infiniteQueryOptions({
        queryKey: productKeys.list(filters),
        queryFn: ({ pageParam, signal }) =>
            service.list({ ...filters, pageNumber: pageParam, pageSize: PRODUCTS_PAGE_SIZE }, { signal }),
        initialPageParam: FIRST_PAGE,
        getNextPageParam: getNextPageNumber,
    });
}
