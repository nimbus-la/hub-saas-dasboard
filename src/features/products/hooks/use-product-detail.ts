"use client";

import React from "react";

import { useSuspenseQuery } from "@tanstack/react-query";

import { useHttpClient } from "@/context";

import { createProductsService, productDetailQueryOptions } from "../services";

/**
 * Un producto completo para editarlo, o `null` si no existe.
 *
 * Es de suspenso porque la ruta ya lo dejó en la caché desde el servidor: la
 * pantalla lo recibe al primer render y puede arrancar el formulario con él,
 * sin un estado de carga intermedio.
 */
export function useProductDetail(productId: string) {
    const http = useHttpClient();

    const service = React.useMemo(() => createProductsService(http), [http]);

    return useSuspenseQuery(productDetailQueryOptions(service, productId)).data;
}
