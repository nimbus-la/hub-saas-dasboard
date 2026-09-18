"use client";

import * as React from "react";
import { FormProvider, useForm } from "react-hook-form";

import { ConfirmDialog, PageHeader, Pagination, StatusBadge } from "@/components";
import { formatMessage, messages } from "@/messages";

import { CategoriesTable, CategoriesToolbar, CategoryFormModal } from "../components/categories";
import { useProductsCategories } from "../hooks";
import type { CategoryFormValues, CategoryList } from "../interfaces";
import { EMPTY_CATEGORY_FORM_VALUES, formatCategoryCount, getEmptyMessage, PRODUCTS_LIST_HREF } from "../libs";
import { toCategoryFormValues, toCreateCategoryParams, toUpdateCategoryParams } from "../mappers";
import { categoriesPageBodyVariants, categoriesPagePaginationVariants, categoriesPageVariants } from "../style";

const message = messages.products.categories;


/**
 * Pantalla de categorías. Los datos, los filtros y la paginación vienen del
 * hook, y aquí solo se arma la vista y se controla qué diálogo está abierto.
 */
export default function Categories() {
    const categories = useProductsCategories();
    const { filters, pagination } = categories;

    const form = useForm<CategoryFormValues>({
        defaultValues: EMPTY_CATEGORY_FORM_VALUES,
        mode: "onTouched",
        reValidateMode: "onChange",
    });

    // El mismo modal sirve para crear y editar. Si no hay categoría
    // seleccionada, se está creando una nueva.
    const [formTarget, setFormTarget] = React.useState<CategoryList | null>(null);
    const [isFormOpen, setIsFormOpen] = React.useState(false);

    // La categoría a eliminar se guarda aparte de si el diálogo está abierto,
    // para que el diálogo no se quede sin texto mientras se cierra.
    const [deleteTarget, setDeleteTarget] = React.useState<CategoryList | null>(null);
    const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);

    const handleCreateCategory = () => {
        setFormTarget(null);
        form.reset(EMPTY_CATEGORY_FORM_VALUES);
        setIsFormOpen(true);
    };

    const handleEditCategory = (category: CategoryList) => {
        setFormTarget(category);
        form.reset(toCategoryFormValues(category));
        setIsFormOpen(true);
    };

    // Es async para que el formulario quede en estado de envío mientras
    // responde el backend, y así no se pueda enviar dos veces.
    const handleFormSubmit = async (values: CategoryFormValues) => {
        try {
            if (formTarget) {
                await categories.update.mutateAsync(toUpdateCategoryParams(values, formTarget));
            } else {
                await categories.create.mutateAsync(toCreateCategoryParams(values));
            }

            form.reset(EMPTY_CATEGORY_FORM_VALUES);
            setIsFormOpen(false);
        } catch {
            // El aviso del error ya lo muestra la caché de mutaciones. Aquí
            // solo se deja el modal abierto para no perder lo que se escribió.
        }
    };

    const handleDeleteRequest = (category: CategoryList) => {
        setDeleteTarget(category);
        setIsDeleteOpen(true);
    };

    // El diálogo se cierra cuando termina la eliminación, no antes, para que
    // el botón muestre que está cargando.
    const handleDeleteConfirm = async () => {
        if (!deleteTarget) return;

        // TODO: Integrar servicio para eliminar categoria.
        // await deleteCategory.mutateAsync(deleteTarget.id);
        setIsDeleteOpen(false);
    };

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
                            // Se usa el texto ya enviado, porque es el que
                            // produjo la tabla vacía.
                            query: filters.params.text ?? "",
                            status: filters.status,
                        })}
                    />

                    {/* La paginación solo se muestra si hay categorías. */}
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
                        loading={false}
                    />
                )}
            </div>
        </FormProvider>
    );
}
