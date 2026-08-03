"use client";

// ── Pantalla de productos ───────────────────────────────────────────────────
// Orquesta el listado: búsqueda, pestañas de categoría y paginación. Los
// componentes de abajo son de presentación; todo el estado vive aquí para que
// el filtro, la página y el contador nunca se contradigan.
//
// Las alertas de las tarjetas no se tocan desde aquí: vienen en el producto
// que devuelve el servicio y son de solo lectura.
//
// El catálogo llega por props desde el Server Component de la ruta: cuando
// `getProducts` hable con la API, esta pantalla no cambia.

import * as React from "react";

import Pagination from "@/components/pagination/Pagination";
import { FilterTabs } from "@/components/tabs/FilterTabs";
import {
    ALL_CATEGORIES,
    DEFAULT_PRODUCT_PAGE_SIZE,
    PRODUCT_CATEGORIES,
    PRODUCT_PAGE_SIZES,
    countByCategory,
    filterProducts,
    type Product,
} from "@/lib/products";
import type { FilterTabItem } from "@/interfaces";

import {
    ProductsEmptyState,
    ProductsGrid,
    ProductsHeader,
    ProductsSearch,
} from "../components";

const GRID_PANEL_ID = "products-grid";

interface ProductsProps {
    products: Product[];
}

export default function Products({ products }: ProductsProps) {
    const [query, setQuery] = React.useState("");
    const [category, setCategory] = React.useState<string>(ALL_CATEGORIES);
    const [page, setPage] = React.useState(1);
    const [pageSize, setPageSize] = React.useState<number>(DEFAULT_PRODUCT_PAGE_SIZE);

    // ── Filtrado ────────────────────────────────────────────────────────────
    // La búsqueda se aplica antes que la categoría para que los contadores de
    // las pestañas reflejen lo que hay tras buscar: si "Bebidas (0)" no avisa,
    // el usuario cambia de pestaña para encontrarse una rejilla vacía.
    const searchResults = React.useMemo(
        () => filterProducts(products, { query, category: ALL_CATEGORIES }),
        [products, query]
    );

    const visibleProducts = React.useMemo(
        () =>
            category === ALL_CATEGORIES
                ? searchResults
                : searchResults.filter((product) => product.category === category),
        [searchResults, category]
    );

    const categoryTabs = React.useMemo<FilterTabItem[]>(() => {
        const counts = countByCategory(searchResults);

        return [
            {
                value: ALL_CATEGORIES,
                label: "Todas",
                count: searchResults.length,
            },
            ...PRODUCT_CATEGORIES.map((name) => ({
                value: name,
                label: name,
                count: counts[name] ?? 0,
            })),
        ];
    }, [searchResults]);

    // ── Paginación ──────────────────────────────────────────────────────────
    // La página se acota en el render en lugar de corregirse con un efecto:
    // así nunca hay un fotograma intermedio con la rejilla vacía.
    const totalPages = Math.max(1, Math.ceil(visibleProducts.length / pageSize));
    const currentPage = Math.min(page, totalPages);

    const pageProducts = React.useMemo(() => {
        const start = (currentPage - 1) * pageSize;

        return visibleProducts.slice(start, start + pageSize);
    }, [visibleProducts, currentPage, pageSize]);

    // ── Manejadores ─────────────────────────────────────────────────────────
    // Cualquier cambio de filtro devuelve a la primera página: quedarse en la
    // 3 de un resultado que ahora tiene una sola página desorienta.
    const handleQueryChange = React.useCallback((value: string) => {
        setQuery(value);
        setPage(1);
    }, []);

    const handleCategoryChange = React.useCallback((value: string) => {
        setCategory(value);
        setPage(1);
    }, []);

    const handlePageSizeChange = React.useCallback((value: number) => {
        setPageSize(value);
        setPage(1);
    }, []);

    const handleClearFilters = React.useCallback(() => {
        setQuery("");
        setCategory(ALL_CATEGORIES);
        setPage(1);
    }, []);

    const handleCreateProduct = React.useCallback(() => {
        // Enlazar con el formulario de alta cuando exista su ruta.
    }, []);

    const handleEditProduct = React.useCallback((product: Product) => {
        // Enlazar con el formulario de edición cuando exista su ruta.
        void product;
    }, []);

    const handleDeleteProduct = React.useCallback((product: Product) => {
        // Pedir confirmación aquí antes de llamar al servicio: la tarjeta solo
        // avisa de la intención, borrar es irreversible.
        void product;
    }, []);

    const categoryLabel = category === ALL_CATEGORIES ? "todas las categorías" : category;

    return (
        <div className="flex flex-col gap-6">
            <ProductsHeader
                totalProducts={products.length}
                onCreateProduct={handleCreateProduct}
            />

            <section className="flex min-w-0 flex-col gap-5">
                <ProductsSearch value={query} onChange={handleQueryChange} />

                <FilterTabs
                    items={categoryTabs}
                    value={category}
                    onChange={handleCategoryChange}
                    label="Categorías de productos"
                    panelId={GRID_PANEL_ID}
                />

                <ProductsGrid
                    products={pageProducts}
                    onEditProduct={handleEditProduct}
                    onDeleteProduct={handleDeleteProduct}
                    panelId={GRID_PANEL_ID}
                    panelLabel={`Productos de ${categoryLabel}`}
                    emptyState={
                        <ProductsEmptyState
                            query={query}
                            onClearFilters={handleClearFilters}
                        />
                    }
                />

                {visibleProducts.length > 0 && (
                    <Pagination
                        page={currentPage}
                        pageSize={pageSize}
                        totalItems={visibleProducts.length}
                        onPageChange={setPage}
                        onPageSizeChange={handlePageSizeChange}
                        pageSizeOptions={PRODUCT_PAGE_SIZES}
                        itemLabel={{ singular: "producto", plural: "productos" }}
                        className="border-t border-neutral-200 pt-5"
                    />
                )}
            </section>
        </div>
    );
};
