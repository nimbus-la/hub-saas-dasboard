import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";

import { messages } from "@/messages";

import EditProduct from "@/features/products/page/EditProduct";
import {
    ACTIVE_CATEGORY_FILTERS,
    categoriesInfiniteQueryOptions,
    createCategoriesService,
    createProductsService,
    productDetailQueryOptions,
} from "@/features/products/services";
import { httpClient } from "@/lib/http";
import { getQueryClient } from "@/lib/query/query-client";

export const metadata: Metadata = messages.products.metadata.edit;

interface EditProductPageProps {
    params: Promise<{ id: string }>;
}

/**
 * Ruta de la edición de producto. El formulario arranca con el producto, así
 * que se pide aquí y la pantalla lo encuentra en la caché; si no existe en el
 * negocio, la ruta responde 404 antes de pintar nada.
 *
 * Las categorías se precargan igual que en el alta, para que el selector del
 * paso 1 no se quede bloqueado esperándolas.
 */
export default async function EditProductPage({ params }: EditProductPageProps) {
    const { id: productId } = await params;

    const queryClient = getQueryClient();

    // `fetchQuery` y no `prefetchQuery`, porque hace falta el producto para
    // decidir si la página existe. Las categorías no son críticas: si fallan,
    // el selector las vuelve a pedir al montar.
    const [product] = await Promise.all([
        queryClient.fetchQuery(productDetailQueryOptions(createProductsService(httpClient), productId)),
        queryClient.prefetchInfiniteQuery(
            categoriesInfiniteQueryOptions(createCategoriesService(httpClient), ACTIVE_CATEGORY_FILTERS)
        ),
    ]);

    if (!product) notFound();

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <EditProduct productId={productId} />
        </HydrationBoundary>
    );
};
