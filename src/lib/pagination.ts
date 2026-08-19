/**
 * Paginación — la aritmética
 *
 * Las cuatro cuentas que aparecen en cuanto una lista no cabe en una pantalla:
 * dónde empieza a contar, cuántos caben, cuántas páginas salen y qué hacer con
 * una página que se quedó fuera de rango.
 *
 * Vive aquí, y no dentro del pie ni del hook, porque las hacen los tres: el pie
 * para dibujar los números, el hook para no pedir una página que no existe y
 * cualquier pantalla que quiera saber si hay más de una. Tres copias de
 * `Math.ceil(total / pageSize)` se escriben igual hasta el día que una se
 * olvida del `Math.max(1, …)` y la lista vacía dice "página 1 de 0".
 *
 * Todo son funciones puras sobre números: nada de React, nada de red. Por eso
 * el pie —que es cliente— y la precarga del servidor pueden importarlo igual.
 */


/**
 * La primera página es la 1.
 *
 * El backend cuenta desde 1 y la interfaz también, así que no hay ninguna
 * conversión de por medio. La constante existe para que el literal no aparezca
 * suelto en cada `setPageNumber(1)`: leído en una llamada, ese `1` puede ser
 * una página, un tamaño o un desplazamiento.
 */
export const FIRST_PAGE = 1;


/**
 * Tamaño de página por defecto.
 *
 * Doce y no diez porque es el número que llena sin huecos las rejillas de tres
 * y de cuatro columnas del panel, y en una tabla sigue siendo una pantalla
 * larga sin llegar a pedir scroll infinito.
 */
export const DEFAULT_PAGE_SIZE = 12;


/**
 * Opciones del selector del pie.
 *
 * Tres y no cinco: cada una tiene que responder a una intención distinta
 * —"ojear", "trabajar", "revisar todo"—, y una lista de seis números obliga a
 * elegir entre valores que no se diferencian en nada.
 */
export const PAGE_SIZE_OPTIONS = [8, 12, 24] as const;


/**
 * Cuántas páginas salen de una colección.
 *
 * Nunca menos de una: una lista vacía sigue teniendo una página (la que se ve,
 * con su mensaje de "no hay nada"), y devolver 0 dejaría el pie diciendo
 * "página 1 de 0" y al botón de siguiente habilitado.
 */
export function getTotalPages(total: number, pageSize: number): number {
    // Un tamaño de 0 llegaría por un selector mal configurado, no por un
    // usuario; se trata como "todo en una página" en lugar de devolver
    // `Infinity` y pintar un pie interminable.
    if (pageSize <= 0) return 1;

    return Math.max(1, Math.ceil(total / pageSize));
}


/**
 * Mete una página dentro del rango que existe.
 *
 * Hace falta porque la página es estado del navegador y el total lo decide el
 * servidor: entre los dos hay una ventana —un borrado, un filtro, un tamaño de
 * página más grande— en la que se está pidiendo la 7 de una colección que ahora
 * tiene 3.
 */
export function clampPage(page: number, totalPages: number): number {
    return Math.min(Math.max(page, FIRST_PAGE), totalPages);
}
