"use client";

// ── Estado vacío del catálogo ───────────────────────────────────────────────
// Un listado sin resultados es un callejón sin salida: además de decir que no
// hay nada, repite qué se buscó y ofrece la salida (limpiar los filtros).

import GenericButton from "@/components/buttons/GenericButton";
import { cn } from "@/lib/utils";
import { formatMessage, messages } from "@/messages";
import { ICON_SIZE, ICON_STROKE_BY_SIZE, ICON_TOKENS } from "@/tokens";

import {
    productsEmptyStateIconVariants,
    productsEmptyStateMessageVariants,
    productsEmptyStateTextVariants,
    productsEmptyStateTitleVariants,
    productsEmptyStateVariants,
} from "./products-empty-state.style";

/** Lo que dice el callejón sin salida. Ver `@/messages`. */
const COPY = messages.products.list.empty;

interface ProductsEmptyStateProps {
    /** Término buscado — se cita para que se vea si hubo una errata. */
    query: string;
    onClearFilters: () => void;
    className?: string;
}

export default function ProductsEmptyState({
    query,
    onClearFilters,
    className,
}: ProductsEmptyStateProps) {
    const trimmedQuery = query.trim();

    return (
        <div className={cn(productsEmptyStateVariants(), className)}>
            <div className={productsEmptyStateIconVariants()}>
                <ICON_TOKENS.NO_RESULTS
                    size={ICON_SIZE["2xl"]}
                    strokeWidth={ICON_STROKE_BY_SIZE["2xl"]}
                    aria-hidden="true"
                    className="text-neutral-600"
                />
            </div>

            <div className={productsEmptyStateTextVariants()}>
                <p className={productsEmptyStateTitleVariants()}>
                    {COPY.title}
                </p>

                <p className={productsEmptyStateMessageVariants()}>
                    {trimmedQuery
                        ? formatMessage(COPY.withQuery, { query: trimmedQuery })
                        : COPY.withoutQuery}
                </p>
            </div>

            {/* Única salida del callejón sin salida, así que va en primario:
                la variante `secondary` deja el texto en neutral-500 y no llega
                al contraste mínimo sobre blanco. */}
            <GenericButton
                variant="primary"
                size="md"
                label={messages.common.actions.clearFilters}
                onClick={onClearFilters}
            />
        </div>
    );
};
