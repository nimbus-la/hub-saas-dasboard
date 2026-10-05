"use client";

import { useRouter } from "next/navigation";
import React from "react";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useHttpClient } from "@/context";

import type { ProductFormValues } from "../interfaces";
import { PRODUCTS_LIST_HREF } from "../libs";
import { hasProductChanges, toUpdateProductParams } from "../mappers";
import { categoryKeys, createProductsService, productKeys } from "../services";

/**
 * Edición de un producto. Recibe el formulario tal cual y aquí se compara con
 * cómo empezó, para mandar solo lo que cambió.
 *
 * Si no cambió nada no se llama al backend, que respondería con un error de
 * "sin cambios". Se vuelve al listado igual que si se hubiera guardado, y como
 * la mutación devuelve `null` no sale ningún aviso.
 *
 * El aviso de éxito es el mensaje del sobre y el de error lo pone el
 * `MutationCache`; si el backend rechaza la edición no se navega, y la persona
 * conserva sus cambios en el último paso.
 */
export function useUpdateProduct(productId: string, initialValues: ProductFormValues) {
    const http = useHttpClient();
    const queryClient = useQueryClient();
    const router = useRouter();

    const service = React.useMemo(() => createProductsService(http), [http]);

    return useMutation({
        mutationFn: async (values: ProductFormValues) => {
            const params = toUpdateProductParams(productId, values, initialValues);

            return hasProductChanges(params) ? service.update(params) : null;
        },

        onSuccess: (response) => {
            if (response) {
                void queryClient.invalidateQueries({ queryKey: productKeys.lists() });
                void queryClient.invalidateQueries({ queryKey: productKeys.detail(productId) });

                // También las categorías, porque sus pestañas cuentan los
                // productos y el producto pudo cambiar de categoría.
                void queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
            }

            router.push(PRODUCTS_LIST_HREF);
        },

        meta: { alertOnSuccess: true },
    });
}
