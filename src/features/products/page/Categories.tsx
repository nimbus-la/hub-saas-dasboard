"use client";

import * as React from "react";
import { FormProvider, useForm } from "react-hook-form";

import { ConfirmDialog, notify, PageHeader, Pagination, StatusBadge } from "@/components";
import { getApiErrorMessage } from "@/lib/http";
import { formatMessage, messages } from "@/messages";

import { CategoriesTable, CategoriesToolbar, CategoryFormModal } from "../components/categories";
import { useProductsCategories } from "../hooks";
import type { CategoryFormValues, CategoryList } from "../interfaces";
import { DEFAULT_CATEGORY_STATUS_FILTER, EMPTY_CATEGORY_FORM_VALUES, filterCategories, formatCategoryCount, getEmptyMessage, isDuplicateCategoryName, type CategoryStatusFilter } from "../libs";
import { toCreateCategoryParams, toUpdateCategoryParams } from "../mappers";
import { categoriesPageBodyVariants, categoriesPagePaginationVariants, categoriesPageVariants } from "../style";


/** Destino de la flecha de regreso. La misma ruta que declara el menú lateral. */
const PRODUCTS_LIST_HREF = "/products";


export default function Categories() {
    const categories = useProductsCategories();

    // El pie de paginación lo gobierna el hook de datos: la página y la
    // consulta que la pide viajan juntas. Aquí sólo se enchufa a los controles
    // y se vuelve a la primera al cambiar un filtro.
    const { pagination } = categories;


    const form = useForm<CategoryFormValues>({
        defaultValues: EMPTY_CATEGORY_FORM_VALUES,
        mode: "onTouched",
        reValidateMode: "onChange"
    })


    const message = messages.products.categories;


    const [query, setQuery] = React.useState<string>("");
    const [status, setStatus] = React.useState<CategoryStatusFilter>(DEFAULT_CATEGORY_STATUS_FILTER);

    // ── Formulario ──────────────────────────────────────────────────────────
    // Un solo modal para el alta y la edición: lo que decide el modo es
    // `formTarget`. `null` es un alta y no "todavía no se sabe" —el modal está
    // cerrado hasta que alguien pulsa—, así que no hace falta un tercer estado.
    const [formTarget, setFormTarget] = React.useState<CategoryList | null>(null);
    const [isFormOpen, setIsFormOpen] = React.useState<boolean>(false);

    // ── Borrado ─────────────────────────────────────────────────────────────
    // Dos estados y no uno: `deleteTarget` dice qué se va a borrar y
    // `isDeleteOpen` si el diálogo se ve. Vaciar el objetivo al cerrar dejaría
    // el diálogo sin título ni descripción durante su animación de salida —se
    // vería vaciarse antes de desaparecer—, así que el objetivo se queda hasta
    // que la siguiente fila lo reemplaza.
    const [deleteTarget, setDeleteTarget] = React.useState<CategoryList | null>(null);
    const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);


    /*
     * El buscador y el filtro de estado siguen siendo de memoria y se aplican
     * **sobre la página que hay cargada**, que es lo único que la pantalla
     * tiene. Cuando el backend acepte esos dos filtros, entran como parámetros
     * de `service.list` junto a la página y esto desaparece.
     */
    const visibleCategories = React.useMemo(
        () => filterCategories(categories.data, { query, status }),
        [categories.data, query, status]
    );


    const hasFilters = query.trim().length > 0 || status !== "all";


    /*
     * Cualquier cambio de filtro devuelve a la primera página: quedarse en la 3
     * de un resultado que ahora tiene una sola desorienta, y con la paginación
     * en el servidor además haría pedir una página que no existe.
     */
    const handleQueryChange = React.useCallback((value: string) => {
        setQuery(value);
        pagination.reset();
    }, [pagination]);


    const handleStatusChange = React.useCallback((value: CategoryStatusFilter) => {
        setStatus(value);
        pagination.reset();
    }, [pagination]);


    const handleClearFilters = React.useCallback(() => {
        setQuery("");
        setStatus(DEFAULT_CATEGORY_STATUS_FILTER);
        pagination.reset();
    }, [pagination]);


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
     * La unicidad del nombre la comprueba la patanlla por que es la única que
     * tiene la lista entera, y así el aviso sale al escribir en lugar de enviar.
     */
    const isNameTaken = React.useCallback(
        (name: string) => isDuplicateCategoryName(categories.data, name, formTarget?.id),
        [categories.data, formTarget]
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

            try {
                // Cada modo arma su propio cuerpo. El alta no manda `isActive`
                // —el backend da de alta toda categoría como activa— y la
                // edición sí, que es el único momento en que alguien decide
                // sobre el interruptor.
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


    /*
     * El diálogo se cierra al resolverse la promesa y no antes: hasta entonces
     * `loading` mantiene el botón ocupado. Por eso cerrar es cosa de esta
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
                    <CategoriesToolbar
                        query={query}
                        onQueryChange={handleQueryChange}
                        status={status}
                        onStatusChange={handleStatusChange}
                        onCreateCategory={handleCreateCategory}
                        visibleCount={visibleCategories.length}
                        totalCount={categories.total}
                        onClearFilters={handleClearFilters}
                    />

                    <CategoriesTable
                        categories={visibleCategories}
                        onEditCategory={handleEditCategory}
                        onDeleteCategory={handleDeleteRequest}
                        emptyMessage={getEmptyMessage(categories.isLoading, categories.isError, hasFilters)}
                    />

                    {/* El pie sólo aparece cuando hay algo que paginar: sobre un
                        catálogo vacío no dice nada que el propio mensaje de la
                        tabla no diga ya. El total es el del backend —no el de
                        las filas visibles—, que es lo que hay que recorrer. */}
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
                    isNameTaken={isNameTaken}
                    onSubmit={handleFormSubmit}
                />

                {/* El diálogo cuelga de la pantalla y no de la fila: la tabla solo
                avisa de que alguien pidió borrar, y quien sabe qué hacer con
                esa intención es esta pantalla. */}
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
