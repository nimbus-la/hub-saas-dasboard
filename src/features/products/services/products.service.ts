import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";

import type { ApiResponseWithPagination, HttpClient } from "@/interfaces";
import { DEFAULT_PAGE_SIZE, FIRST_PAGE, emptyPage, getNextPageNumber } from "@/lib/pagination";
import { ENDPOINTS, isUuid } from "@/utils";
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
    details: () => [...productKeys.all, "products_detail"] as const,
    detail: (productId: string) => [...productKeys.details(), productId] as const,
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

        // El backend no tiene ruta de detalle: el listado filtrado por id es
        // la forma de pedir un solo producto, y llega dentro de una página.
        //
        // Un id mal escrito no se envía. El backend lo rechazaría como una
        // petición inválida, y para quien abrió el enlace es un producto que
        // no existe, igual que un id válido que no está en su negocio.
        getById: async (productId, config) => {
            if (!isUuid(productId)) return null;

            const { content } = await http.get<ApiResponseWithPagination<ProductApiResponse[]> | null>(
                ENDPOINTS.PRODUCTS,
                {
                    ...config,
                    params: { ...config?.params, productId, pageSize: 1 }
                }
            );

            return content?.rows[0] ?? null;
        },

        create: (payload, config) =>
            http.post(ENDPOINTS.PRODUCTS_CREATE, payload, config),

        update: (payload, config) =>
            http.patch(ENDPOINTS.PRODUCTS_UPDATE, payload, config),

        delete: (payload, config) =>
            http.delete(ENDPOINTS.PRODUCTS_DELETE, payload, config),
    };
}


/**
 * Un producto para el formulario de edición. La ruta lo precarga en el
 * servidor con estas mismas opciones y la pantalla lo encuentra en la caché.
 */
export function productDetailQueryOptions(service: ProductsService, productId: string) {
    return queryOptions({
        queryKey: productKeys.detail(productId),
        queryFn: ({ signal }) => service.getById(productId, { signal }),
    });
}


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
