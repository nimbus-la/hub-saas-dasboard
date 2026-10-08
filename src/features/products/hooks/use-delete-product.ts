"use client";

import React from "react";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useHttpClient } from "@/context";

import { categoryKeys, createProductsService, productKeys } from "../services";

/**
 * Baja de un producto. El aviso de éxito es el mensaje del sobre y el de error
 * lo pone el `MutationCache`, así que la pantalla solo decide cuándo cerrar el
 * diálogo.
 */
export function useDeleteProduct() {
    const http = useHttpClient();
    const queryClient = useQueryClient();

    const service = React.useMemo(() => createProductsService(http), [http]);

    return useMutation({
        mutationFn: (productId: string) => service.delete({ productId }),

        onSuccess: (_response, productId) => {
            // Las listas incluyen la del catálogo sin filtros, que es de donde
            // sale el total de la cabecera.
            void queryClient.invalidateQueries({ queryKey: productKeys.lists() });

            // El detalle se quita en vez de refrescarse: volver a pedirlo
            // solo traería un producto que ya no existe.
            queryClient.removeQueries({ queryKey: productKeys.detail(productId) });

            // Las pestañas de categoría cuentan productos.
            void queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
        },

        meta: { alertOnSuccess: true },
    });
}
