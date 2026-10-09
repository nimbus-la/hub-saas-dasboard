"use client";

import React from "react";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { useHttpClient } from "@/context";
import { useDebouncedValue } from "@/hooks";
import { getApiErrorMessage } from "@/lib/http";

import type { ProfitabilityInput } from "../interfaces";
import { createProductsService, profitabilityQueryOptions } from "../services";


/**
 * Pide al backend la rentabilidad de un costo con su precio o su margen.
 *
 * Con `null` no pregunta nada: es lo que manda quien todavía no tiene datos
 * suficientes para calcular.
 *
 * El pedido espera a que la persona deje de escribir, para no hacer una
 * petición por cada tecla. Lo que se retrasa es su forma en texto y no el
 * objeto: quien llama arma uno nuevo en cada render, y retrasar el objeto
 * reiniciaría la espera sin fin aunque los números fueran los mismos.
 *
 * Si falla, no sale el aviso global: el error se muestra junto al precio, que
 * es donde la persona lo puede corregir.
 */
export function useProfitability(input: ProfitabilityInput | null) {
    const http = useHttpClient();

    const service = React.useMemo(() => createProductsService(http), [http]);

    const key = input ? JSON.stringify(input) : null;
    const debouncedKey = useDebouncedValue(key);

    // Se vuelve a armar desde el texto ya retrasado, así lo que se pide es
    // exactamente lo que se escribió hace un momento y no una mezcla.
    const debouncedInput = React.useMemo(
        () => (debouncedKey ? (JSON.parse(debouncedKey) as ProfitabilityInput) : null),
        [debouncedKey]
    );

    const query = useQuery({
        ...profitabilityQueryOptions(service, debouncedInput ?? { cost: 0 }),
        enabled: debouncedInput !== null,

        // Deja el cálculo anterior en pantalla mientras llega el nuevo, para
        // que el resumen no parpadee a vacío con cada tecla.
        placeholderData: keepPreviousData,

        meta: { alertOnError: false },
    });

    // Lo que hay en pantalla corresponde a lo escrito solo cuando la espera
    // terminó y la respuesta ya llegó. Antes de eso guardar mandaría números
    // de un cálculo viejo.
    const isPending = key !== debouncedKey || query.isFetching;

    return {
        /** El último cálculo que respondió, o `null` si todavía no hay ninguno. */
        profitability: input ? (query.data ?? null) : null,

        /** Si falta que el backend responda a lo último que se escribió. */
        isCalculating: input !== null && isPending,

        /** El mensaje del backend si el cálculo falló, listo para mostrar. */
        errorMessage:
            input && !isPending && query.isError ? getApiErrorMessage(query.error) : null,
    };
}
