import type { ApiEnvelope, ApiResponseWithPagination, HttpClient, HttpRequestConfig, PaginationParams } from "@/interfaces";
import { DEFAULT_PAGE_SIZE, FIRST_PAGE } from "@/lib/pagination";
import { ENDPOINTS } from "@/utils";
import type { CategoriesService, CategoryList, CategoryListApiResponse, CreateCategoryParams, UpdateCategoryParams } from "../interfaces";
import { toCategory, toCategoryList } from "../mappers";


/**
 * Servicio de categorías
 *
 * Traduce el dominio a llamadas al backend. Es la única capa que sabe que crear
 * una categoría es un POST y que editarla es un PATCH; la ruta sale de
 * `ENDPOINTS`, donde están todas juntas y localizables.
 *
 * No importa el cliente HTTP: lo recibe. Esa es la inyección de dependencias
 * del proyecto, y hace que el mismo servicio sirva en los dos sitios donde
 * hace falta:
 *
 * - Server Component → `createCategoriesService(httpClient)`
 * - Hook de React    → `createCategoriesService(useHttpClient())`
 *
 * Este archivo **no lleva `"use client"`** a propósito, y no puede llevarlo: el
 * Server Component de la ruta lo importa para precargar el listado. Por eso
 * tampoco importa nada de React ni de TanStack Query.
 */



/**
 * Inquilino quemado, provisional.
 *
 * Sale de aquí y no de dentro de `list` para que sea localizable: cuando
 * exista `useTenantId()` —o el store que lo sostenga—, esta constante
 * desaparece y el valor entra por parámetro o por la cabecera del interceptor.
 * Mientras tanto, al menos hay un solo sitio que cambiar y un nombre que
 * buscar.
 */
const TENANT_ID = "019ff7ac-76bf-76ac-891e-ac1fc352d13e";


/*
 * El inquilino viaja de dos formas según el método, porque así lo espera el
 * backend: en la query cuando la petición no tiene cuerpo, y dentro del cuerpo
 * cuando sí lo tiene.
 *
 * Los dos ayudantes existen para que ningún método lo escriba a mano. Con la
 * repetición, olvidarlo en uno nuevo no da ningún error: ese endpoint
 * simplemente deja de encontrar datos o —peor— encuentra los de otro
 * inquilino, que es un fallo que no se ve hasta que ya hay dos clientes.
 */

/**
 * Inquilino en la query string. Para `GET` y `DELETE`, que no llevan cuerpo.
 *
 * Se fusiona sobre los parámetros que traiga la llamada en vez de
 * reemplazarlos, para que un filtro futuro no lo borre sin querer.
 */
const withTenantParam = (config?: HttpRequestConfig): HttpRequestConfig => ({
    ...config,
    params: { ...config?.params, tenantId: TENANT_ID },
});

/**
 * Inquilino dentro del cuerpo. Para `POST` y `PATCH`.
 *
 * Se añade aquí y no en `CreateCategoryPayload` a propósito: el payload
 * describe **lo que decide el formulario**, y el inquilino no lo decide nadie
 * en pantalla. Meterlo en el tipo obligaría a `toCreateCategoryPayload` a
 * conocerlo, y la conversión de un formulario no tiene por qué saber de
 * multi-tenencia.
 */
const withTenantBody = <TPayload extends object>(
    payload: TPayload
): TPayload & { tenantId: string } => ({
    ...payload,
    tenantId: TENANT_ID,
});


/**
 * Paginación en la query string.
 *
 * Los dos números entran como parámetros de la petición y no en la ruta —la
 * ruta es la colección, la página es una forma de pedirla— y se fusionan sobre
 * lo que traiga la llamada, igual que el inquilino, para no pisar un filtro
 * futuro.
 */
const withPagination = (
    { pageNumber, pageSize }: PaginationParams,
    config?: HttpRequestConfig
): HttpRequestConfig => ({
    ...config,
    params: { ...config?.params, pageNumber, pageSize },
});


