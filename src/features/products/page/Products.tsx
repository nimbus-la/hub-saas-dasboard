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
import { useCategoryTabs, useProducts } from "../hooks";
import {
    productsPageBodyVariants,
    productsPageSearchVariants,
    productsPageVariants,
} from "../style";

const GRID_PANEL_ID = "products-grid";

/** Todo lo que dice esta pantalla. Ver `@/messages`. */
const COPY = messages.products.list;

/** Formulario de alta. La misma ruta que declara el menú lateral. */
const CREATE_PRODUCT_HREF = "/products/create";

export default function Products() {
    const router = useRouter();

    const products = useProducts();
    const categories = useCategoryTabs();

    const categoryTabs: FilterTabItem[] = [
        { value: ALL_CATEGORIES, label: COPY.allCategories, count: products.catalogTotal },
        ...categories.tabs,
    ];

    const categoryLabel =
        categories.tabs.find((tab) => tab.value === products.categoryId)?.label ??
        COPY.allCategoriesLabel;

    const handleCreateProduct = React.useCallback(() => {
        router.push(CREATE_PRODUCT_HREF);
    }, [router]);

    const handleEditProduct = React.useCallback((product: Product) => {
        // Enlazar con el formulario de edición cuando exista su ruta.
        void product;
    }, []);

    const handleDeleteProduct = React.useCallback((product: Product) => {
        // Pedir confirmación aquí antes de llamar al servicio: la tarjeta solo
        // avisa de la intención, borrar es irreversible.
        void product;
    }, []);

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
        </div>
    );
};
