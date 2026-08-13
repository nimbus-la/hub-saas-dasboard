import { ApiMeta } from "./api-envelope.interfaces";

/** Verbos que usa la aplicación. Si el backend expone otro, se añade aqui. */
export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";



/** Valor admitido en la query string. Todo se serializa con `String()`. */
export type QueryParamPrimitive = string | number | boolean;



/** Parámetros de la query string. */
export type QueryParams = Record<
    string,
    QueryParamPrimitive | QueryParamPrimitive[] | null | undefined
>;



/**
 * Cómo interpretar el cuerpo de la respuesta.
 * 
 * `json` cubre el 99% y es el valor por defecto. `blob` existe para descargas
 * (exportar ventas a Excel) y `text` para respuestas que no son JSON.
 */
export type ResponseFormat = "json" | "text" | "blob";



/** Opciones de una petición, sin el método ni la URL. */
export interface HttpRequestConfig {
    /** Cabeceras propias de esta petición. Se fucionan sobre las del cliente. */
    headers?: Record<string, string>;

    /** Query string. Ver `QueryParams` */
    params?: QueryParams;

    /**
     * Senal de cancelación del llamante.
     * 
     * TanStack Query pasa la suya en `queryFn` para abortar consultas que ya no
     * interesan. Se combina con el timeout interno, no lo reemplaza.
     */
    signal?: AbortSignal;

    /** Milisegundos antes de abortar por tiempo. `0` desactiva el límite. */
    timeoutMs?: number;

    /** Formato del cuerpo de la respuesta. Por defecto `json` */
    responseAs?: ResponseFormat;

    /** Envío de cookies. Necesario si la sesión va en cookie de otro dominio. */
    credentials?: RequestCredentials;

    skipAuth?: boolean;

    /**
     * Caché HTTP estándar.
     * 
     * Sólo tiene efecto en implementaciones sobre `fetch`. Una con
     * axios la ignora.
     */
    cache?: RequestCache;

    next?: NextFetchRequestConfig;
};



/** Petición completa. Configuración + qué se pide y a dónde. */
export interface HttpRequest extends HttpRequestConfig {
    method: HttpMethod;

    /** Ruta relativa al `baseUrl` ('/categories') o URL absoluta. */
    url: string;

    /**
     * Cuerpo de la petición
     * 
     * Un objeto plano se serializa a JSON y se le pone la cabecera. `FormData`,
     * `Blob`, `URLSearchParams` y `string`se envían tal cual.
     */
    body?: unknown;
};



export interface HttpResponse<TData = unknown> {
    data: TData;
    status: number;
    headers: Headers;
    meta: ApiMeta | null;
};