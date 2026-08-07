import type { Metadata } from "next";
import { connection } from "next/server";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";

import Categories from "@/features/products/page/Categories";
import { categoriesQueryOptions } from "@/features/products/services/categories.service";
import { httpClient } from "@/lib/http";
import { getQueryClient } from "@/lib/query/query-client";

export const metadata: Metadata = {
    title: "Categorías · Vorea",
    description: "Secciones en las que se agrupa la carta de tus sucursales.",
};

export default async function CategoriesPage() {
    /*
     * La página se renderiza en cada petición, no una vez al construir.
     *
     * Sin esto, Next prerrenderiza la ruta durante el `build` y hornea en el
     * HTML las categorías que hubiera en ese momento: el panel enseñaría el
     * catálogo del día del despliegue hasta el siguiente. Con datos de gestión
     * eso no es una optimización, es un error silencioso.
     *
     * Se usa `connection()` y no `export const dynamic = "force-dynamic"`
     * porque Next 16 elimina esa opción en cuanto se habilita Cache Components;
     * ésta seguirá funcionando igual cuando llegue ese momento.
     */
    await connection();

    // Cliente propio de este render. `getQueryClient` crea uno nuevo en cada
    // petición del servidor a propósito: uno compartido sería una caché común a
    // todos los usuarios que atiende el proceso.
    const queryClient = getQueryClient();

    /*
     * El listado se pide aquí, en el servidor, antes de mandar nada al
     * navegador. Así la tabla llega pintada en el HTML en vez de aparecer vacía
     * y rellenarse después.
     *
     * `prefetchQuery` no lanza si el backend falla: guarda el error y sigue. Es
     * lo que se quiere —la pantalla se renderiza igual y el navegador reintenta
     * por su cuenta— en vez de tumbar la ruta entera porque la API tuvo un mal
     * segundo.
     */
    await queryClient.prefetchQuery(categoriesQueryOptions(httpClient));

    /*
     * `dehydrate` serializa lo que hay en la caché y `HydrationBoundary` lo
     * siembra en la caché del navegador antes del primer render del cliente.
     *
     * El resultado es que `useCategories()`, dentro de `<Categories />`,
     * encuentra los datos ya puestos y no dispara ninguna petición al montar:
     * la precarga del servidor no se desperdicia. A partir de ahí la pantalla
     * es autónoma y se refresca sola cuando algo la invalida.
     */
    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <Categories />
        </HydrationBoundary>
    );
};
