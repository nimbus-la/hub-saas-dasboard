"use client";

import React from "react";

import { useMutationState, type Mutation, type MutationFilters } from "@tanstack/react-query";

import { messages } from "@/messages";
import { GLOBAL_LOADER_TIMING } from "@/tokens";

/**
 * Estado del loader global: si hay que bloquear la pantalla, si el velo ya
 * se ve y qué decir.
 *
 * Sale de la caché de mutaciones y no de cada pantalla. Así una mutación nueva
 * enciende el loader sin que nadie se acuerde de avisarle, y apagarlo es una
 * decisión explícita (`meta: { globalLoading: false }`).
 */


const FALLBACK_MESSAGE = messages.components.globalLoader.fallback;


/** Fuera del hook para que la suscripción reciba siempre los mismos filtros. */
const PENDING_FILTERS: MutationFilters = {
    status: "pending",
    predicate: (mutation: Mutation) =>
        mutation.meta?.globalLoading !== false,
};

const selectMessage = (mutation: Mutation) =>
    mutation.meta?.loadingMessage;


export function useGlobalLoading() {
    const pendingMessages = useMutationState({ filters: PENDING_FILTERS, select: selectMessage });
    const isPending = pendingMessages.length > 0;

    const [isVisible, setIsVisible] = React.useState(false);
    const shownAtRef = React.useRef(0);

    // El texto se guarda aparte porque cuando la mutación termina deja de
    // estar en la lista, y el velo todavía se está yendo: sin esto cambiaría
    // a "Procesando…" justo en la salida.
    const [message, setMessage] = React.useState<string>(FALLBACK_MESSAGE);
    const currentMessage = isPending ? (pendingMessages.at(-1) ?? FALLBACK_MESSAGE) : null;

    if (currentMessage !== null && currentMessage !== message) {
        setMessage(currentMessage);
    }

    React.useEffect(() => {
        if (isPending && !isVisible) {
            const timer = window.setTimeout(() => {
                shownAtRef.current = Date.now();
                setIsVisible(true);
            }, GLOBAL_LOADER_TIMING.showDelay);

            return () => window.clearTimeout(timer);
        }

        if (!isPending && isVisible) {
            const elapsed = Date.now() - shownAtRef.current;
            const remaining = Math.max(0, GLOBAL_LOADER_TIMING.minVisible - elapsed);
            const timer = window.setTimeout(() => setIsVisible(false), remaining);

            return () => window.clearTimeout(timer);
        }

        return undefined;
    }, [isPending, isVisible]);

    return {
        /**
         * La pantalla no admite clics. Empieza con la mutación, antes de que
         * el velo se vea, porque el doble envío pasa en los primeros
         * milisegundos.
         */
        isBlocking: isPending || isVisible,

        /** El velo y la tarjeta ya se muestran. */
        isVisible,

        message,
    };
}
