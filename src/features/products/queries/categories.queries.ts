"use client";

import React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useHttpClient } from "@/context";

import {
    categoriesQueryOptions,
    categoryKeys,
    createCategoriesService,
    type CategoriesService,
} from "../services/categories.service";
import type {
    Category,
    CreateCategoryPayload,
    UpdateCategoryPayload,
} from "../interfaces";


/**
 * Hooks de datos de categorías
 *
 * La costura entre la pantalla y la librería de estado de servidor. La pantalla
 * llama a `useCategories()` o a `useCreateCategory()`; **no importa
 * `@tanstack/react-query` en ningún sitio**.
 *
 * Por qué importa: TanStack Query no puede esconderse detrás de una clase —un
 * hook tiene que ejecutarse durante el render de un componente, y las clases no
 * renderizan nada—. Lo que sí puede hacerse es que la librería aparezca en un
 * solo tipo de archivo, éste. Si mañana se cambia por SWR se reescriben los
 * `*.queries.ts` y las pantallas no se tocan.
 *
 * Reglas de la casa:
 *
 * 1. Ningún componente llama a `useQuery` ni a `useMutation` directamente.
 * 2. Ninguna clave de caché se escribe a mano: salen todas de `categoryKeys`.
 * 3. La petición vive en el servicio; aquí sólo se decide cuándo se pide y qué
 *    se invalida al terminar.
 */



/** Servicio ya enlazado al cliente HTTP que haya inyectado el proveedor. */
function useCategoriesService(): CategoriesService {
    const http = useHttpClient();

    return React.useMemo(() => createCategoriesService(http), [http]);
};



/* -------------------------------------------------------------------------- */
/*  Lecturas                                                                   */
/* -------------------------------------------------------------------------- */

/**
 * Listado completo de categorías.
 *
 * Comparte configuración con la precarga del Server Component
 * (`categoriesQueryOptions`), así que en el primer pintado los datos ya están
 * en la caché y este hook no dispara ninguna petición: los lee y ya. Sólo
 * vuelve a pedirlos cuando caducan o cuando una mutación los invalida.
 *
 * Devuelve la lista entera sin filtrar. La búsqueda y el filtro de estado los
 * resuelve la pantalla en memoria: son unas decenas de registros y traerlos
 * todos una vez es más rápido que ir al servidor en cada tecla.
 */
export function useCategories() {
    const http = useHttpClient();

    return useQuery(categoriesQueryOptions(http));
};



/* -------------------------------------------------------------------------- */
/*  Escrituras                                                                 */
/* -------------------------------------------------------------------------- */
//
// Las tres exponen `isPending` —el estado de carga del botón— y rechazan la
// promesa de `mutateAsync` cuando el backend falla, para que la pantalla pueda
// decidir si cierra el modal o enseña el error.
//
// Todas devuelven la promesa de `invalidateQueries` desde `onSuccess`: así
// `isPending` sigue en `true` hasta que el listado está fresco y el modal se
// cierra sobre datos ya actualizados, en vez de cerrarse antes y dejar ver la
// tabla vieja durante un instante.

/**
 * Alta de una categoría.
 *
 * No mete la fila en la caché a mano: invalida el listado y deja que se vuelva
 * a pedir. Es una petición de más, y a cambio la tabla muestra exactamente lo
 * que guardó el backend —con su `id` y su `placedAt` de verdad— en lugar de una
 * versión inventada en el navegador que podría no coincidir.
 */
export function useCreateCategory() {
    const service = useCategoriesService();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: CreateCategoryPayload) => service.create(payload),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: categoryKeys.list() }),
    });
};


export function useUpdateCategory() {
    const service = useCategoriesService();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: UpdateCategoryPayload }) =>
            service.update(id, payload),

        onSuccess: (updated: Category) => {
            // El detalle se refresca con lo que devolvió el backend en vez de
            // volver a pedirlo: la respuesta del PUT ya es la versión buena.
            queryClient.setQueryData(categoryKeys.detail(updated.id), updated);

            return queryClient.invalidateQueries({ queryKey: categoryKeys.list() });
        },
    });
};


export function useDeleteCategory() {
    const service = useCategoriesService();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => service.remove(id),

        onSuccess: (_result: void, id: string) => {
            // Se saca de la caché el detalle de algo que ya no existe, para que
            // una pantalla que lo tuviera abierto no lo resucite desde ahí.
            queryClient.removeQueries({ queryKey: categoryKeys.detail(id) });

            return queryClient.invalidateQueries({ queryKey: categoryKeys.list() });
        },
    });
};
