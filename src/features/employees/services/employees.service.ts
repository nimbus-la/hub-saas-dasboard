import type { ApiEnvelope, ApiResponseWithPagination, HttpClient, HttpRequestConfig, PaginationParams } from "@/interfaces";
import { DEFAULT_PAGE_SIZE, FIRST_PAGE } from "@/lib/pagination";
import { ENDPOINTS } from "@/utils";
import type { CreateEmployeeParams, EmployeeList, EmployeeListApiResponse, EmployeeListParams, EmployeesService, UpdateEmployeeParams } from "../interfaces";
import { toEmployee, toEmployeeList } from "../mappers";


/**
 * Acceso HTTP a los empleados.
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
 * Se añade aquí y no en `CreateEmployeeParams` porque ese tipo describe lo que
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
 * Se vuelcan con un spread porque `EmployeeListParams` ya usa los nombres del
 * backend (`pageNumber`, `pageSize`, `text`, `isActive`) y no hay nada que
 * traducir. Los filtros que no aplican no están en el objeto, así que tampoco
 * llegan a la URL.
 */
const withListParams = (
    params: EmployeeListParams,
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
export const DEFAULT_EMPLOYEES_PAGINATION: PaginationParams = {
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
export const employeeKeys = {
    all: ["employees"] as const,
    lists: () => [...employeeKeys.all, "employees_list"] as const,
    list: (params: EmployeeListParams) => [...employeeKeys.lists(), params] as const,
    detail: (id: string) => [...employeeKeys.all, "employees_detail", id] as const,
};


const employeePath = (id: string): string =>
    `${ENDPOINTS.EMPLOYEES}/${encodeURIComponent(id)}`;


/** Crea el servicio sobre un cliente HTTP concreto. */
export function createEmployeesService(http: HttpClient): EmployeesService {
    return {
        /*
         * La página y los filtros son un argumento propio y no una entrada más
         * de `config.params`: es lo único que el llamante decide siempre, y con
         * tipo propio olvidarlo no compila. Una petición sin página devuelve lo
         * que el backend considere por defecto, que no tiene por qué coincidir
         * con lo que la tabla está enseñando.
         */
        list: async (
            params: EmployeeListParams,
            config: HttpRequestConfig | undefined
        ): Promise<ApiResponseWithPagination<EmployeeList[]>> => {
            const { content } = await http.get<ApiResponseWithPagination<EmployeeListApiResponse[]>>(
                ENDPOINTS.EMPLOYEES,
                withTenantParam(withListParams(params, config))
            );

            // Sólo se traducen las filas; el resto del contenido (`pageNumber`,
            // `pageSize`, `total`) se conserva tal cual porque el pie necesita
            // el total para calcular cuántas páginas hay. Con filtros puestos
            // ese total es el de los resultados, que es lo que se pagina.
            return { ...content, rows: toEmployeeList(content.rows) };
        },

        // Un detalle no pagina: su `content` es el empleado, sin `rows` ni
        // estado de pie alrededor.
        detail: async (id: string, config: HttpRequestConfig | undefined): Promise<EmployeeList> => {
            const { content } = await http.get<EmployeeListApiResponse>(
                employeePath(id),
                withTenantParam(config)
            );

            return toEmployee(content);
        },

        create: async (payload: CreateEmployeeParams, config: HttpRequestConfig | undefined): Promise<ApiEnvelope<null>> =>
            http.post<null>(
                ENDPOINTS.EMPLOYEES,
                withTenantBody(payload),
                config
            ),

        update: async (
            id: string,
            payload: UpdateEmployeeParams,
            config: HttpRequestConfig | undefined
        ): Promise<ApiEnvelope<null>> =>
            http.patch<null>(
                employeePath(id),
                withTenantBody(payload),
                config
            ),

        // Sin mapper: no devuelve cuerpo que traducir.
        remove: (id: string, config: HttpRequestConfig | undefined): Promise<unknown> =>
            http.delete<unknown>(
                employeePath(id),
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
export function employeesQueryOptions(
    service: EmployeesService,
    params: EmployeeListParams = DEFAULT_EMPLOYEES_PAGINATION
) {
    return {
        queryKey: employeeKeys.list(params),
        queryFn: ({ signal }: { signal: AbortSignal }) =>
            service.list(params, { signal }),
    };
}