"use client";

// ── Pantalla de productos ───────────────────────────────────────────────────
// Orquesta el listado: búsqueda, pestañas de categoría y scroll infinito. El
// filtrado y la paginación los hace el backend; el estado de los tres vive en
// `useProducts` para que el filtro, las páginas cargadas y el contador nunca
// se contradigan.
//
// Las alertas de las tarjetas no se tocan desde aquí: vienen en el producto
// que devuelve el servicio y son de solo lectura.

import { useRouter } from "next/navigation";
import * as React from "react";

import { ConfirmDialog } from "@/components";
import { TextField } from "@/components/inputs/TextField";
import LoadMore from "@/components/pagination/LoadMore";
import { FilterTabs } from "@/components/tabs/FilterTabs";
import type { FilterTabItem } from "@/interfaces";
import { ALL_CATEGORIES, type Product } from "@/lib/products";
import { formatMessage, messages } from "@/messages";
import { ICON_TOKENS } from "@/tokens";

import {
    ProductsEmptyState,
    ProductsGrid,
    ProductsHeader,
} from "../components/list";
import { useCategoryTabs, useDeleteProduct, useProducts } from "../hooks";
import { PRODUCT_CREATE_HREF, getProductEditHref } from "../libs";
import {
    productsPageBodyVariants,
    productsPageSearchVariants,
    productsPageVariants,
} from "../style";

const GRID_PANEL_ID = "products-grid";

/** Todo lo que dice esta pantalla. Ver `@/messages`. */
const COPY = messages.products.list;

export default function Products() {
    const router = useRouter();

    const products = useProducts();
    const categories = useCategoryTabs();
    const deleteProduct = useDeleteProduct();

    // El producto a eliminar se guarda aparte de si el diálogo está abierto,
    // para que el diálogo no se quede sin texto mientras se cierra.
    const [deleteTarget, setDeleteTarget] = React.useState<Product | null>(null);
    const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);

    const categoryTabs: FilterTabItem[] = [
        { value: ALL_CATEGORIES, label: COPY.allCategories, count: products.catalogTotal },
        ...categories.tabs,
    ];

    const categoryLabel =
        categories.tabs.find((tab) => tab.value === products.categoryId)?.label ??
        COPY.allCategoriesLabel;

    const handleCreateProduct = React.useCallback(() => {
        router.push(PRODUCT_CREATE_HREF);
    }, [router]);

    const handleEditProduct = React.useCallback((product: Product) => {
        router.push(getProductEditHref(product.id));
    }, [router]);

    // La tarjeta solo avisa de la intención; borrar es irreversible, así que
    // antes de llamar al servicio se pide confirmación.
    const handleDeleteProduct = React.useCallback((product: Product) => {
        setDeleteTarget(product);
        setIsDeleteOpen(true);
    }, []);

    // El diálogo se cierra cuando el backend responde, no antes, para que el
    // botón muestre que está trabajando.
    const handleDeleteConfirm = async () => {
        if (!deleteTarget) return;

        try {
            await deleteProduct.mutateAsync(deleteTarget.id);
            setIsDeleteOpen(false);
        } catch {
            // El aviso del error ya lo muestra la caché de mutaciones. El
            // diálogo se queda abierto para poder reintentar.
        }
    };

    const handleRetry = () => {
        void products.fetchNextPage();
    };

    return (
        <div className={productsPageVariants()}>
            <ProductsHeader
                totalProducts={products.catalogTotal}
                onCreateProduct={handleCreateProduct}
            />

            <section className={productsPageBodyVariants()}>
                <TextField
                    type="search"
                    size="md"
                    value={products.query}
                    onChange={products.setQuery}
                    clearable
                    leftIcon={<ICON_TOKENS.SEARCH aria-hidden="true" />}
                    placeholder={COPY.searchPlaceholder}
                    aria-label={COPY.searchLabel}
                    className={productsPageSearchVariants()}
                />

                <FilterTabs
                    items={categoryTabs}
                    value={products.categoryId}
                    onChange={products.setCategoryId}
                    label={COPY.tabsLabel}
                    panelId={GRID_PANEL_ID}
                    canLoadMore={categories.canLoadMore}
                    onLoadMore={categories.fetchNextPage}
                    isLoadingMore={categories.isFetchingNextPage}
                />

                <ProductsGrid
                    products={products.data}
                    onEditProduct={handleEditProduct}
                    onDeleteProduct={handleDeleteProduct}
                    panelId={GRID_PANEL_ID}
                    panelLabel={formatMessage(COPY.panelLabel, {
                        category: categoryLabel,
                    })}
                    emptyState={
                        <ProductsEmptyState
                            query={products.query}
                            onClearFilters={products.clear}
                        />
                    }
                />

                <LoadMore
                    sentinelRef={products.sentinelRef}
                    loadedItems={products.data.length}
                    totalItems={products.total}
                    hasNextPage={products.hasNextPage}
                    isFetchingNextPage={products.isFetchingNextPage}
                    isFetchNextPageError={products.isFetchNextPageError}
                    onRetry={handleRetry}
                    itemLabel={COPY.itemLabel}
                />
            </section>

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
                    loading={deleteProduct.isPending}
                />
            )}
        </div>
    );
};
