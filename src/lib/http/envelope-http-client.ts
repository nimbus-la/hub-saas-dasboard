import type {
    ApiEnvelope,
    HttpClient,
    HttpRequest,
    HttpRequestConfig,
    HttpResponse,
} from "@/interfaces";
import { API_SUCCESS_CODE } from "@/utils";

import { HttpError } from "./http-error";


/**
 * Cliente que desenvuelve el sobre del backend
 *
 * No hace peticiones: envuelve a otro `HttpClient` y le añade un paso. Cumple
 * la misma interfaz, así que quien lo consume no distingue uno de otro — es la
 * razón por la que `HttpClient` es una interfaz y no una clase.
 *
 * Hace dos cosas, y la segunda es la importante:
 *
 * 1. Devuelve `data` en lugar del sobre entero. Los servicios piden
 *    `http.get<CategoryApiResponse[]>` y reciben el array, sin `.data` por
 *    ningún lado.
 *
 * 2. **Convierte un `code` de fallo en un error lanzado.** Este backend puede
 *    responder `200 OK` con `code: "1234"` dentro: para `fetch` eso es un
 *    éxito, y sin esta clase la promesa resolvería con normalidad. TanStack
 *    Query lo daría por bueno, no reintentaría, no marcaría `isError`, y la
 *    pantalla pintaría una tabla vacía como si el backend no tuviera nada —
 *    cuando en realidad algo falló. Se traduce a `HttpError` para que un fallo
 *    de negocio y uno de red se traten igual en toda la aplicación.
 *
 * Se monta por composición en `src/lib/http/index.ts`:
 *
 *     new EnvelopeHttpClient(new FetchHttpClient({ ... }))
 *
 * Cambiar `fetch` por axios no le afecta, y quitar el sobre el día que el
 * backend deje de usarlo es borrar una línea de ese archivo.
 */
export class EnvelopeHttpClient implements HttpClient {
    private readonly inner: HttpClient;

    constructor(inner: HttpClient) {
        this.inner = inner;
    }

    async request<TData>(input: HttpRequest): Promise<HttpResponse<TData>> {
        // El interior devuelve el cuerpo tal cual: aquí todavía es el sobre.
        const response = await this.inner.request<unknown>(input);

        return { ...response, data: unwrap<TData>(response.data, input) };
    }

    async get<TData>(url: string, config?: HttpRequestConfig): Promise<TData> {
        const response = await this.request<TData>({ ...config, method: "GET", url });

        return response.data;
    }

    async post<TData>(
        url: string,
        body?: unknown,
        config?: HttpRequestConfig
    ): Promise<TData> {
        const response = await this.request<TData>({
            ...config,
            method: "POST",
            url,
            body,
        });

        return response.data;
    }

    async put<TData>(
        url: string,
        body?: unknown,
        config?: HttpRequestConfig
    ): Promise<TData> {
        const response = await this.request<TData>({
            ...config,
            method: "PUT",
            url,
            body,
        });

        return response.data;
    }

    async patch<TData>(
        url: string,
        body?: unknown,
        config?: HttpRequestConfig
    ): Promise<TData> {
        const response = await this.request<TData>({
            ...config,
            method: "PATCH",
            url,
            body,
        });

        return response.data;
    }

    async delete<TData>(url: string, config?: HttpRequestConfig): Promise<TData> {
        const response = await this.request<TData>({ ...config, method: "DELETE", url });

        return response.data;
    }
}


/**
 * Saca `data` del sobre, o lanza si el código no es de éxito.
 *
 * Lo que no parece un sobre pasa intacto. Es deliberado: un `204 No Content`
 * de un `DELETE` llega como `null` y no tiene nada que desenvolver, y si algún
 * día una ruta responde el recurso pelado —o se apunta el cliente a un
 * servicio de terceros— seguirá funcionando en vez de romperse.
 */
function unwrap<TData>(body: unknown, request: HttpRequest): TData {
    if (!isApiEnvelope(body)) return body as TData;

    if (body.code !== API_SUCCESS_CODE) {
        throw new HttpError({
            kind: "response",
            // El estado del sobre describe el fallo mejor que el de la
            // respuesta, que en este caso probablemente fue un `200`.
            status: body.httpStatus,
            // El sobre entero, no sólo `messages`: `getApiErrorMessage` sabe
            // leerlo y así no se pierde el `code` para diagnosticar.
            body,
            message: `${request.method} ${request.url} respondió con el código ${body.code}`,
            method: request.method,
            url: request.url,
        });
    }

    return body.data as TData;
}


/**
 * ¿Esto es un sobre del backend?
 *
 * Se comprueban `code` y la presencia de `data`, que son los dos campos de los
 * que depende el desenvuelto. No se exige `status` ni `httpStatus`: un sobre al
 * que le falte uno de ésos sigue siendo desenvolvible, y ser estrictos aquí
 * convertiría un campo ausente en "esto no es un sobre" y devolvería el objeto
 * entero a la pantalla sin avisar.
 */
function isApiEnvelope(value: unknown): value is ApiEnvelope<unknown> {
    if (typeof value !== "object" || value === null) return false;

    const candidate = value as Record<string, unknown>;

    return typeof candidate["code"] === "string" && "data" in candidate;
}
