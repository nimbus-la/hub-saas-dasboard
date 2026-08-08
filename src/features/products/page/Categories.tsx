"use client";

// ── Pantalla de categorías ──────────────────────────────────────────────────
// Orquesta el listado: búsqueda, filtro por estado, tabla y los dos diálogos
// —el formulario y la confirmación de borrado—. Los componentes de abajo son
// de presentación; el estado de interfaz vive aquí para que el filtro, el
// resumen y la tabla nunca se contradigan.
//
// Los datos ya no llegan por props ni se guardan en un `useState`: los sirve
// `useCategories()`, que lee de la caché que el Server Component de la ruta
// dejó precargada. Esa es la diferencia que hace que crear funcione: al
// terminar el alta, la mutación invalida el listado y la tabla se repinta sola
// con lo que devolvió el backend. Con una copia en `useState` habría dos
// verdades y habría que sincronizarlas a mano.

import * as React from "react";

import { ConfirmDialog, PageHeader, StatusBadge } from "@/components";
import { getApiErrorMessage } from "@/lib/http";
import { formatMessage, messages } from "@/messages";


import {
    CategoriesTable,
    CategoriesToolbar,
    CategoryFormModal,
} from "../components/categories";
import {
    useCategories,
    useCreateCategory,
    useDeleteCategory,
    useUpdateCategory,
} from "../queries/categories.queries";
import {
    categoriesPageBodyVariants,
    categoriesPageVariants,
} from "./categories.style";
import type { Category, CategoryFormValues } from "../interfaces";
import {
    DEFAULT_CATEGORY_STATUS_FILTER,
    filterCategories,
    formatCategoryCount,
    isDuplicateCategoryName,
    type CategoryStatusFilter,
} from "../libs";
import { toCreateCategoryPayload, toUpdateCategoryPayload } from "../mappers";

/** Destino de la flecha de regreso. La misma ruta que declara el menú lateral. */
const PRODUCTS_LIST_HREF = "/products";

/** Todo lo que dice esta pantalla. Ver `@/messages`. */
const COPY = messages.products.categories;


