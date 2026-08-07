"use client";

// ── Pantalla de categorías ──────────────────────────────────────────────────
// Orquesta el listado: búsqueda, filtro por estado, tabla y los dos diálogos
// —el formulario y la confirmación de borrado—. Los componentes de abajo son
// de presentación; todo el estado vive aquí para que el filtro, el resumen y
// la tabla nunca se contradigan.
//
// Las categorías llegan por props desde el Server Component de la ruta: cuando
// `getCategories` hable con la API, esta pantalla no cambia. Las altas, las
// ediciones y los borrados se resuelven todavía en memoria; cada uno lleva
// anotado dónde entra la llamada al servicio.

import * as React from "react";

import StatusBadge from "@/components/badges/StatusBadge";
import PageHeader from "@/components/layout/PageHeader";
import {
    DEFAULT_CATEGORY_STATUS_FILTER,
    filterCategories,
    formatCategoryCount,
    type Category,
    type CategoryStatusFilter,
} from "@/lib/categories";

import {
    CategoriesTable,
    CategoriesToolbar,
} from "../components/categories";
import {
    categoriesPageBodyVariants,
    categoriesPageVariants,
} from "./categories.style";

/** Destino de la flecha de regreso. La misma ruta que declara el menú lateral. */
const PRODUCTS_LIST_HREF = "/products";

const COPY = {
    title: "Categorías",
    subtitle:
        "Agrupa la carta en secciones. Desactivar una categoría la retira del menú sin borrar sus productos.",
    backLabel: "Volver a la lista de productos",
    emptyCatalog:
        "Todavía no hay categorías. Crea la primera para empezar a agrupar la carta.",
    emptyFiltered:
        "Ninguna categoría coincide con la búsqueda. Prueba con otro texto o cambia el filtro de estado.",
    deleteTitle: "Eliminar categoría",
    deleteConfirm: "Eliminar",
} as const;


interface CategoriesProps {
    categories: Category[];
}

export default function Categories({ categories: initialCategories }: CategoriesProps) {
    const [categories, setCategories] = React.useState(initialCategories);
    const [query, setQuery] = React.useState("");
    const [status, setStatus] = React.useState<CategoryStatusFilter>(
        DEFAULT_CATEGORY_STATUS_FILTER
    );


    // ── Filtrado ────────────────────────────────────────────────────────────
    const visibleCategories = React.useMemo(
        () => filterCategories(categories, { query, status }),
        [categories, query, status]
    );

    const hasFilters = query.trim().length > 0 || status !== "all";

    const handleClearFilters = React.useCallback(() => {
        setQuery("");
        setStatus(DEFAULT_CATEGORY_STATUS_FILTER);
    }, []);

    // ── Formulario ──────────────────────────────────────────────────────────
    const handleCreateCategory = React.useCallback(() => { }, []);

    const handleEditCategory = React.useCallback((category: Category) => { }, []);


    // ── Borrado ─────────────────────────────────────────────────────────────
    const handleDeleteRequest = React.useCallback((category: Category) => { }, []);

    return (
        <div className={categoriesPageVariants()}>
            <PageHeader
                title={COPY.title}
                subtitle={COPY.subtitle}
                backHref={PRODUCTS_LIST_HREF}
                backLabel={COPY.backLabel}
                badge={
                    <StatusBadge
                        size="xs"
                        tone="neutral"
                        label={formatCategoryCount(categories.length)}
                        className="tabular-nums"
                    />
                }
            />

            <section className={categoriesPageBodyVariants()}>
                <CategoriesToolbar
                    query={query}
                    onQueryChange={setQuery}
                    status={status}
                    onStatusChange={setStatus}
                    onCreateCategory={handleCreateCategory}
                    visibleCount={visibleCategories.length}
                    totalCount={categories.length}
                    onClearFilters={handleClearFilters}
                />

                <CategoriesTable
                    categories={visibleCategories}
                    onEditCategory={handleEditCategory}
                    onDeleteCategory={handleDeleteRequest}
                    emptyMessage={
                        hasFilters ? COPY.emptyFiltered : COPY.emptyCatalog
                    }
                />
            </section>
        </div>
    );
};
