import type { Metadata } from "next";
import { connection } from "next/server";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";

import { messages } from "@/messages";

import CreateProduct from "@/features/products/page/CreateProduct";
import { ACTIVE_CATEGORY_FILTERS, categoriesInfiniteQueryOptions, createCategoriesService } from "@/features/products/services";
import { createServerHttpClient } from "@/lib/http/server-http-client";
import { getQueryClient } from "@/lib/query/query-client";

export const metadata: Metadata = messages.products.metadata.create;

/**
 * Ruta del alta de producto. El formulario parte vacío, pero el selector de
 * categoría necesita la primera tanda de categorías activas, así que se pide
 * aquí y el paso 1 no se queda bloqueado esperándola.
 */
export default async function CreateProductPage() {
    // Las categorías cambian, por eso la página se genera en cada visita.
    await connection();

    const queryClient = getQueryClient();
    const http = await createServerHttpClient();

    // Misma consulta que usa el selector, así el navegador la encuentra en la
    // caché. Si falla, el selector la vuelve a pedir al montar.
    await queryClient.prefetchInfiniteQuery(
        categoriesInfiniteQueryOptions(createCategoriesService(http), ACTIVE_CATEGORY_FILTERS)
    );

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <CreateProduct />
        </HydrationBoundary>
    );
};
