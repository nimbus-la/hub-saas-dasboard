import type { BadgeTone } from "@/interfaces";
import { formatMessage, formatPlural, messages } from "@/messages";

import type { CategoryFilters, CategoryFormValues } from "../interfaces";

const copy = messages.products.categories;


/**
 * Marca de posición de una descripción vacía.
 *
 * Una raya y no una celda en blanco: el hueco vacío se lee como un fallo de
 * carga, la raya dice "aquí no hay nada y es correcto".
 */
export const EMPTY_DESCRIPTION = "-";


/* -------------------------------------------------------------------------- */
/*  Filtro por estado                                                          */
/* -------------------------------------------------------------------------- */

/**
 * Valores del filtro de estado.
 *
 * `all` es un valor de verdad y no la ausencia de filtro: el selector siempre
 * tiene algo elegido, y "Todas" es una opción tan explícita como las otras dos.
 */
export const CATEGORY_STATUS_FILTERS = ["all", "active", "inactive"] as const;

export type CategoryStatusFilter = (typeof CATEGORY_STATUS_FILTERS)[number];

/*
 * Se declara con `satisfies` y no con una anotación de tipo para que conserve
 * su tipo literal (`"all"`, no `CategoryStatusFilter`). `satisfies` sigue
 * comprobando que sea una opción válida, pero al mantener el literal, comparar
 * contra esta constante **descarta** `"all"` del resto de ramas — que es lo que
 * permite indexar los rótulos de estado sin un `as` de por medio.
 */
export const DEFAULT_CATEGORY_STATUS_FILTER = "all" satisfies CategoryStatusFilter;


/**
 * Qué valor de `isActive` exige cada opción del filtro.
 *
 * El estado de una categoría es un booleano, pero el filtro tiene **tres**
 * posiciones: sí, no, y "me da igual". Esa tercera es la que no cabe en un
 * booleano, y de ahí salía el ternario anidado que había antes:
 *
 *     status === "all" || (status === "active" ? isActive : !isActive)
 *
 * Traducirlo a una tabla de correspondencias lo vuelve declarativo: cada opción
 * dice qué exige y `null` significa "no filtra". Añadir un estado nuevo pasa a
 * ser una fila más aquí en lugar de otra rama en una condición.
 */
export const CATEGORY_STATUS_TO_IS_ACTIVE: Record<
    CategoryStatusFilter,
    boolean | null
> = {
    all: null,
    active: true,
    inactive: false,
};


/* -------------------------------------------------------------------------- */
/*  Presentación del estado                                                    */
/* -------------------------------------------------------------------------- */
// El rótulo y el tono se resuelven aquí y no en la tabla para que cualquier
// vista que muestre una categoría la pinte igual.
//
// Las claves son `active` / `inactive` y no `true` / `false` a propósito:
// nombran el estado, no el valor del campo. Un `CATEGORY_STATUS_LABELS[true]`
// obligaría a leer el tipo para saber qué significa.

export const CATEGORY_STATUS_LABELS = copy.status;

/** Los mismos estados en plural y minúscula, para meterlos dentro de una frase. */
export const CATEGORY_STATUS_PLURAL_LABELS = copy.statusPlural;

export const CATEGORY_STATUS_TONES: Record<
    keyof typeof CATEGORY_STATUS_LABELS,
    BadgeTone
> = {
    active: "success",
    inactive: "neutral",
};


/**
 * Opciones del selector, en el orden en que se leen.
 *
 * Se declara como constante de módulo —y no como literal en el JSX— porque el
 * selector memoiza su lista por identidad: un array nuevo en cada render la
 * recalcularía entera en cada tecla del buscador de al lado.
 */
export const CATEGORY_STATUS_OPTIONS: {
    value: CategoryStatusFilter;
    label: string;
}[] = [
        { value: "all", label: copy.toolbar.allStatuses },
        { value: "active", label: CATEGORY_STATUS_LABELS.active },
        { value: "inactive", label: CATEGORY_STATUS_LABELS.inactive },
    ];



export const EMPTY_CATEGORY_FORM_VALUES: CategoryFormValues = {
    name: "",
    description: "",
    isActive: true,
};


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