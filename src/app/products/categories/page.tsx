import type { Metadata } from "next";

import { messages } from "@/messages";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { connection } from "next/server";

import Categories from "@/features/products/page/Categories";
import { categoriesQueryOptions, createCategoriesService } from "@/features/products/services/categories.service";
import { httpClient } from "@/lib/http";
import { getQueryClient } from "@/lib/query/query-client";

export const metadata: Metadata = messages.products.metadata.categories;


/**
 * Ruta `/products/categories`.
 *
 * Server Component: no pinta nada por su cuenta. Pide la primera página del
 * listado, deja el resultado sembrado en la caché de TanStack Query y monta
 * `<Categories />` encima. Toda la interacción vive ya en ese componente.
 */
export default async function CategoriesPage() {
    /*
     * La página se renderiza en cada petición, no una vez al construir.
     *
     * Sin esto Next prerrenderiza la ruta durante el `build` y deja fijas en el
     * HTML las categorías que hubiera entonces: el panel enseñaría el catálogo
     * del día del despliegue hasta el siguiente, sin avisar de nada.
     *
     * Se usa `connection()` en vez de `export const dynamic = "force-dynamic"`
     * porque Next 16 elimina esa opción al habilitar Cache Components, y ésta
     * seguirá funcionando igual llegado ese momento.
     */
    await connection();

    // Un cliente por render. `getQueryClient` crea uno nuevo en cada petición
    // del servidor: uno compartido sería una caché común a todos los usuarios
    // que atiende el proceso.
    const queryClient = getQueryClient();

    /*
     * El listado se pide aquí, antes de mandar nada al navegador, para que la
     * tabla llegue pintada en el HTML en lugar de aparecer vacía y rellenarse
     * después.
     *
     * El servicio se construye con el `httpClient` del servidor —el que se
     * importa directamente, no el del contexto de React— y con la paginación
     * por defecto de `categoriesQueryOptions`, que es la misma que usa el hook
     * en su primer render. Si no coincidieran, la clave de caché sería otra y
     * la precarga no serviría de nada.
     *
     * `prefetchQuery` no lanza si el backend falla: guarda el error y sigue.
     * Así un mal segundo de la API no tumba la ruta entera; la pantalla se
     * renderiza igual y el navegador reintenta por su cuenta.
     */
    await queryClient.prefetchQuery(
        categoriesQueryOptions(createCategoriesService(httpClient))
    );

    /*
     * `dehydrate` serializa lo que hay en la caché y `HydrationBoundary` lo
     * siembra en la del navegador antes del primer render del cliente.
     *
     * Con eso `useProductsCategories()`, dentro de `<Categories />`, encuentra
     * los datos ya puestos y no dispara ninguna petición al montar. A partir de
     * ahí la pantalla es autónoma y se refresca cuando algo la invalida.
     */
    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <Categories />
        </HydrationBoundary>
    );
};
