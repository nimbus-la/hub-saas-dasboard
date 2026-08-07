import type { HttpClient, HttpRequestConfig } from "@/interfaces";
import type {
    Category,
    CategoryApiResponse,
    CreateCategoryPayload,
    UpdateCategoryPayload,
} from "../interfaces";
import { toCategory, toCategoryList } from "../mappers/categories.mapper";


/**
 * Servicio de categorías
 *
 * Traduce el dominio a rutas del backend. Es la única capa que sabe que las
 * categorías viven en `/categories` y que crear una es un POST.
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



/** Ruta base del recurso. Un solo sitio que tocar si el backend la mueve. */
const RESOURCE = "/categories";


/**
 * Inquilino quemado, provisional.
 *
 * Sale de aquí y no de dentro de `list` para que sea localizable: cuando
 * exista `useTenantId()` —o el store que lo sostenga—, esta constante
 * desaparece y el valor entra por parámetro o por la cabecera del interceptor.
 * Mientras tanto, al menos hay un solo sitio que cambiar y un nombre que
 * buscar.
 */
const TENANT_ID = "019fceb3-99f6-70eb-9dc6-04f24e1e7f67";


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
 * Claves de caché de este recurso.
 *
 * Viven aquí, y no junto a los hooks, porque el Server Component que precarga
 * el listado también las necesita y no puede importar un módulo `"use client"`
 * para llamar a una función suya.
 *
 * La jerarquía hace que invalidar por el prefijo alcance a todo lo que cuelga:
 * invalidar `all` refresca listado y detalles de una vez.
 *
 * El listado no lleva filtros en la clave a propósito. Las categorías son unas
 * decenas: se piden todas y la pantalla busca y filtra en memoria con
 * `filterCategories`. El día que un recurso necesite filtrar en el servidor
 * —ventas— sus filtros sí entran en la clave, para que cada combinación se
 * cachee por separado.
 */
export const categoryKeys = {
    all: ["categories"] as const,
    list: () => [...categoryKeys.all, "list"] as const,
    detail: (id: string) => [...categoryKeys.all, "detail", id] as const,
};


export interface CategoriesService {
    list(config?: HttpRequestConfig): Promise<Category[]>;
    detail(id: string, config?: HttpRequestConfig): Promise<Category>;
    create(payload: CreateCategoryPayload, config?: HttpRequestConfig): Promise<Category>;
    update(
        id: string,
        payload: UpdateCategoryPayload,
        config?: HttpRequestConfig
    ): Promise<Category>;
    remove(id: string, config?: HttpRequestConfig): Promise<void>;
}


export function createCategoriesService(http: HttpClient): CategoriesService {
    return {
        /*
         * El mapper se aplica aquí, en la frontera, y no en el hook ni en el
         * JSX. A partir de este `return` no queda nadie en la aplicación que
         * vea la forma cruda del backend: la caché de TanStack Query guarda
         * `Category`, la precarga del Server Component serializa `Category` y
         * la tabla recibe `Category`.
         *
         * Si el mapeo se hiciera en el `select` de `useQuery`, la caché
         * seguiría guardando la forma cruda: el Server Component hidrataría
         * datos sin normalizar y cualquier otro consumidor tendría que
         * acordarse de repetir la transformación.
         */
        list: async (config) =>
            toCategoryList(
                await http.get<CategoryApiResponse[]>(RESOURCE, withTenantParam(config))
            ),

        detail: async (id, config) =>
            toCategory(
                await http.get<CategoryApiResponse>(
                    `${RESOURCE}/${encodeURIComponent(id)}`,
                    withTenantParam(config)
                )
            ),

        // El alta y la edición también pasan por el mapper: devuelven la
        // categoría guardada, y esa acaba en la caché igual que las del
        // listado. Sin esto sería la única con la forma del backend.
        //
        // Aquí el inquilino va en el cuerpo y **no** en la query: mandarlo por
        // los dos sitios serían dos fuentes del mismo dato que pueden
        // discrepar, y el día que discrepen nadie sabría cuál gana.
        create: async (payload, config) =>
            toCategory(
                await http.post<CategoryApiResponse>(
                    RESOURCE,
                    withTenantBody(payload),
                    config
                )
            ),

        update: async (id, payload, config) =>
            toCategory(
                await http.patch<CategoryApiResponse>(
                    `${RESOURCE}/${encodeURIComponent(id)}`,
                    withTenantBody(payload),
                    config
                )
            ),

        // Sin mapper: no devuelve cuerpo que traducir.
        remove: (id, config) =>
            http.delete<void>(
                `${RESOURCE}/${encodeURIComponent(id)}`,
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
export function categoriesQueryOptions(http: HttpClient) {
    const service = createCategoriesService(http);

    return {
        queryKey: categoryKeys.list(),
        queryFn: ({ signal }: { signal: AbortSignal }) => service.list({ signal }),
    };
};
