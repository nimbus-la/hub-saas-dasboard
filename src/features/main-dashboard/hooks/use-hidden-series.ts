"use client";

// ── Estado de las series ocultas desde la leyenda ───────────────────────────
// Se guardan los ids ocultos (no los visibles) para que al cambiar de periodo
// la selección del usuario se conserve aunque cambien los datos.

import { useCallback, useEffect, useRef, useState } from "react";

export function useHiddenSeries(totalSeriesCount: number) {
    const [hiddenSeriesIds, setHiddenSeriesIds] = useState<ReadonlySet<string>>(
        () => new Set()
    );

    /**
     * Espejo del estado en una ref, para que el efecto que CREA el gráfico
     * pueda leer la selección actual sin declararla como dependencia (si no,
     * el gráfico se recrearía entero en cada clic de la leyenda).
     *
     * Este efecto se registra antes que los del componente que llama al hook,
     * así que la ref siempre está actualizada cuando aquellos se ejecutan.
     */
    const latestHiddenSeriesIdsRef = useRef(hiddenSeriesIds);
    useEffect(() => {
        latestHiddenSeriesIdsRef.current = hiddenSeriesIds;
    }, [hiddenSeriesIds]);

    const toggleSeries = useCallback(
        (seriesId: string) => {
            setHiddenSeriesIds((currentHiddenIds) => {
                if (currentHiddenIds.has(seriesId)) {
                    const nextHiddenIds = new Set(currentHiddenIds);
                    nextHiddenIds.delete(seriesId);
                    return nextHiddenIds;
                }

                // Nunca dejar el gráfico en blanco: la última serie visible no
                // se puede ocultar. Se devuelve el mismo Set para evitar un
                // render inútil.
                const visibleCount = totalSeriesCount - currentHiddenIds.size;
                if (visibleCount <= 1) return currentHiddenIds;

                const nextHiddenIds = new Set(currentHiddenIds);
                nextHiddenIds.add(seriesId);
                return nextHiddenIds;
            });
        },
        [totalSeriesCount]
    );

    return { hiddenSeriesIds, latestHiddenSeriesIdsRef, toggleSeries };
}
