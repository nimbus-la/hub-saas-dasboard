import type { BadgeTone } from "@/interfaces";
import { formatMessage, formatPlural, messages } from "@/messages";

import type { CategoryFilters, CategoryFormValues } from "../interfaces";


const categoryMessages = messages.products.categories;


/**
 * Lo que se muestra en la tabla cuando una categoría no tiene descripción. Se
 * usa una raya porque una celda en blanco parece un error de carga.
 */
export const EMPTY_DESCRIPTION = "-";


/**
 * Opciones del filtro de estado. Todas es una opción más y no la falta de
 * filtro, porque el selector siempre tiene algo elegido.
 */
export const CATEGORY_STATUS_FILTERS = ["all", "active", "inactive"] as const;


export type CategoryStatusFilter = (typeof CATEGORY_STATUS_FILTERS)[number];


/**
 * Se usa satisfies en vez de anotar el tipo para que TypeScript lo tome como
 * el valor exacto all. Así, al compararlo con el estado, TypeScript sabe que
 * en las demás ramas solo puede ser active o inactive.
 */
export const DEFAULT_CATEGORY_STATUS_FILTER = "all" satisfies CategoryStatusFilter;


/**
 * Valor de isActive que pide cada opción del filtro. Null significa que no se
 * filtra por estado. Para agregar una opción nueva basta con sumar una fila.
 */
export const CATEGORY_STATUS_TO_IS_ACTIVE: Record<
    CategoryStatusFilter,
    boolean | null
> = {
    all: null,
    active: true,
    inactive: false,
};


/**
 * Nombres de los estados. Están aquí y no en la tabla para que cualquier
 * pantalla muestre una categoría de la misma forma.
 */
export const CATEGORY_STATUS_LABELS = categoryMessages.status;


/** Los mismos estados en plural y minúscula, para usarlos dentro de una frase. */
export const CATEGORY_STATUS_PLURAL_LABELS = categoryMessages.statusPlural;


/** Color de la etiqueta de cada estado. */
export const CATEGORY_STATUS_TONES: Record<
    keyof typeof CATEGORY_STATUS_LABELS,
    BadgeTone
> = {
    active: "success",
    inactive: "neutral",
};


/** Opciones del selector de estado, en el orden en que se muestran. */
export const CATEGORY_STATUS_OPTIONS: {
    value: CategoryStatusFilter;
    label: string;
}[] = [
        { value: "all", label: categoryMessages.toolbar.allStatuses },
        { value: "active", label: CATEGORY_STATUS_LABELS.active },
        { value: "inactive", label: CATEGORY_STATUS_LABELS.inactive },
    ];


/** Valores del formulario al crear una categoría nueva. */
export const EMPTY_CATEGORY_FORM_VALUES: CategoryFormValues = {
    name: "",
    description: "",
    isActive: true,
};


/** Devuelve Activa o Inactiva según el estado. */
export const formatCategoryStatus = (isActive: boolean): string =>
    isActive ? CATEGORY_STATUS_LABELS.active : CATEGORY_STATUS_LABELS.inactive;


/** Devuelve el color de la etiqueta según el estado. */
export const getCategoryStatusTone = (isActive: boolean): BadgeTone =>
    isActive ? CATEGORY_STATUS_TONES.active : CATEGORY_STATUS_TONES.inactive;


/**
 * Convierte lo elegido en la barra de filtros en lo que se envía al backend.
 * Un filtro sin elegir no se envía, porque el backend tomaría un valor vacío
 * como filtro y no devolvería nada. El texto se recorta para que buscar con o
 * sin espacios al final no haga dos peticiones distintas.
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
 * Texto que cambia cada vez que cambian los filtros. La paginación lo compara
 * para saber cuándo volver a la primera página.
 */
export const getCategoryFiltersKey = (
    query: string,
    status: CategoryStatusFilter
): string => `${query.trim()}|${status}`;


/** Devuelve el total con su palabra, por ejemplo 1 categoría u 8 categorías. */
export const formatCategoryCount = (count: number): string =>
    formatPlural(categoryMessages.count, count);


/**
 * Mensaje de la tabla cuando no tiene filas. Distingue si está cargando, si
 * falló, si no hay categorías o si los filtros no encontraron nada, para que
 * nadie piense que perdió sus datos. El texto que llega es el de la última
 * búsqueda enviada, porque es el que dejó la tabla vacía.
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
    if (isPending) return categoryMessages.loading;
    if (isError) return categoryMessages.loadError;

    const term = query.trim();

    // Con Todas no hay estado que nombrar en el mensaje.
    const statusLabel =
        status === DEFAULT_CATEGORY_STATUS_FILTER
            ? null
            : CATEGORY_STATUS_PLURAL_LABELS[status];

    if (term.length > 0 && statusLabel !== null) {
        return formatMessage(categoryMessages.emptyFiltered.withBoth, {
            query: term,
            status: statusLabel,
        });
    }

    if (term.length > 0) {
        return formatMessage(categoryMessages.emptyFiltered.withQuery, { query: term });
    }

    if (statusLabel !== null) {
        return formatMessage(categoryMessages.emptyFiltered.withStatus, {
            status: statusLabel,
        });
    }

    // Sin filtros y sin filas quiere decir que todavía no hay categorías.
    return categoryMessages.emptyCatalog;
}
