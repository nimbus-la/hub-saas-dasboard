import type { Metadata } from "next";
import { connection } from "next/server";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";

import { messages } from "@/messages";

import Products from "@/features/products/page/Products";
import {
    ACTIVE_CATEGORIES_PARAMS,
    categoriesQueryOptions,
    createCategoriesService,
    createProductsService,
    productsQueryOptions,
} from "@/features/products/services";
import { httpClient } from "@/lib/http";
import { getQueryClient } from "@/lib/query/query-client";

export const metadata: Metadata = messages.products.metadata.list;

/**
 * Ruta del catálogo. Pide en el servidor la primera página y las categorías
 * de las pestañas, así el listado llega con datos en el HTML.
 */
export default async function ProductsPage() {
    // El catálogo cambia, por eso la página se genera en cada visita.
    await connection();

    const queryClient = getQueryClient();

    // Las dos peticiones no dependen una de otra, así que van a la vez. Si
    // alguna falla, el navegador la vuelve a pedir al montar.
    await Promise.all([
        queryClient.prefetchQuery(productsQueryOptions(createProductsService(httpClient))),
        queryClient.prefetchQuery(
            categoriesQueryOptions(createCategoriesService(httpClient), ACTIVE_CATEGORIES_PARAMS)
        ),
    ]);

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <Products />
        </HydrationBoundary>
    );
};
