"use client";

import * as React from "react";
import { FormProvider, useForm } from "react-hook-form";

import { ConfirmDialog, notify, PageHeader, Pagination, StatusBadge } from "@/components";
import { getApiErrorMessage } from "@/lib/http";
import { formatMessage, messages } from "@/messages";

import { CategoriesTable, CategoriesToolbar, CategoryFormModal } from "../components/categories";
import { useProductsCategories } from "../hooks";
import type { CategoryFormValues, CategoryList } from "../interfaces";
import { EMPTY_CATEGORY_FORM_VALUES, formatCategoryCount, getEmptyMessage, isDuplicateCategoryName } from "../libs";
import { toCreateCategoryParams, toUpdateCategoryParams } from "../mappers";
import { categoriesPageBodyVariants, categoriesPagePaginationVariants, categoriesPageVariants } from "../style";


/** Destino de la flecha de regreso. La misma ruta que declara el menú lateral. */
const PRODUCTS_LIST_HREF = "/products";


export default function Categories() {
    const categories = useProductsCategories();

    /**
     * La barra y el pie los gobierna el hook de datos: el texto, el estado y la
     * página forman una sola pregunta al servidor y tienen que moverse juntos.
     * Esta pantalla no filtra nada —el backend devuelve la página ya filtrada—;
     * sólo enchufa los controles y decide qué hacer con los diálogos.
     */
    const { filters, pagination } = categories;


    const form = useForm<CategoryFormValues>({
        defaultValues: EMPTY_CATEGORY_FORM_VALUES,
        mode: "onTouched",
        reValidateMode: "onChange"
    })


    const message = messages.products.categories;


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
     * Aviso de nombre repetido, al escribir en lugar de al enviar.
     *
     * Es una comprobación **de cortesía y no una garantía**: sólo ve las
     * categorías de la página cargada, que desde que el listado se pagina en el
     * servidor no son todas. Detecta el choque frecuente —el que está a la
     * vista— y el resto lo tiene que rechazar el backend al guardar, que es el
     * único que puede afirmarlo mirando el catálogo entero.
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


    /**
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
                    {/* Los manejadores del buscador y del selector son los del
                        hook, sin envolver: la espera del buscador y la vuelta a
                        la primera página ya están resueltas ahí dentro. Lo que
                        se escribe se pinta al instante; lo que se pide espera. */}
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
