import type { HttpMethod } from "./http.interfaces";


/**
 * Contrato del error de transporte
 *
 * Describe la forma de `HttpError` (`src/lib/http/http-error.ts`), el único
 * error que la aplicación ve cuando algo falla al hablar con el backend. Nadie
 * debería atrapar un `TypeError: Failed to fetch`, un `AxiosError` ni un
 * `DOMException` de cancelación: todos se traducen a esta forma antes de salir
 * del cliente HTTP.
 *
 * Los tipos viven aquí, separados de la clase, por la misma razón que
 * `http.interfaces.ts`: una implementación alternativa del cliente —axios,
 * `ky`, un doble de pruebas— tiene que poder construir errores idénticos sin
 * heredar de nuestra clase ni importar `src/lib/http`.
 */



/**
 * Qué falló.
 *
 * No es una etiqueta descriptiva: es lo que decide el comportamiento de la
 * aplicación ante el fallo. Antes de añadir un valor nuevo conviene revisar
 * `isRetryableError` y `getApiErrorMessage`, que hacen distinciones sobre esta
 * unión.
 *
 * · `response` — el servidor contestó, pero con un código de error (4xx/5xx).
 *   Es el único `kind` que trae `status`, y normalmente también `body` con el
 *   detalle del rechazo.
 *
 * · `network` — nunca hubo respuesta: DNS, CORS, sin conexión, servidor caído.
 *   No hay `status` que consultar, y se reintenta: la red puede volver.
 *
 * · `timeout` — el servidor tardó más de lo permitido y se abortó la espera.
 *   Se reintenta, porque el mismo servidor puede responder a tiempo después.
 *
 * · `aborted` — lo canceló el llamante: el usuario cambió de filtro o navegó a
 *   otra pantalla y React Query abortó la consulta. **No es un fallo**: no se
 *   reintenta y no debería pintar ningún mensaje, porque el usuario ya obtuvo
 *   lo que quería al irse.
 *
 * · `parse` — hubo respuesta con código correcto, pero el cuerpo no era el
 *   formato esperado. Casi siempre significa que el contrato con el backend se
 *   rompió, y por eso no se reintenta: volvería a llegar el mismo cuerpo roto.
 */
export type HttpErrorKind = "response" | "network" | "timeout" | "aborted" | "parse";



/**
 * Datos con los que se construye un `HttpError`.
 *
 * Es un objeto y no una lista de parámetros posicionales a propósito: son seis
 * campos, tres de ellos opcionales, y en la forma posicional
 * (`new HttpError("network", msg, "GET", url, undefined, undefined)`) es
 * cuestión de tiempo que dos se intercambien sin que el compilador lo note,
 * porque varios comparten tipo.
 */
export interface HttpErrorOptions {
    /** Ver `HttpErrorKind`. Determina si se reintenta y cómo se comunica. */
    kind: HttpErrorKind;

    /**
     * Descripción técnica del fallo, para registros y trazas.
     *
     * Incluye método y URL (`GET /categories respondió 500`), así que **no se
     * enseña al usuario**: revela rutas internas del backend y no le dice nada
     * a quien está usando el panel. El texto presentable se obtiene con
     * `getApiErrorMessage`, que prefiere lo que haya explicado el backend.
     */
    message: string;

    /** Verbo de la petición que falló. Se conserva para poder rastrearla. */
    method: HttpMethod;

    /**
     * URL final de la petición, ya con `baseUrl` y query string resueltos.
     *
     * Se guarda la URL efectiva y no la ruta relativa que escribió el llamante
     * porque es la que hay que pegar en el navegador o en un `curl` para
     * reproducir el fallo.
     */
    url: string;

    /**
     * Código HTTP de la respuesta.
     *
     * Sólo existe en `kind: "response"` y en `kind: "parse"`; en los demás no
     * llegó a haber respuesta que numerar. La clase lo normaliza a `null` en su
     * propiedad pública, para que `status` sea siempre consultable sin
     * comprobar antes el `kind`.
     */
    status?: number;

    /**
     * Cuerpo del error tal como lo mandó el backend.
     *
     * Se tipa `unknown` deliberadamente: viene de fuera y no hay ninguna
     * garantía de su forma. Un backend puede contestar `{ message }`, otro
     * `{ errors: [...] }` y un balanceador de carga puede meter una página HTML
     * de error en medio. Tiparlo como una interfaz concreta sería una promesa
     * que nadie puede cumplir, y produciría fallos en tiempo de ejecución justo
     * cuando ya se está gestionando un fallo.
     *
     * Para leerlo con seguridad está `getApiErrorMessage`.
     */
    body?: unknown;

    /**
     * Excepción original que provocó éste.
     *
     * Se pasa al `cause` estándar de `Error` (ES2022), de modo que la traza del
     * fallo real —el `TypeError` de `fetch`, el `SyntaxError` de `JSON.parse`—
     * sigue disponible en la consola y en las herramientas de monitoreo, en vez
     * de perderse al envolverla.
     */
    cause?: unknown;
}
