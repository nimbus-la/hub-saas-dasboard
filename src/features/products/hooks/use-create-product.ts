"use client";

import { useRouter } from "next/navigation";
import React from "react";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useHttpClient } from "@/context";
import { messages } from "@/messages";

import type { ProductFormValues } from "../interfaces";
import { PRODUCTS_LIST_HREF } from "../libs";
import { toCreateProductParams } from "../mappers";
import { categoryKeys, createProductsService, productKeys } from "../services";

/**
 * Alta de un producto. Recibe el formulario tal cual y lo convierte aquí, así
 * la pantalla no tiene que saber cómo espera el backend el cuerpo.
 *
 * El aviso de éxito es el mensaje del sobre y el de error lo pone el
 * `MutationCache`; si el alta falla no se navega, y la persona conserva su
 * borrador en el último paso.
 */
export function useCreateProduct() {
    const http = useHttpClient();
    const queryClient = useQueryClient();
    const router = useRouter();

    const service = React.useMemo(() => createProductsService(http), [http]);

    return useMutation({
        mutationFn: (values: ProductFormValues) =>
            service.create(toCreateProductParams(values)),

        onSuccess: () => {
            // También las categorías, porque sus pestañas muestran cuántos
            // productos tiene cada una.
            void queryClient.invalidateQueries({ queryKey: productKeys.lists() });
            void queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });

            router.push(PRODUCTS_LIST_HREF);
        },

        meta: { alertOnSuccess: true, loadingMessage: messages.products.pending.create },
    });
}
