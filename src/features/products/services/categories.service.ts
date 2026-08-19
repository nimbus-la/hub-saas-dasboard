import type { ApiEnvelope, ApiResponseWithPagination, HttpClient, HttpRequestConfig, PaginationParams } from "@/interfaces";
import { DEFAULT_PAGE_SIZE, FIRST_PAGE } from "@/lib/pagination";
import { ENDPOINTS } from "@/utils";
import type { CategoriesService, CategoryList, CategoryListApiResponse, CategoryListParams, CreateCategoryParams, UpdateCategoryParams } from "../interfaces";
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
 * Página y filtros en la query string.
 *
 * Todo entra como parámetros de la petición y no en la ruta: la ruta es la
 * colección, y la página o el texto buscado son formas de pedirla. Se fusionan
 * sobre lo que traiga la llamada, igual que el inquilino.
 *
 * Se vuelca con un spread y no campo a campo porque `CategoryListParams` ya usa
 * los nombres del backend —`pageNumber`, `pageSize`, `text`, `isActive`—, así
 * que no hay ninguna traducción que hacer. Los filtros que no aplican no están
 * en el objeto, de modo que tampoco llegan a la URL; y aunque llegaran como
 * `undefined`, el cliente HTTP los omite.
 */
const withListParams = (
    params: CategoryListParams,
    config?: HttpRequestConfig
): HttpRequestConfig => ({
    ...config,
    params: { ...config?.params, ...params },
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
 * La página y los filtros **sí** entran en la clave del listado, y es
 * obligatorio que entren: cada combinación es una respuesta distinta del
 * backend. Con una clave común, ir a la página 2 sobrescribiría en caché lo que
 * había en la 1, y buscar "café" tiraría el listado sin filtrar.
 *
 * Que estén en la clave es además lo que hace barata la búsqueda: borrar una
 * letra vuelve a una clave que ya se pidió, y la respuesta sale de la caché sin
 * tocar la red.
 */
export const categoryKeys = {
    all: ["products_categories"] as const,
    lists: () => [...categoryKeys.all, "products_categories_list"] as const,
    list: (params: CategoryListParams) => [...categoryKeys.lists(), params] as const,
    detail: (id: string) => [...categoryKeys.all, "products_categories_detail", id] as const,
};


const categoryPath = (id: string): string =>
    `${ENDPOINTS.PRODUCTS_CATEGORY}/${encodeURIComponent(id)}`;


export function createCategoriesService(http: HttpClient): CategoriesService {
    return {
        /*
         * Qué se pide —página y filtros— es un argumento propio y no una entrada
         * más de `config.params`: es lo único que el llamante tiene que decidir
         * siempre, y como parámetro con tipo, olvidar la página no compila.
         * Metida en `params` sería opcional, y una petición sin página devuelve
         * lo que el backend considere por defecto — que no tiene por qué ser lo
         * que la tabla está enseñando.
         */
        list: async (
            params: CategoryListParams,
            config: HttpRequestConfig | undefined
        ): Promise<ApiResponseWithPagination<CategoryList[]>> => {
            const { data } = await http.get<ApiResponseWithPagination<CategoryListApiResponse[]>>(
                ENDPOINTS.PRODUCTS_CATEGORY,
                withTenantParam(withListParams(params, config))
            );

            // El sobre se conserva entero —`pageNumber`, `pageSize` y `total`
            // vienen del backend— y sólo se traduce la lista: el pie necesita
            // el total para saber cuántas páginas dibujar. Con filtros puestos
            // ese total es el de los resultados, no el del catálogo, que es
            // justo lo que hay que paginar.
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
    params: CategoryListParams = DEFAULT_CATEGORIES_PAGINATION
) {
    const service = createCategoriesService(http);

    return {
        queryKey: categoryKeys.list(params),
        queryFn: ({ signal }: { signal: AbortSignal }) =>
            service.list(params, { signal }),
    };
};
