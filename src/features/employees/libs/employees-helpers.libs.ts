import type { BadgeTone } from "@/interfaces";
import { formatMessage, formatPlural, messages } from "@/messages";

import { EmployeeFilters, EmployeeList, EmployeeSex } from "../interfaces";
import {
    DEFAULT_EMPLOYEE_STATUS_FILTER,
    EMPLOYEE_SEX_LABELS,
    EMPLOYEE_STATUS_LABELS,
    EMPLOYEE_STATUS_PLURAL_LABELS,
    EMPLOYEE_STATUS_TONES,
    EMPLOYEE_STATUS_TO_IS_ACTIVE,
    type EmployeeStatusFilter,
} from "./employees-const.libs";


/** `Activo` · `Inactivo` */
export const formatEmployeeStatus = (isActive: boolean): string =>
    isActive ? EMPLOYEE_STATUS_LABELS.active : EMPLOYEE_STATUS_LABELS.inactive;

export const getEmployeeStatusTone = (isActive: boolean): BadgeTone =>
    isActive ? EMPLOYEE_STATUS_TONES.active : EMPLOYEE_STATUS_TONES.inactive;


/**
 * Rótulo legible de un valor de sexo del backend.
 *
 * Si el backend manda un valor que la aplicación no conoce, se devuelve el
 * valor crudo en lugar de un rótulo vacío: una columna que no sabe decir qué es
 * un dato nuevo debe mostrar el dato, no un hueco que parece un fallo de carga.
 */
export const formatEmployeeSex = (sex: string): string =>
    EMPLOYEE_SEX_LABELS[sex as EmployeeSex] ?? sex;


/**
 * Nombre completo para leer y para las etiquetas accesibles.
 *
 * Se compone saltando los huecos: sin segundo nombre o segundo apellido, la
 * frase no deja espacios dobles ni "—" a medias. Es el mismo nombre que se
 * usaría en voz alta, por eso sirve también de `aria-label`.
 */
export const formatEmployeeFullName = (employee: EmployeeList): string =>
    [
        employee.firstName,
        employee.secondName,
        employee.firstLastName,
        employee.secondLastName,
    ]
        .map((part) => part.trim())
        .filter((part) => part.length > 0)
        .join(" ");


/** `1 empleado` · `8 empleados` */
export const formatEmployeeCount = (count: number): string =>
    formatPlural(messages.employees.count, count);


/**
 * Traduce la barra de filtros a lo que entiende el backend.
 *
 * Es el único punto donde "lo que el usuario eligió" se convierte en "lo que se
 * pide", y por eso concentra las dos reglas:
 *
 * · **Se omite lo que no filtra.** Un texto vacío o el estado "Todos" no viajan
 *   como `?text=` ni `?isActive=`: para el backend eso no es "sin filtro", es
 *   un valor, y devolvería cero resultados.
 *
 * · **El texto va recortado.** Buscar `"luna "` y `"luna"` es la misma
 *   intención; sin recortar serían dos entradas distintas en la caché y dos
 *   peticiones para la misma respuesta.
 */
export function toEmployeeFilters(
    query: string,
    status: EmployeeStatusFilter
): EmployeeFilters {
    const text = query.trim();
    const isActive = EMPLOYEE_STATUS_TO_IS_ACTIVE[status];

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
export const getEmployeeFiltersKey = (
    query: string,
    status: EmployeeStatusFilter
): string => `${query.trim()}|${status}`;


/**
 * Qué dice la tabla cuando no pinta ni una fila.
 *
 * Cinco situaciones distintas y la diferencia importa: se está cargando, la
 * petición falló, no hay equipo, la búsqueda no encontró nada, o el estado
 * elegido no tiene a nadie. Ver `getEmptyMessage` de categorías: es el mismo
 * razonamiento, con las palabras del empleado.
 */
export function getEmployeeEmptyMessage({
    isPending,
    isError,
    query,
    status,
}: {
    isPending: boolean;
    isError: boolean;
    query: string;
    status: EmployeeStatusFilter;
}): string {
    const message = messages.employees;

    if (isPending) return message.loading;
    if (isError) return message.loadError;

    const term = query.trim();

    // `null` cuando el selector está en "Todos": no es un estado, es la
    // ausencia de filtro, y no tiene rótulo que meter en ninguna frase.
    const statusLabel =
        status === DEFAULT_EMPLOYEE_STATUS_FILTER
            ? null
            : EMPLOYEE_STATUS_PLURAL_LABELS[status];

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