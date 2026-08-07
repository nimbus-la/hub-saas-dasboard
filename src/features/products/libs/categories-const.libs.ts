import type { BadgeTone } from "@/interfaces";


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

export const DEFAULT_CATEGORY_STATUS_FILTER: CategoryStatusFilter = "all";


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

export const CATEGORY_STATUS_LABELS = {
    active: "Activa",
    inactive: "Inactiva",
} as const;

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
        { value: "all", label: "Todos los estados" },
        { value: "active", label: CATEGORY_STATUS_LABELS.active },
        { value: "inactive", label: CATEGORY_STATUS_LABELS.inactive },
    ];
