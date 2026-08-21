"use client";

import * as React from "react";
import { FormProvider, useForm } from "react-hook-form";

import { ConfirmDialog, notify, PageHeader, Pagination, StatusBadge } from "@/components";
import { getApiErrorMessage } from "@/lib/http";
import { formatMessage, messages } from "@/messages";

import { CategoriesTable, CategoriesToolbar, CategoryFormModal } from "../components/categories";
import { useProductsCategories } from "../hooks";
import type { CategoryFormValues, CategoryList } from "../interfaces";
import { EMPTY_CATEGORY_FORM_VALUES, formatCategoryCount, getEmptyMessage } from "../libs";
import { toCreateCategoryParams, toUpdateCategoryParams } from "../mappers";
import { categoriesPageBodyVariants, categoriesPagePaginationVariants, categoriesPageVariants } from "../style";


/** Destino de la flecha de regreso. La misma ruta que declara el menú lateral. */
const PRODUCTS_LIST_HREF = "/products";


/**
 * Pantalla de categorías: listado con su barra de filtros, su pie de
 * paginación, el modal de alta y edición, y el diálogo de borrado.
 *
 * Los datos y los filtros los gobierna `useProductsCategories`. Lo que queda
 * aquí es la composición de la vista y el estado de los diálogos: qué modal
 * está abierto y sobre qué categoría.
 */
