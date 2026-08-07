import type { HttpClient, HttpRequestConfig } from "@/interfaces";
import type { Category, CategoryApiResponse } from "../interfaces";
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


/**
 * Datos que se mandan al crear o editar.
 *
 * No es `Category`: `id` y `placedAt` los pone el backend, y aceptarlos aquí
 * invitaría a que una pantalla intentara inventárselos.
 *
 * Coincide en forma con lo que devuelve `toCategoryFields` del formulario, así
 * que lo que sale del modal entra aquí sin conversión ni casts.
 */
export interface CategoryPayload {
    name: string;
    description?: string;
    isActive: boolean;
}


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
    create(payload: CategoryPayload, config?: HttpRequestConfig): Promise<Category>;
    update(
        id: string,
        payload: CategoryPayload,
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
        list: async (config) => {
            const response = await http.get<CategoryApiResponse[]>(RESOURCE, {
                ...config,
                params: { tenantId: TENANT_ID },
            });

            return toCategoryList(response);
        },

        detail: async (id, config) =>
            toCategory(
                await http.get<CategoryApiResponse>(
                    `${RESOURCE}/${encodeURIComponent(id)}`,
                    config
                )
            ),

        // El alta y la edición también pasan por el mapper: devuelven la
        // categoría guardada, y esa acaba en la caché igual que las del
        // listado. Sin esto sería la única con la forma del backend.
        create: async (payload, config) =>
            toCategory(await http.post<CategoryApiResponse>(RESOURCE, payload, config)),

        update: async (id, payload, config) =>
            toCategory(
                await http.put<CategoryApiResponse>(
                    `${RESOURCE}/${encodeURIComponent(id)}`,
                    payload,
                    config
                )
            ),

        // Sin mapper: no devuelve cuerpo que traducir.
        remove: (id, config) =>
            http.delete<void>(`${RESOURCE}/${encodeURIComponent(id)}`, config),
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
