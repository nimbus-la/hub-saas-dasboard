import type { BadgeTone } from "@/interfaces";
import { formatMessage, formatPlural, messages } from "@/messages";

import { CategoryFilters, CategoryList } from "../interfaces";
import {
    CATEGORY_STATUS_LABELS,
    CATEGORY_STATUS_PLURAL_LABELS,
    CATEGORY_STATUS_TONES,
    CATEGORY_STATUS_TO_IS_ACTIVE,
    DEFAULT_CATEGORY_STATUS_FILTER,
    type CategoryStatusFilter,
} from "./categories-const.libs";


/** `Activa` · `Inactiva` */
export const formatCategoryStatus = (isActive: boolean): string =>
    isActive ? CATEGORY_STATUS_LABELS.active : CATEGORY_STATUS_LABELS.inactive;

export const getCategoryStatusTone = (isActive: boolean): BadgeTone =>
    isActive ? CATEGORY_STATUS_TONES.active : CATEGORY_STATUS_TONES.inactive;


/**
 * Traduce la barra de filtros a lo que entiende el backend.
 *
 * Es el único punto donde "lo que el usuario eligió" se convierte en "lo que se
 * pide", y por eso concentra las dos reglas que antes estaban repartidas por la
 * pantalla:
 *
 * · **Se omite lo que no filtra.** Un texto vacío o el estado "Todos" no viajan
 *   como `?text=` ni `?isActive=`: para el backend eso no es "sin filtro", es
 *   un valor, y devolvería cero resultados. Por eso las claves se añaden
 *   condicionalmente en lugar de ponerlas en `undefined`.
 *
 * · **El texto va recortado.** Buscar `"café "` y `"café"` es la misma
 *   intención; sin recortar serían dos entradas distintas en la caché y dos
 *   peticiones para la misma respuesta.
 *
 * La traducción de estado a booleano sigue saliendo de
 * `CATEGORY_STATUS_TO_IS_ACTIVE`, donde `null` significa "no filtra". Antes esa
 * tabla decidía qué filas pintar y ahora decide qué se le pide al servidor: es
 * la misma pregunta contestada un nivel más abajo.
 */
export function toCategoryFilters(
    query: string,
    status: CategoryStatusFilter
): CategoryFilters {
    const text = query.trim();
    const isActive = CATEGORY_STATUS_TO_IS_ACTIVE[status];

    return {
        ...(text.length > 0 ? { text } : {}),
        ...(isActive !== null ? { isActive } : {}),
    };
}


/**
 * Huella de los filtros aplicados, para `usePagination`.
 *
 * Dos filtros distintos son dos listados distintos, y estar en la página 4 de
 * uno no significa nada en el otro. Esta cadena es lo que se compara para saber
 * que hay que volver a la primera página; da igual cómo se lea, sólo tiene que
 * cambiar exactamente cuando cambie lo que se pide.
 */
export const getCategoryFiltersKey = (
    query: string,
    status: CategoryStatusFilter
): string => `${query.trim()}|${status}`;



/** `1 categoría` · `8 categorías` */
export const formatCategoryCount = (count: number): string =>
    formatPlural(messages.products.categories.count, count);



/**
 * Minúsculas y sin diacríticos: "Café" → "cafe".
 *
 * Queda para comparar nombres entre sí. Buscar ya no pasa por aquí: lo hace el
 * backend, que es el único que ve el catálogo entero — con la búsqueda en
 * memoria, teclear "café" sólo encontraba lo que hubiera en la página cargada.
 */
function normalizeText(value: string): string {
    return value
        .toLowerCase()
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "");
};



/**
 * ¿Hay ya otra categoría con este nombre?
 *
 * Se compara normalizado porque "Bebidas" y "bebidas " son la misma categoría
 * para quien lee la carta, y dos entradas iguales en el filtro del catálogo no
 * hay forma de distinguirlas. `ignoreId` deja fuera la que se está editando:
 * sin él, guardar sin tocar el nombre chocaría consigo misma.
 */
export function isDuplicateCategoryName(
    categories: CategoryList[],
    name: string,
    ignoreId?: string
): boolean {
    const target = normalizeText(name.trim());

    return categories.some(
        (category) =>
            category.id !== ignoreId && normalizeText(category.name) === target
    );
}



/**
 * Qué dice la tabla cuando no pinta ni una fila.
 *
 * Cinco situaciones distintas y la diferencia importa: se está cargando, la
 * petición falló, el catálogo está vacío, la búsqueda no encontró nada, o el
 * estado elegido no tiene ninguna. Un único "sin resultados" para las cinco es
 * el camino corto a que alguien dé por perdidas sus categorías durante un corte
 * de red — o a que se quede mirando una tabla vacía sin caer en que tiene un
 * filtro puesto.
 *
 * El orden de las preguntas es el de la certeza: mientras carga no se sabe
 * nada, un fallo tapa cualquier otra explicación, y sólo cuando la respuesta
 * llegó y vino vacía tiene sentido preguntarse por qué.
 *
 * El término entra en la frase tal y como se escribió, sin recortar más que los
 * espacios: quien buscó "hamburgueza" necesita verlo escrito para encontrar la
 * errata. Y llega el texto **ya aplicado**, no el que se está tecleando: son
 * los resultados de ese texto los que están vacíos.
 */
export function getEmptyMessage({
    isPending,
    isError,
    query,
    status,
}: {
    isPending: boolean;
    isError: boolean;
    query: string;
    status: CategoryStatusFilter;
}): string {
    const message = messages.products.categories;

    if (isPending) return message.loading;
    if (isError) return message.loadError;

    const term = query.trim();

    // `null` cuando el selector está en "Todas": no es un estado, es la
    // ausencia de filtro, y no tiene rótulo que meter en ninguna frase.
    const statusLabel =
        status === DEFAULT_CATEGORY_STATUS_FILTER
            ? null
            : CATEGORY_STATUS_PLURAL_LABELS[status];

    if (term.length > 0 && statusLabel !== null) {
        return formatMessage(message.emptyFiltered.withBoth, {
            query: term,
            status: statusLabel,
        });
    }

    if (term.length > 0) {
        return formatMessage(message.emptyFiltered.withQuery, { query: term });
    }

    if (statusLabel !== null) {
        return formatMessage(message.emptyFiltered.withStatus, {
            status: statusLabel,
        });
    }

    // Sin filtros y sin filas: no es que no se encuentre, es que no hay.
    return message.emptyCatalog;
}