/**
 * La página que se pide cuando nadie dice otra cosa.
 *
 * La usan la precarga del servidor y el primer render del navegador, y **tiene
 * que ser la misma en los dos**: la clave de caché lleva la paginación dentro,
 * así que si el servidor guardara la página 1 de 12 en 12 y el cliente pidiera
 * la de 10 en 10, la hidratación no encontraría nada y la tabla volvería a
 * pedir el listado nada más cargar. Por eso sale de una constante exportada y
 * no de un literal en cada lado.
 */
export const DEFAULT_CATEGORIES_PAGINATION: PaginationParams = {
    pageNumber: FIRST_PAGE,
    pageSize: DEFAULT_PAGE_SIZE,
};


/**
 * Claves de caché de este recurso.
 *
 * Viven aquí, y no junto a los hooks, porque el Server Component que precarga
 * el listado también las necesita y no puede importar un módulo `"use client"`
 * para llamar a una función suya.
 *
 * La jerarquía hace que invalidar por el prefijo alcance a todo lo que cuelga:
 * invalidar `all` refresca listado y detalles de una vez, y `lists()` refresca
 * todas las páginas del listado sin tener que saber en cuál está el usuario.
 *
 * La paginación **sí** entra en la clave del listado, y es obligatorio que
 * entre: cada página es una respuesta distinta del backend. Con una clave común
 * para todas, ir a la página 2 sobrescribiría en caché lo que había en la 1 y
 * volver atrás dispararía otra petición para recuperar lo que ya se tenía.
 *
 * Los filtros de la barra —texto y estado— no están en la clave porque todavía
 * no viajan al backend; el día que lo hagan entran aquí al lado de la página,
 * por el mismo motivo.
 */
export const categoryKeys = {
    all: ["products_categories"] as const,
    lists: () => [...categoryKeys.all, "products_categories_list"] as const,
    list: ({ pageNumber, pageSize }: PaginationParams) =>
        [...categoryKeys.lists(), { pageNumber, pageSize }] as const,
    detail: (id: string) => [...categoryKeys.all, "products_categories_detail", id] as const,
};


const categoryPath = (id: string): string =>
    `${ENDPOINTS.PRODUCTS_CATEGORY}/${encodeURIComponent(id)}`;


export function createCategoriesService(http: HttpClient): CategoriesService {
    return {
        /*
         * La página es un argumento propio y no una entrada más de
         * `config.params`: es lo único que el llamante tiene que decidir
         * siempre, y como parámetro con tipo, olvidarla no compila. Metida en
         * `params` sería opcional, y una petición sin página devuelve lo que el
         * backend considere por defecto — que no tiene por qué ser lo que la
         * tabla está enseñando.
         */
        list: async (
            pagination: PaginationParams,
            config: HttpRequestConfig | undefined
        ): Promise<ApiResponseWithPagination<CategoryList[]>> => {
            const { data } = await http.get<ApiResponseWithPagination<CategoryListApiResponse[]>>(
                ENDPOINTS.PRODUCTS_CATEGORY,
                withTenantParam(withPagination(pagination, config))
            );

            // El sobre se conserva entero —`pageNumber`, `pageSize` y `total`
            // vienen del backend— y sólo se traduce la lista: el pie necesita
            // el total para saber cuántas páginas dibujar.
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
                `${ENDPOINTS.PRODUCTS_CATEGORY}/${encodeURIComponent(id)}`,
                withTenantParam(config)
            ),
    };
};


/**
 * Configuración de la consulta del listado.
 *
 * El servidor la usa para precargar y el cliente para leer. Que salga de una
 * sola función es lo que garantiza que **la clave sea idéntica en los dos
 * lados**: si el servidor guardara bajo `["categories","list"]` y el navegador
 * buscara en `["categories","listado"]`, la hidratación no encontraría nada y
 * la pantalla volvería a pedir el listado nada más cargar, anulando la
 * precarga sin dar ningún error.
 *
 * `signal` llega desde TanStack Query y baja hasta `fetch`: si la consulta deja
 * de interesar, la petición se cancela de verdad en la red.
 */
export function categoriesQueryOptions(
    http: HttpClient,
    pagination: PaginationParams = DEFAULT_CATEGORIES_PAGINATION
) {
    const service = createCategoriesService(http);

    return {
        queryKey: categoryKeys.list(pagination),
        queryFn: ({ signal }: { signal: AbortSignal }) =>
            service.list(pagination, { signal }),
    };
};
