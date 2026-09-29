"use client";

// ── Pie del scroll infinito ─────────────────────────────────────────────────
// La alternativa a `Pagination` cuando la lista crece hacia abajo en vez de
// cambiar de página. Se usa junto con `useInfiniteScroll`, que es quien pide
// la siguiente tanda; este componente solo pone el centinela y cuenta cómo va.
//
// El centinela va siempre montado, aunque no haya nada que pedir: el
// observador se engancha a él al montar la pantalla y solo se enciende o se
// apaga con `enabled`, sin depender de que el nodo aparezca más tarde.
//
// Cuando ya no quedan páginas el pie desaparece: la lista termina donde
// termina y no hace falta decirlo.

import GenericButton from "@/components/buttons/GenericButton";
import type { LoadMoreProps } from "@/interfaces";
import { cn } from "@/lib/utils";
import { formatMessage, formatPlural, messages } from "@/messages";

import {
    loadMoreSentinelVariants,
    loadMoreTextVariants,
    loadMoreVariants,
} from "./load-more.style";

/** Lo que dice el pie. Ver `@/messages`. */
const COPY = messages.components.loadMore;

/** Cómo se llama lo listado cuando quien lo usa no lo dice. */
const DEFAULT_ITEM_LABEL = messages.components.pagination.items;

export default function LoadMore({
    sentinelRef,
    loadedItems,
    totalItems,
    hasNextPage,
    isFetchingNextPage,
    isFetchNextPageError,
    onRetry,
    itemLabel = DEFAULT_ITEM_LABEL,
    className,
}: LoadMoreProps) {
    const isVisible = totalItems > 0 && (hasNextPage || isFetchNextPageError);

    const status = (() => {
        if (isFetchingNextPage) return COPY.loading;
        if (isFetchNextPageError) return COPY.error;
        return formatMessage(COPY.summary, {
            loaded: loadedItems,
            total: totalItems,
            items: formatPlural(itemLabel, totalItems),
        });
    })();

    return (
        <>
            <div
                ref={sentinelRef}
                aria-hidden="true"
                className={loadMoreSentinelVariants()}
            />

            {isVisible && (
                <div className={cn(loadMoreVariants(), className)}>
                    <p role="status" className={loadMoreTextVariants()}>
                        {status}
                    </p>

                    {/* Tras un fallo el scroll deja de pedir por su cuenta para
                        no entrar en bucle; seguir es decisión del usuario. */}
                    {isFetchNextPageError && (
                        <GenericButton
                            variant="primary"
                            size="md"
                            label={messages.common.actions.retry}
                            onClick={onRetry}
                        />
                    )}
                </div>
            )}
        </>
    );
};
