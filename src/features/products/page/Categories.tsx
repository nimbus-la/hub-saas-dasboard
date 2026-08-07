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

import { ConfirmDialog, PageHeader, StatusBadge } from "@/components";
import {
    DEFAULT_CATEGORY_STATUS_FILTER,
    filterCategories,
    formatCategoryCount,
    isDuplicateCategoryName,
    nextCategoryId,
    type Category,
    type CategoryStatusFilter,
} from "@/lib/categories";

import {
    CategoriesTable,
    CategoriesToolbar,
    CategoryFormModal,
} from "../components/categories";
import {
    toCategoryFields,
    type CategoryFormValues,
} from "../libs/category-form";
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
    deleteCancel: "Cancelar",
} as const;


/**
 * Qué se pierde al borrar.
 *
 * Nombra la categoría en lugar de decir "esta categoría": el diálogo se abre
 * desde una fila cualquiera de una tabla de ocho iguales, y quien pulsa quiere
 * comprobar que apuntó a la correcta antes de confirmar.
 *
 * Y ofrece la salida buena. Desactivar es lo que se quiere hacer nueve de cada
 * diez veces —la categoría deja de ofrecerse pero conserva sus productos—, así
 * que el diálogo lo dice justo donde alguien está a punto de borrar por no
 * saber que existía esa opción.
 */
const deleteDescription = (category: Category): string =>
    `Se eliminará «${category.name}» y sus productos quedarán sin categoría. ` +
    `Si solo quieres retirarla de la carta, desactívala en su lugar.`;


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
    // Un solo modal para el alta y la edición: lo que decide el modo es
    // `formTarget`. `null` es un alta y no "todavía no se sabe" —el modal está
    // cerrado hasta que alguien pulsa—, así que no hace falta un tercer estado.
    const [formTarget, setFormTarget] = React.useState<Category | null>(null);
    const [isFormOpen, setIsFormOpen] = React.useState(false);

    const handleCreateCategory = React.useCallback(() => {
        setFormTarget(null);
        setIsFormOpen(true);
    }, []);

    const handleEditCategory = React.useCallback((category: Category) => {
        setFormTarget(category);
        setIsFormOpen(true);
    }, []);

    /*
     * La unicidad del nombre la resuelve la pantalla porque es la única que
     * tiene la lista entera. Al editar se excluye la propia categoría: sin eso,
     * guardar sin tocar el nombre chocaría consigo misma.
     */
    const isNameTaken = React.useCallback(
        (name: string) =>
            isDuplicateCategoryName(categories, name, formTarget?.id),
        [categories, formTarget]
    );

    const handleFormSubmit = React.useCallback(
        (values: CategoryFormValues) => {
            const fields = toCategoryFields(values);

            // La fecha que pinta la tabla es la de la última actualización, así
            // que la toca tanto el alta como la edición.
            const placedAt = new Date().toISOString();

            // Aquí entran las llamadas al servicio (`POST /categories` y
            // `PATCH /categories/:id`). Hasta entonces el id lo continúa
            // `nextCategoryId`, que es lo único de esto con fecha de caducidad.
            setCategories((current) => {
                if (!formTarget) {
                    return [
                        { id: nextCategoryId(current), placedAt, ...fields },
                        ...current,
                    ];
                }

                // Se reconstruye la fila entera en vez de fusionarla: al vaciar
                // la descripción, `fields` ya no trae la propiedad, y un
                // `{ ...category, ...fields }` habría conservado la anterior.
                return current.map((category) =>
                    category.id === formTarget.id
                        ? { id: category.id, placedAt, ...fields }
                        : category
                );
            });

            setIsFormOpen(false);
        },
        [formTarget]
    );


    // ── Borrado ─────────────────────────────────────────────────────────────
    // Dos estados y no uno: `deleteTarget` dice qué se va a borrar y
    // `isDeleteOpen` si el diálogo se ve. Vaciar el objetivo al cerrar dejaría
    // el diálogo sin título ni descripción durante su animación de salida —se
    // vería vaciarse antes de desaparecer—, así que el objetivo se queda hasta
    // que la siguiente fila lo reemplaza.
    const [deleteTarget, setDeleteTarget] = React.useState<Category | null>(null);
    const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);

    const handleDeleteRequest = React.useCallback((category: Category) => {
        setDeleteTarget(category);
        setIsDeleteOpen(true);
    }, []);

    const handleDeleteConfirm = React.useCallback(() => {
        if (!deleteTarget) return;

        // Aquí entra la llamada al servicio (`DELETE /categories/:id`). Cuando
        // exista, el diálogo se cierra al resolverse la promesa y no antes, y
        // el `loading` de ConfirmDialog pasa a tener sentido: por eso cerrar es
        // cosa de esta pantalla y no del propio diálogo.
        setCategories((current) =>
            current.filter((category) => category.id !== deleteTarget.id)
        );

        setIsDeleteOpen(false);
    }, [deleteTarget]);

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

            {/* El modal se monta siempre: `useCategoryForm` recarga el borrador
                al abrir, así que la misma instancia sirve para el alta y para
                cualquier fila sin arrastrar lo que se escribió en la anterior. */}
            <CategoryFormModal
                open={isFormOpen}
                onOpenChange={setIsFormOpen}
                category={formTarget ?? undefined}
                isNameTaken={isNameTaken}
                onSubmit={handleFormSubmit}
            />

            {/* El diálogo cuelga de la pantalla y no de la fila: la tabla solo
                avisa de que alguien pidió borrar, y quien sabe qué hacer con
                esa intención —y tiene la lista para quitarle el elemento— es
                esta pantalla. */}
            {deleteTarget && (
                <ConfirmDialog
                    open={isDeleteOpen}
                    onOpenChange={setIsDeleteOpen}
                    title={COPY.deleteTitle}
                    description={deleteDescription(deleteTarget)}
                    confirmLabel={COPY.deleteConfirm}
                    cancelLabel={COPY.deleteCancel}
                    onConfirm={handleDeleteConfirm}
                />
            )}
        </div>
    );
};
