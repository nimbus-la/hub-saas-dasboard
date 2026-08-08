/**
 * Rutas del backend
 *
 * El catálogo de todo lo que la aplicación le pide al backend. Cada servicio
 * traduce su dominio a llamadas HTTP, pero **ninguno escribe la ruta**: la toma
 * de aquí.
 *
 * El motivo es que una ruta escrita a mano dentro de un servicio no se puede
 * buscar. Si `/categories` vive en `categories.service.ts` y mañana el backend
 * la mueve a `/catalog/categories`, hay que abrir servicio por servicio para
 * saber a cuáles les afecta; y un literal repetido en dos archivos se cambia en
 * uno y se olvida en el otro, que es un fallo que sólo aparece al pulsar el
 * botón que usa el que quedó viejo. Reunidas en un objeto, la respuesta a
 * "¿qué le pedimos al backend?" es abrir este archivo.
 *
 * Cada clave es la ruta de una colección. Las rutas de un elemento concreto
 * —detalle, edición, baja— las compone el servicio añadiéndole el
 * identificador, porque son la misma ruta con distinto verbo.
 *
 * Qué **no** entra aquí:
 *
 * · El origen (`https://api…`). Cambia entre desarrollo y producción, así que
 *   sale de variables de entorno y lo pone el cliente HTTP en su `baseUrl`.
 *   Ver `src/lib/http/index.ts`.
 * · Los parámetros de consulta (filtros, paginación, inquilino). Son datos de
 *   la llamada concreta, no de la ruta; viajan en `config.params` y el cliente
 *   los serializa.
 * · Los tiempos de espera, reintentos y caché. Eso es `api.constants`.
 *
 * Los nombres van agrupados por módulo (`PRODUCTS_`, `ORDERS_`…) para que el
 * autocompletado del objeto los ordene juntos: escribir `ENDPOINTS.PRODUCTS_`
 * lista todo lo del módulo de productos sin tener que abrir el archivo.
 */
export const ENDPOINTS = {

    // ── Productos ───────────────────────────────────────────────────────────

    /**
     * Categorías de producto.
     *
     * El inquilino no aparece en la ruta aunque el backend lo exija: viaja en
     * la query o en el cuerpo según el verbo, y de eso se encarga el servicio.
     */
    PRODUCTS_CATEGORY: "/categories",

} as const;
