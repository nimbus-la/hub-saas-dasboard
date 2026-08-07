// ── Datos: categorías de la carta ───────────────────────────────────────────
// Módulo de datos desacoplado de la vista, igual que `products.ts`. Reemplaza
// `getCategories` por tu servicio cuando esté listo (puede volverse async y
// devolver el mismo shape).
//
// La categoría es la agrupación que ve el comensal en la carta y la que usa el
// equipo para filtrar el catálogo. Por eso desactivar no es borrar: una
// categoría inactiva deja de ofrecerse sin perder los productos que cuelgan de
// ella, y es lo que se hace nueve de cada diez veces que alguien va a "borrar
// una categoría".

import { formatNumber } from "@/lib/format";
import type { BadgeTone } from "@/interfaces";

export interface Category {
    /** Identificador que publica el backend. Se muestra tal cual. */
    id: string;
    name: string;
    /**
     * Descripción para la carta.
     *
     * Opcional a propósito: la mayoría de las categorías se explican solas y
     * obligar a escribir una frase produce descripciones que repiten el
     * nombre.
     */
    description?: string;
    /** ¿Se ofrece hoy en la carta? */
    active: boolean;
    placedAt: string; // ISO 8601
}

// ── Presentación del estado ─────────────────────────────────────────────────
// El tono se resuelve aquí y no en la tabla para que cualquier vista que
// muestre una categoría pinte el mismo color.

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

/** `Activa` · `Inactiva` */
export const formatCategoryStatus = (active: boolean): string =>
    active ? CATEGORY_STATUS_LABELS.active : CATEGORY_STATUS_LABELS.inactive;

export const getCategoryStatusTone = (active: boolean): BadgeTone =>
    active ? CATEGORY_STATUS_TONES.active : CATEGORY_STATUS_TONES.inactive;

// ── Filtro por estado ───────────────────────────────────────────────────────

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

// ── Catálogo de ejemplo ─────────────────────────────────────────────────────
// Los nombres coinciden con `PRODUCT_CATEGORIES` de `products.ts`: son la
// misma lista vista desde los dos lados. Cuando el backend mande las
// categorías de verdad, la constante de productos sale de aquí.

const CATEGORIES: Category[] = [
    {
        id: "c01",
        name: "Platos fuertes",
        description: "Hamburguesas, pizzas y todo lo que se sirve como plato principal.",
        active: true,
        placedAt: "2024-01-01T00:00:00Z",
    },
    {
        id: "c02",
        name: "Antojitos",
        description: "Tacos, quesadillas y gringas para compartir.",
        active: true,
        placedAt: "2024-01-01T00:00:00Z",
    },
    {
        id: "c03",
        name: "Entradas",
        description: "Para abrir el apetito mientras llega el plato fuerte.",
        active: true,
        placedAt: "2024-01-01T00:00:00Z",
    },
    {
        id: "c04",
        name: "Ensaladas",
        active: true,
        placedAt: "2024-01-01T00:00:00Z",
    },
    {
        id: "c05",
        name: "Bebidas",
        description: "Naturales, gaseosas y línea de café.",
        active: true,
        placedAt: "2024-01-01T00:00:00Z",
    },
    {
        id: "c06",
        name: "Postres",
        description: "Cierre dulce de la carta.",
        active: true,
        placedAt: "2024-01-01T00:00:00Z",
    },
    {
        id: "c07",
        name: "Desayunos",
        description: "Solo se ofrece de 7:00 a 11:00 en la sucursal Centro.",
        active: false,
        placedAt: "2024-01-01T00:00:00Z",
    },
    {
        id: "c08",
        name: "Menú navideño",
        description: "Carta de temporada. Se reactiva en diciembre.",
        active: false,
        placedAt: "2024-01-01T00:00:00Z",
    },
];

/** Catálogo completo, en el orden en que se muestra en la carta. */
export function getCategories(): Category[] {
    return CATEGORIES;
}

// ── Etiquetas del dominio ───────────────────────────────────────────────────

/** `1 categoría` · `8 categorías` */
export const formatCategoryCount = (count: number): string =>
    `${formatNumber(count)} ${count === 1 ? "categoría" : "categorías"}`;

/**
 * Marca de posición de una descripción vacía.
 *
 * Una raya y no una celda en blanco: el hueco vacío se lee como un fallo de
 * carga, la raya dice "aquí no hay nada y es correcto".
 */
export const EMPTY_DESCRIPTION = "-";

// ── Consultas ───────────────────────────────────────────────────────────────

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
        const matchesStatus =
            status === "all" ||
            (status === "active" ? category.active : !category.active);

        if (!matchesStatus) return false;
        if (!term) return true;

        return (
            normalizeText(category.name).includes(term) ||
            normalizeText(category.description ?? "").includes(term) ||
            normalizeText(category.id).includes(term)
        );
    });
}

/** Minúsculas y sin diacríticos: "Café" → "cafe". */
function normalizeText(value: string): string {
    return value
        .toLowerCase()
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "");
}

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

/**
 * Identificador de la siguiente categoría.
 *
 * Provisional, y con fecha de caducidad: el id lo asigna el backend en cuanto
 * exista. Hasta entonces continúa la serie `c01`, `c02`… a partir del mayor
 * que haya, para que borrar la última y crear otra no reutilice su id.
 */
export function nextCategoryId(categories: Category[]): string {
    const highest = categories.reduce((max, category) => {
        const digits = Number.parseInt(category.id.replace(/\D/g, ""), 10);

        return Number.isNaN(digits) ? max : Math.max(max, digits);
    }, 0);

    return `c${String(highest + 1).padStart(2, "0")}`;
}
