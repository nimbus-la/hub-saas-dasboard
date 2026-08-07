import { formatNumber } from "@/lib/format";
import type { BadgeTone } from "@/interfaces";

import type { Category } from "../interfaces";
import {
    CATEGORY_STATUS_LABELS,
    CATEGORY_STATUS_TONES,
    CATEGORY_STATUS_TO_IS_ACTIVE,
    type CategoryStatusFilter,
} from "./categories-const.libs";


/** `Activa` · `Inactiva` */
export const formatCategoryStatus = (isActive: boolean): string =>
    isActive ? CATEGORY_STATUS_LABELS.active : CATEGORY_STATUS_LABELS.inactive;

export const getCategoryStatusTone = (isActive: boolean): BadgeTone =>
    isActive ? CATEGORY_STATUS_TONES.active : CATEGORY_STATUS_TONES.inactive;


/**
 * ¿Esta categoría entra en el filtro de estado elegido?
 *
 * Se lee de corrido: "la opción no exige nada, o el estado coincide con lo que
 * exige". La traducción de opción a booleano vive en
 * `CATEGORY_STATUS_TO_IS_ACTIVE`, así que aquí no hay ni un literal `"active"`
 * suelto que se pueda escribir mal.
 *
 * Está exportada, y no escondida dentro de `filterCategories`, porque el mismo
 * criterio hace falta en cualquier sitio que cuente o resalte categorías por
 * estado — y dos versiones del mismo criterio acaban discrepando.
 */
export const matchesCategoryStatus = (
    category: Category,
    status: CategoryStatusFilter
): boolean => {
    const required = CATEGORY_STATUS_TO_IS_ACTIVE[status];

    return required === null || category.isActive === required;
};



/** `1 categoría` · `8 categorías` */
export const formatCategoryCount = (count: number): string =>
    `${formatNumber(count)} ${count === 1 ? "categoría" : "categorías"}`;



/**
 * Filtra por texto y por estado.
 *
 * La búsqueda ignora acentos y mayúsculas —"cafe" encuentra "Café"— y mira
 * también la descripción: quien busca "temporada" espera encontrar el menú
 * navideño aunque la palabra no esté en su nombre.
 */
export function filterCategories(
    categories: Category[],
    { query, status }: { query: string; status: CategoryStatusFilter }
): Category[] {
    const term = normalizeText(query.trim());

    return categories.filter((category) => {
        if (!matchesCategoryStatus(category, status)) return false;
        if (!term) return true;

        return (
            normalizeText(category.name).includes(term) ||
            normalizeText(category.description).includes(term) ||
            normalizeText(category.id).includes(term)
        );
    });
};



/** Minúsculas y sin diacríticos: "Café" → "cafe". */
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
    categories: Category[],
    name: string,
    ignoreId?: string
): boolean {
    const target = normalizeText(name.trim());

    return categories.some(
        (category) =>
            category.id !== ignoreId && normalizeText(category.name) === target
    );
}