import type { Category, CategoryApiResponse } from "../interfaces";


/**
 * Traductores entre el backend y el dominio
 *
 * Frontera de una sola dirección: lo que entra tiene la forma que decidió el
 * backend, lo que sale tiene la forma con la que quiere trabajar la aplicación.
 * Todo lo que hay más adentro —caché, pantallas, tabla, formulario— ve
 * `Category` y sólo `Category`.
 *
 * El trabajo concreto es **normalizar ausencias**: convertir los campos que
 * pueden no venir en valores que siempre existen. Eso es lo que quita los `??`
 * repartidos por el JSX, que era el objetivo.
 *
 * Lo que aquí NO se decide es cómo se ve una ausencia. Que una descripción
 * vacía se pinte con una raya es cosa de la tabla, no del dominio: el mismo
 * dato aparece en el formulario de edición, donde una raya sería un texto que
 * nadie escribió y que se guardaría como si sí.
 */


/**
 * Una categoría del backend a una del dominio.
 *
 * Está separado del de la lista porque `POST`, `PUT` y el detalle devuelven un
 * único objeto, y también tienen que pasar por aquí: si sólo se mapeara el
 * listado, la categoría recién creada entraría en la caché con la forma cruda
 * y sería la única fila de la tabla que no cumple el contrato.
 */
export const toCategory = (category: CategoryApiResponse): Category => ({
    id: category.id,
    name: category.name,

    // Cadena vacía y no la raya de "sin descripción": `""` es falsy, así que
    // la tabla sigue distinguiendo el hueco y pintando su marca de posición,
    // y el formulario de edición abre el campo vacío en vez de con un `-`
    // dentro que se guardaría como descripción de verdad.
    description: category.description ?? "",

    // Se conserva vacío si el backend todavía no lo manda. La tabla ya sabe
    // qué hacer con eso; inventar una fecha aquí sería peor que no tenerla,
    // porque una fecha falsa no se distingue de una real.
    placedAt: category.placedAt ?? "",

    isActive: category.isActive,
});


/** El listado completo. */
export const toCategoryList = (categories: CategoryApiResponse[]): Category[] =>
    categories.map(toCategory);
