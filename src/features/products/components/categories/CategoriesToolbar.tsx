"use client";

import GenericButton from "@/components/buttons/GenericButton";
import LinkButton from "@/components/buttons/LinkButton";
import { InputSelector } from "@/components/inputs/InputSelector";
import { TextField } from "@/components/inputs/TextField";
import { cn } from "@/lib/utils";
import { formatMessage, messages } from "@/messages";

import { ICON_TOKENS } from "@/tokens";

import {
    categoriesToolbarActionVariants,
    categoriesToolbarFilterVariants,
    categoriesToolbarSearchVariants,
    categoriesToolbarSummaryVariants,
    categoriesToolbarVariants,
} from "./categories-toolbar.style";
import { CATEGORY_STATUS_OPTIONS, CategoryStatusFilter, formatCategoryCount } from "../../libs";


/** Lo que dice esta barra. Ver `@/messages`. */
const COPY = messages.products.categories.toolbar;


/**
 * Barra de filtros de la pantalla de categorías.
 *
 * Componente de presentación: no guarda nada. El estado del buscador y del
 * filtro vive en la pantalla para que el resumen, la tabla y los controles no
 * puedan contradecirse.
 */

interface CategoriesToolbarProps {
    query: string;
    onQueryChange: (value: string) => void;

    status: CategoryStatusFilter;
    onStatusChange: (value: CategoryStatusFilter) => void;

    onCreateCategory: () => void;

    /** Categorías que quedan tras filtrar. */
    visibleCount: number;
    /** Categorías que hay en total, sin filtros. */
    totalCount: number;
    onClearFilters: () => void;

    className?: string;
}

export default function CategoriesToolbar({
    query,
    onQueryChange,
    status,
    onStatusChange,
    onCreateCategory,
    visibleCount,
    totalCount,
    onClearFilters,
    className,
}: CategoriesToolbarProps) {
    const hasFilters = query.trim().length > 0 || status !== "all";

    return (
        <div className={cn("flex flex-col gap-3", className)}>
            <div className={categoriesToolbarVariants()}>
                <TextField
                    type="search"
                    size="md"
                    value={query}
                    onChange={onQueryChange}
                    clearable
                    leftIcon={<ICON_TOKENS.SEARCH aria-hidden="true" />}
                    placeholder={COPY.searchPlaceholder}
                    aria-label={COPY.searchLabel}
                    className={categoriesToolbarSearchVariants()}
                />

                <InputSelector
                    size="md"
                    value={status}
                    onChange={(value) =>
                        onStatusChange((value || "all") as CategoryStatusFilter)
                    }
                    options={CATEGORY_STATUS_OPTIONS}
                    leftIcon={<ICON_TOKENS.FILTER aria-hidden="true" />}
                    placeholder={COPY.allStatuses}
                    aria-label={COPY.filterLabel}
                    emptyMessage={COPY.filterEmpty}
                    className={categoriesToolbarFilterVariants()}
                />

                <GenericButton
                    type="button"
                    label={COPY.create}
                    startIcon={ICON_TOKENS.CREATE}
                    onClick={onCreateCategory}
                    className={categoriesToolbarActionVariants()}
                />
            </div>

            {/* El resumen se anuncia sin robar el foco: quien escribe en el
                buscador se entera de cuántas quedan sin salir del campo. */}
            {hasFilters && (
                <p aria-live="polite" className={categoriesToolbarSummaryVariants()}>
                    <span className="tabular-nums">
                        {formatMessage(COPY.summary, {
                            visible: formatCategoryCount(visibleCount),
                            total: totalCount,
                        })}
                    </span>

                    <LinkButton
                        size="sm"
                        label={messages.common.actions.clearFilters}
                        onClick={onClearFilters}
                    />
                </p>
            )}
        </div>
    );
};