export default function Categories() {
    const categories = useProductsCategories();

    // Esta pantalla no filtra nada: el backend devuelve la página ya filtrada y
    // el hook mueve texto, estado y página a la vez. Aquí sólo se enchufan los
    // controles.
    const { filters, pagination } = categories;


    const form = useForm<CategoryFormValues>({
        defaultValues: EMPTY_CATEGORY_FORM_VALUES,
        mode: "onTouched",
        reValidateMode: "onChange"
    })


    const message = messages.products.categories;


    // ── Formulario ──────────────────────────────────────────────────────────
    // Un solo modal para el alta y la edición; el modo lo decide `formTarget`.
    // `null` significa alta, no "todavía no se sabe": el modal está cerrado
    // hasta que alguien pulsa, así que no hace falta un tercer estado.
    const [formTarget, setFormTarget] = React.useState<CategoryList | null>(null);
    const [isFormOpen, setIsFormOpen] = React.useState<boolean>(false);

    // ── Borrado ─────────────────────────────────────────────────────────────
    // Dos estados y no uno: `deleteTarget` dice qué se va a borrar y
    // `isDeleteOpen` si el diálogo se ve. Vaciar el objetivo al cerrar dejaría
    // el diálogo sin título ni descripción durante su animación de salida, así
    // que se queda hasta que la siguiente fila lo reemplaza.
    const [deleteTarget, setDeleteTarget] = React.useState<CategoryList | null>(null);
    const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);


    const handleCreateCategory = React.useCallback(() => {
        setFormTarget(null);
        form.reset(EMPTY_CATEGORY_FORM_VALUES);
        setIsFormOpen(true);
    }, []);


    const handleEditCategory = React.useCallback((category: CategoryList) => {
        setFormTarget(category);

        form.reset({
            name: category.name,
            description: category.description,
            isActive: category.isActive
        });

        setIsFormOpen(true);
    }, []);


    /**
     * Guarda el alta o la edición.
     *
     * Es `async` para que react-hook-form mantenga `isSubmitting` mientras la
     * petición viaja: eso deshabilita el botón de envío y evita el doble clic
     * que crearía la categoría dos veces.
     *
     * El modal se cierra sólo si el guardado salió bien. Si falla se queda
     * abierto con lo que se escribió y el motivo encima, en vez de obligar a
     * reescribirlo entero.
     */
    const handleFormSubmit = React.useCallback(
        async (values: CategoryFormValues) => {

            try {
                // Cada modo arma su propio cuerpo. El alta no manda `isActive`
                // porque el backend crea toda categoría activa; la edición sí,
                // que es cuando alguien decide sobre el interruptor.
                if (formTarget) {
                    await categories.update.mutateAsync({
                        id: formTarget.id,
                        params: toUpdateCategoryParams(values, formTarget),
                    });
                } else {
                    await categories.create.mutateAsync(toCreateCategoryParams(values));
                }

                form.reset(EMPTY_CATEGORY_FORM_VALUES);
                setIsFormOpen(false);
            } catch (error: unknown) {
                const errorMessage = getApiErrorMessage(error);
                notify.error(errorMessage);
            }
        },
        [formTarget, categories.create, categories.update]
    );


    const handleDeleteRequest = React.useCallback((category: CategoryList) => {
        setDeleteTarget(category);
        setIsDeleteOpen(true);
    }, []);


    /**
     * Confirma el borrado.
     *
     * El diálogo se cierra al resolverse la promesa y no antes; hasta entonces
     * `loading` mantiene el botón ocupado. Por eso cerrarlo es cosa de esta
     * pantalla y no del propio diálogo.
     */
    const handleDeleteConfirm = React.useCallback(async () => {
        if (!deleteTarget) return;

        try {
            // TODO: Integrar servicio para eliminar categoria.
            // await deleteCategory.mutateAsync(deleteTarget.id);
            setIsDeleteOpen(false);
        } catch {
            // El diálogo se queda abierto para poder reintentar. El detalle del
            // fallo no cabe aquí; queda en `deleteCategory.error` para cuando
            // la pantalla tenga dónde mostrar avisos.
        }
    }, [deleteTarget, /* deleteCategory */]);


    return (
        <FormProvider {...form}>
            <div className={categoriesPageVariants()}>
                <PageHeader
                    title={message.title}
                    subtitle={message.subtitle}
                    backHref={PRODUCTS_LIST_HREF}
                    backLabel={message.backLabel}
                    badge={
                        <StatusBadge
                            size="xs"
                            tone="neutral"
                            label={formatCategoryCount(categories.total)}
                            className="tabular-nums"
                        />
                    }
                />

                <section className={categoriesPageBodyVariants()}>
                    {/* Los manejadores del buscador y del selector son los del
                        hook, sin envolver: la espera del buscador y la vuelta a
                        la primera página ya están resueltas ahí dentro. */}
                    <CategoriesToolbar
                        query={filters.query}
                        onQueryChange={filters.setQuery}
                        status={filters.status}
                        onStatusChange={filters.setStatus}
                        onCreateCategory={handleCreateCategory}
                        visibleCount={categories.data.length}
                        totalCount={categories.total}
                        onClearFilters={filters.clear}
                    />

                    <CategoriesTable
                        categories={categories.data}
                        onEditCategory={handleEditCategory}
                        onDeleteCategory={handleDeleteRequest}
                        emptyMessage={getEmptyMessage({
                            isPending: categories.isLoading,
                            isError: categories.isError,
                            // El texto aplicado, no el que se está tecleando:
                            // la tabla está vacía por culpa del primero.
                            query: filters.params.text ?? "",
                            status: filters.status,
                        })}
                    />

                    {/* El pie sólo aparece cuando hay algo que paginar; sobre un
                        catálogo vacío no añade nada al mensaje de la tabla. El
                        total es el del backend, no el de las filas visibles. */}
                    {categories.total > 0 && (
                        <Pagination
                            page={pagination.pageNumber}
                            pageSize={pagination.pageSize}
                            totalItems={categories.total}
                            onPageChange={pagination.goToPage}
                            onPageSizeChange={pagination.changePageSize}
                            itemLabel={message.itemLabel}
                            className={categoriesPagePaginationVariants()}
                        />
                    )}
                </section>

                <CategoryFormModal
                    open={isFormOpen}
                    onOpenChange={setIsFormOpen}
                    category={formTarget ?? undefined}
                    onSubmit={handleFormSubmit}
                />

                {/* El diálogo cuelga de la pantalla y no de la fila: la tabla
                    sólo avisa de que alguien pidió borrar, y quien decide qué
                    hacer con esa intención es esta pantalla. */}
                {deleteTarget && (
                    <ConfirmDialog
                        open={isDeleteOpen}
                        onOpenChange={setIsDeleteOpen}
                        title={message.delete.title}
                        description={formatMessage(message.delete.description, {
                            name: deleteTarget.name,
                        })}
                        confirmLabel={message.delete.confirm}
                        cancelLabel={message.delete.cancel}
                        onConfirm={handleDeleteConfirm}
                        loading={/* deleteCategory.isPending */ false}
                    />
                )}
            </div>
        </FormProvider>
    );
};
