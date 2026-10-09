"use client";

import React from "react";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { useHttpClient } from "@/context";
import { getApiErrorMessage } from "@/lib/http";

import type { ProfitabilityInput } from "../interfaces";
import { createProductsService, profitabilityQueryOptions } from "../services";


/**
 * Pide al backend la rentabilidad de un costo con su precio o su margen.
 *
 * Con `null` no pregunta nada: es lo que manda quien todavía no tiene datos
 * suficientes para calcular.
 *
 * No espera a que se deje de escribir: quien lo usa le pasa números ya
 * completos. El formulario de producto los retrasa por su cuenta y además
 * calcula al instante al salir del campo, cosa que una espera aquí dentro no
 * le dejaría hacer.
 *
 * Si falla, no sale el aviso global: el error se muestra junto al precio, que
 * es donde la persona lo puede corregir.
 */
export function useProfitability(input: ProfitabilityInput | null) {
    const http = useHttpClient();

    const service = React.useMemo(() => createProductsService(http), [http]);

    const query = useQuery({
        ...profitabilityQueryOptions(service, input ?? { cost: 0 }),
        enabled: input !== null,

        // Deja el cálculo anterior en pantalla mientras llega el nuevo, para
        // que el resumen no parpadee a vacío.
        placeholderData: keepPreviousData,

        meta: { alertOnError: false },
    });

    return {
        /** El último cálculo que respondió, o `null` si todavía no hay ninguno. */
        profitability: input ? (query.data ?? null) : null,

        /** Si el backend todavía no responde a lo que se le pidió. */
        isCalculating: input !== null && query.isFetching,

        /** El mensaje del backend si el cálculo falló, listo para mostrar. */
        errorMessage:
            input && !query.isFetching && query.isError ? getApiErrorMessage(query.error) : null,
    };
}
