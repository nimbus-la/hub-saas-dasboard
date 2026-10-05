import { queryOptions } from "@tanstack/react-query";

import type { ApiResponseWithPagination, HttpClient, HttpRequestConfig } from "@/interfaces";
import { FIRST_PAGE, emptyPage, getTotalPages } from "@/lib/pagination";
import { ENDPOINTS } from "@/utils";
import type { InventoryFilters, InventoryItemApiResponse, InventoryService } from "../interfaces";
import { toIngredientList } from "../mappers";

/**
 * Peticiones al backend para el inventario de insumos. Igual que los demás
 * servicios, el cliente HTTP llega por parámetro.
 */


/**
 * Insumos por petición. Es el máximo que acepta el backend: como no busca por
 * texto, el inventario se trae entero y cuantas menos vueltas, mejor.
 */
export const INVENTORY_PAGE_SIZE = 100;


/** Sin filtros: el inventario de todo el inquilino. */
export const NO_INVENTORY_FILTERS: InventoryFilters = {};


/** Claves de caché del inventario. */
export const inventoryKeys = {
    all: ["inventory"] as const,
    items: (filters: InventoryFilters) => [...inventoryKeys.all, "inventory_items", filters] as const,
};


export function createInventoryService(http: HttpClient): InventoryService {
    const listPage = async (
        pageNumber: number,
        filters: InventoryFilters,
        config?: HttpRequestConfig
    ): Promise<ApiResponseWithPagination<InventoryItemApiResponse[]>> => {
        const pagination = { pageNumber, pageSize: INVENTORY_PAGE_SIZE };

        const { content } = await http.get<ApiResponseWithPagination<InventoryItemApiResponse[]> | null>(
            ENDPOINTS.INVENTORY_ITEMS,
            {
                ...config,
                params: { ...config?.params, ...filters, ...pagination }
            }
        );

        // Sin resultados el backend no manda página.
        return content ?? emptyPage(pagination);
    };

    return {
        listAll: async (filters = NO_INVENTORY_FILTERS, config) => {
            // La primera página dice cuántas faltan; el resto se pide a la vez.
            const first = await listPage(FIRST_PAGE, filters, config);
            const totalPages = getTotalPages(first.total, INVENTORY_PAGE_SIZE);

            const rest = await Promise.all(
                Array.from({ length: totalPages - 1 }, (_, offset) =>
                    listPage(FIRST_PAGE + offset + 1, filters, config)
                )
            );

            return toIngredientList([first, ...rest].flatMap((page) => page.rows));
        },
    };
}


/** Configuración del inventario para TanStack Query. */
export function inventoryQueryOptions(
    service: InventoryService,
    filters: InventoryFilters = NO_INVENTORY_FILTERS
) {
    return queryOptions({
        queryKey: inventoryKeys.items(filters),
        queryFn: ({ signal }) => service.listAll(filters, { signal }),
    });
}
