import type { Metadata } from "next";
import { connection } from "next/server";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";

import Categories from "@/features/products/page/Categories";
import { categoriesQueryOptions, createCategoriesService } from "@/features/products/services";
import { httpClient } from "@/lib/http";
import { getQueryClient } from "@/lib/query/query-client";
import { messages } from "@/messages";


export const metadata: Metadata = messages.products.metadata.categories;


/**
 * Ruta de categorías. Pide la primera página en el servidor y la deja en la
 * caché, así la tabla llega con datos en el HTML y no aparece vacía al cargar.
 */
export default async function CategoriesPage() {
    // Hace que la página se genere en cada visita y no una sola vez al hacer
    // el build, que dejaría fijas las categorías de ese momento. Se usa
    // connection porque la opción force dynamic deja de existir al activar
    // Cache Components.
    await connection();

    // Se crea una caché nueva por visita, para no compartir datos entre usuarios.
    const queryClient = getQueryClient();

    // Usa la misma página por defecto que el hook, para que el navegador
    // encuentre los datos en la caché. Si el backend falla no rompe la
    // página, el error queda guardado y el navegador vuelve a intentarlo.
    await queryClient.prefetchQuery(
        categoriesQueryOptions(createCategoriesService(httpClient))
    );

    // Pasa al navegador lo que quedó en la caché, así el hook de categorías
    // no vuelve a pedir el listado al montar.
    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <Categories />
        </HydrationBoundary>
    );
}
