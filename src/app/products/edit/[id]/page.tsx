import type { Metadata } from "next";
import { Suspense } from "react";
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
import { isHttpError } from "@/lib/http";
import { createServerHttpClient } from "@/lib/http/server-http-client";
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
    const http = await createServerHttpClient();

    // `fetchQuery` y no `prefetchQuery`, porque hace falta el producto para
    // decidir si la página existe. Las categorías no son críticas: si fallan,
    // el selector las vuelve a pedir al montar.
    //
    // Un 401 no dice nada del producto, solo que el acceso caducó: el
    // servidor no renueva (ver `createServerHttpClient`). Queda `undefined`,
    // "sin comprobar", y la pantalla lo pide en el navegador tras renovar.
    const [product] = await Promise.all([
        queryClient
            .fetchQuery(productDetailQueryOptions(createProductsService(http), productId))
            .catch((error: unknown) => {
                if (isHttpError(error) && error.isUnauthorized) return undefined;

                throw error;
            }),
        queryClient.prefetchInfiniteQuery(
            categoriesInfiniteQueryOptions(createCategoriesService(http), ACTIVE_CATEGORY_FILTERS)
        ),
    ]);

    if (product === null) notFound();

    // Sin comprobar, la pantalla intentaría pedir el producto ya en el render
    // del servidor, con el mismo acceso caducado, y el 401 tumbaría la página
    // entera. Dentro de un `Suspense` ese fallo se queda en el límite: el
    // servidor manda el hueco y el navegador termina el render tras renovar.
    const screen = <EditProduct productId={productId} />;

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            {product === undefined ? <Suspense>{screen}</Suspense> : screen}
        </HydrationBoundary>
    );
};
