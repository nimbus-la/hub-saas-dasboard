"use client";

// ── Pantalla de productos ───────────────────────────────────────────────────
// Orquesta el listado: búsqueda, pestañas de categoría y paginación. El
// filtrado y la paginación los hace el backend; el estado de los tres vive en
// `useProducts` para que el filtro, la página y el contador nunca se
// contradigan.
//
// Las alertas de las tarjetas no se tocan desde aquí: vienen en el producto
// que devuelve el servicio y son de solo lectura.

import { useRouter } from "next/navigation";
import * as React from "react";

import { TextField } from "@/components/inputs/TextField";
import Pagination from "@/components/pagination/Pagination";
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
import { useCategoryOptions, useProducts } from "../hooks";
import {
    productsPageBodyVariants,
    productsPagePaginationVariants,
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
    const categories = useCategoryOptions();

    const { pagination } = products;

    // Las pestañas no llevan contador porque el backend no cuenta los
    // productos de cada categoría.
    const categoryTabs: FilterTabItem[] = [
        { value: ALL_CATEGORIES, label: COPY.allCategories },
        ...categories.options.map(({ value, label }) => ({ value, label })),
    ];

    const categoryLabel =
        categories.options.find((option) => option.value === products.categoryId)?.label ??
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

                {products.total > 0 && (
                    <Pagination
                        page={pagination.pageNumber}
                        pageSize={pagination.pageSize}
                        totalItems={products.total}
                        onPageChange={pagination.goToPage}
                        onPageSizeChange={pagination.changePageSize}
                        itemLabel={COPY.itemLabel}
                        className={productsPagePaginationVariants()}
                    />
                )}
            </section>
        </div>
    );
};
