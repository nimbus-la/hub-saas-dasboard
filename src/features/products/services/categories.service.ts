import type { ApiEnvelope, ApiResponseWithPagination, HttpClient, HttpRequestConfig, PaginationParams } from "@/interfaces";
import { DEFAULT_PAGE_SIZE, FIRST_PAGE } from "@/lib/pagination";
import { ENDPOINTS } from "@/utils";
import type { CategoriesService, CategoryList, CategoryListApiResponse, CategoryListParams, CreateCategoryParams, UpdateCategoryParams } from "../interfaces";
import { toCategory, toCategoryList } from "../mappers";


/**
 * Acceso HTTP a las categorías de productos.
 *
 * Aquí se resuelve qué método y qué ruta corresponden a cada operación, y se
 * traduce la respuesta del backend al modelo del dominio. Las rutas salen de
 * `ENDPOINTS`.
 *
 * El cliente HTTP entra por parámetro en vez de importarse, así el mismo
 * servicio vale para un Server Component y para un hook. El archivo no lleva
 * `"use client"` ni importa React o TanStack Query porque la ruta lo usa desde
 * el servidor para precargar el listado.
 */



/**
 * Inquilino fijo, provisional.
 *
 * Está fuera de los métodos para que sea fácil de encontrar el día que exista
 * `useTenantId()` o el store equivalente: entonces el valor entrará por
 * parámetro o por la cabecera del interceptor y esta constante desaparece.
 */
const TENANT_ID = "019ff7ac-76bf-76ac-891e-ac1fc352d13e";


/*
 * El backend espera el inquilino en la query cuando la petición no lleva cuerpo
 * y dentro del cuerpo cuando sí lo lleva. Estos dos ayudantes evitan tener que
 * recordarlo en cada método: si se olvidara, el endpoint no fallaría, sólo
 * devolvería datos vacíos o de otro inquilino.
 */

/** Inquilino en la query string, para `GET` y `DELETE`. */
const withTenantParam = (config?: HttpRequestConfig): HttpRequestConfig => ({
    ...config,
    params: { ...config?.params, tenantId: TENANT_ID },
});

/**
 * Inquilino dentro del cuerpo, para `POST` y `PATCH`.
 *
 * Se añade aquí y no en `CreateCategoryPayload` porque ese tipo describe lo que
 * decide el formulario, y el inquilino no se elige en pantalla.
 */
const withTenantBody = <TPayload extends object>(
    payload: TPayload
): TPayload & { tenantId: string } => ({
    ...payload,
    tenantId: TENANT_ID,
});


/**
 * Página y filtros como parámetros de la petición.
 *
 * Se vuelcan con un spread porque `CategoryListParams` ya usa los nombres del
 * backend (`pageNumber`, `pageSize`, `text`, `isActive`) y no hay nada que
 * traducir. Los filtros que no aplican no están en el objeto, así que tampoco
 * llegan a la URL.
 */
const withListParams = (
    params: CategoryListParams,
    config?: HttpRequestConfig
): HttpRequestConfig => ({
    ...config,
    params: { ...config?.params, ...params },
});


/**
 * La página que se pide cuando nadie indica otra cosa.
 *
 * La comparten la precarga del servidor y el primer render del navegador, y
 * tiene que ser la misma en los dos: la paginación forma parte de la clave de
 * caché, así que con valores distintos la hidratación no encontraría nada y la
 * tabla volvería a pedir el listado al cargar.
 */
export const DEFAULT_CATEGORIES_PAGINATION: PaginationParams = {
    pageNumber: FIRST_PAGE,
    pageSize: DEFAULT_PAGE_SIZE,
};