export default function Categories() {
    const {
        data: categories = [],
        isPending,
        isError,
        error,
    } = useCategories();

    const createCategory = useCreateCategory();
    const updateCategory = useUpdateCategory();
    const deleteCategory = useDeleteCategory();

    const [query, setQuery] = React.useState<string>("");
    const [status, setStatus] = React.useState<CategoryStatusFilter>(DEFAULT_CATEGORY_STATUS_FILTER);


    // ── Filtrado ────────────────────────────────────────────────────────────
    // Sigue en memoria: son unas decenas de registros y traerlos todos una vez
    // es más rápido que ir al servidor en cada tecla del buscador.
    const visibleCategories = React.useMemo(
        () => filterCategories(categories, { query, status }),
        [categories, query, status]
    );

    const hasFilters = query.trim().length > 0 || status !== "all";

    const handleClearFilters = React.useCallback(() => {
        setQuery("");
        setStatus(DEFAULT_CATEGORY_STATUS_FILTER);
    }, []);

    /**
     * Qué dice la tabla cuando no pinta filas.
     *
     * Son cuatro situaciones distintas y la diferencia importa: una tabla vacía
     * porque está cargando, porque la API falló, porque no hay catálogo o
     * porque el filtro no encontró nada piden reacciones opuestas de quien
     * mira. Un único "sin resultados" para las cuatro es el camino corto a que
     * alguien dé por perdidas sus categorías durante un corte de red.
     */
    const emptyMessage = isPending
        ? COPY.loading
        : isError
            ? getApiErrorMessage(error, COPY.loadError)
            : hasFilters
                ? COPY.emptyFiltered
                : COPY.emptyCatalog;


    // ── Formulario ──────────────────────────────────────────────────────────
    // Un solo modal para el alta y la edición: lo que decide el modo es
    // `formTarget`. `null` es un alta y no "todavía no se sabe" —el modal está
    // cerrado hasta que alguien pulsa—, así que no hace falta un tercer estado.
    const [formTarget, setFormTarget] = React.useState<Category | null>(null);
    const [isFormOpen, setIsFormOpen] = React.useState(false);

    /**
     * Error del backend al guardar.
     *
     * Vive aquí y no dentro del formulario porque no es un problema del valor
     * que se escribió —eso ya lo dicen las reglas de react-hook-form— sino del
     * intento de guardarlo. Se limpia al abrir el modal para que el fallo de un
     * intento anterior no reciba al siguiente.
     */
    const [submitError, setSubmitError] = React.useState<string | null>(null);

    const handleCreateCategory = React.useCallback(() => {
        setFormTarget(null);
        setSubmitError(null);
        setIsFormOpen(true);
    }, []);

    const handleEditCategory = React.useCallback((category: Category) => {
        setFormTarget(category);
        setSubmitError(null);
        setIsFormOpen(true);
    }, []);

    /*
     * La unicidad del nombre la comprueba la pantalla porque es la única que
     * tiene la lista entera, y así el aviso sale al escribir en lugar de al
     * enviar. No sustituye a la validación del backend —entre que se cargó la
     * lista y se pulsa Guardar, otra persona pudo crear la misma categoría—:
     * ese choque llega como error de la mutación y se muestra en el modal.
     */
    const isNameTaken = React.useCallback(
        (name: string) => isDuplicateCategoryName(categories, name, formTarget?.id),
        [categories, formTarget]
    );

    /**
     * Guarda el alta o la edición.
     *
     * Es `async` para que react-hook-form mantenga `isSubmitting` en `true`
     * mientras la petición viaja: es lo que deshabilita el botón de envío y
     * evita el doble clic que crearía la categoría dos veces.
     *
     * El modal se cierra **sólo si el guardado salió bien**. Si falla, se queda
     * abierto con lo que se escribió y el motivo encima: cerrarlo tirando el
     * formulario obligaría a reescribirlo entero.
     */
    const handleFormSubmit = React.useCallback(
        async (values: CategoryFormValues) => {
            setSubmitError(null);

            try {
                // Cada modo arma su propio cuerpo. El alta no manda `isActive`
                // —el backend da de alta toda categoría como activa— y la
                // edición sí, que es el único momento en que alguien decide
                // sobre el interruptor.
                if (formTarget) {
                    await updateCategory.mutateAsync({
                        id: formTarget.id,
                        payload: toUpdateCategoryPayload(values),
                    });
                } else {
                    await createCategory.mutateAsync(toCreateCategoryPayload(values));
                }

                setIsFormOpen(false);
            } catch (mutationError) {
                setSubmitError(getApiErrorMessage(mutationError, COPY.saveError));
            }
        },
        [formTarget, createCategory, updateCategory]
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

    /*
     * El diálogo se cierra al resolverse la promesa y no antes: hasta entonces
     * `loading` mantiene el botón ocupado. Por eso cerrar es cosa de esta
     * pantalla y no del propio diálogo.
     */
    const handleDeleteConfirm = React.useCallback(async () => {
        if (!deleteTarget) return;

        try {
            await deleteCategory.mutateAsync(deleteTarget.id);
            setIsDeleteOpen(false);
        } catch {
            // El diálogo se queda abierto para poder reintentar. El detalle del
            // fallo no cabe aquí; queda en `deleteCategory.error` para cuando
            // la pantalla tenga dónde mostrar avisos.
        }
    }, [deleteTarget, deleteCategory]);

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
                    emptyMessage={emptyMessage}
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
                submitError={submitError}
            />

            {/* El diálogo cuelga de la pantalla y no de la fila: la tabla solo
                avisa de que alguien pidió borrar, y quien sabe qué hacer con
                esa intención es esta pantalla. */}
            {deleteTarget && (
                <ConfirmDialog
                    open={isDeleteOpen}
                    onOpenChange={setIsDeleteOpen}
                    title={COPY.delete.title}
                    description={formatMessage(COPY.delete.description, {
                        name: deleteTarget.name,
                    })}
                    confirmLabel={COPY.delete.confirm}
                    cancelLabel={COPY.delete.cancel}
                    onConfirm={handleDeleteConfirm}
                    loading={deleteCategory.isPending}
                />
            )}
        </div>
    );
};