/**
 * Claves de caché del recurso.
 *
 * Están en el servicio y no junto a los hooks porque el Server Component que
 * precarga el listado también las necesita, y no puede importar un módulo
 * `"use client"`.
 *
 * La jerarquía permite invalidar por prefijo: `all` alcanza listado y detalles,
 * `lists()` refresca todas las páginas sin saber en cuál está el usuario.
 *
 * La página y los filtros entran en la clave del listado porque cada
 * combinación es una respuesta distinta del backend. Eso además abarata la
 * búsqueda: borrar una letra vuelve a una clave ya pedida y la respuesta sale
 * de caché.
 */
export const categoryKeys = {
    all: ["products_categories"] as const,
    lists: () => [...categoryKeys.all, "products_categories_list"] as const,
    list: (params: CategoryListParams) => [...categoryKeys.lists(), params] as const,
    detail: (id: string) => [...categoryKeys.all, "products_categories_detail", id] as const,
};


const categoryPath = (id: string): string =>
    `${ENDPOINTS.PRODUCTS_CATEGORY}/${encodeURIComponent(id)}`;


/** Crea el servicio sobre un cliente HTTP concreto. */
export function createCategoriesService(http: HttpClient): CategoriesService {
    return {
        /*
         * La página y los filtros son un argumento propio y no una entrada más
         * de `config.params`: es lo único que el llamante decide siempre, y con
         * tipo propio olvidarlo no compila. Una petición sin página devuelve lo
         * que el backend considere por defecto, que no tiene por qué coincidir
         * con lo que la tabla está enseñando.
         */
        list: async (
            params: CategoryListParams,
            config: HttpRequestConfig | undefined
        ): Promise<ApiResponseWithPagination<CategoryList[]>> => {
            const { data } = await http.get<ApiResponseWithPagination<CategoryListApiResponse[]>>(
                ENDPOINTS.PRODUCTS_CATEGORY,
                withTenantParam(withListParams(params, config))
            );

            // Sólo se traduce la lista; el resto del sobre (`pageNumber`,
            // `pageSize`, `total`) se conserva tal cual porque el pie necesita
            // el total para calcular cuántas páginas hay. Con filtros puestos
            // ese total es el de los resultados, que es lo que se pagina.
            return { ...data, data: toCategoryList(data.data) };
        },

        detail: async (id: string, config: HttpRequestConfig | undefined): Promise<ApiResponseWithPagination<CategoryList>> => {
            const { data } = await http.get<ApiResponseWithPagination<CategoryListApiResponse>>(
                categoryPath(id),
                withTenantParam(config)
            );

            return { ...data, data: toCategory(data.data) };
        },

        create: async (payload: CreateCategoryParams, config: HttpRequestConfig | undefined): Promise<ApiEnvelope<null>> =>
            http.post<null>(
                ENDPOINTS.PRODUCTS_CATEGORY,
                withTenantBody(payload),
                config
            ),

        update: async (
            id: string,
            payload: UpdateCategoryParams,
            config: HttpRequestConfig | undefined
        ): Promise<ApiEnvelope<null>> =>
            http.patch<null>(
                categoryPath(id),
                withTenantBody(payload),
                config
            ),

        // Sin mapper: no devuelve cuerpo que traducir.
        remove: (id: string, config: HttpRequestConfig | undefined): Promise<unknown> =>
            http.delete<unknown>(
                categoryPath(id),
                withTenantParam(config)
            ),
    };
};


/**
 * Clave y función de consulta del listado, para TanStack Query.
 *
 * El servidor la usa para precargar y el cliente para leer. Al salir de una
 * sola función la clave es idéntica en los dos lados, que es lo que hace que la
 * hidratación encuentre los datos en vez de volver a pedirlos.
 *
 * Recibe el servicio ya creado y no el cliente HTTP porque quien llama suele
 * tener uno a mano —el hook lo memoiza para sus mutaciones—, y construirlo aquí
 * dentro dejaría dos instancias distintas del mismo servicio en la misma
 * pantalla.
 *
 * `signal` viene de TanStack Query y llega hasta `fetch`, así que una consulta
 * que deja de interesar cancela su petición de verdad.
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
};
