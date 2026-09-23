"use client";

import GenericButton from "@/components/buttons/GenericButton";
import LinkButton from "@/components/buttons/LinkButton";
import FilterSelect from "@/components/filters/FilterSelect";
import { TextField } from "@/components/inputs/TextField";
import { cn } from "@/lib/utils";
import { formatMessage, messages } from "@/messages";

import { ICON_TOKENS } from "@/tokens";

import {
    categoriesToolbarActionVariants,
    categoriesToolbarFilterVariants,
    categoriesToolbarRootVariants,
    categoriesToolbarSearchVariants,
    categoriesToolbarSummaryVariants,
    categoriesToolbarVariants,
} from "./categories-toolbar.style";
import {
    CATEGORY_STATUS_OPTIONS,
    CategoryStatusFilter,
    DEFAULT_CATEGORY_STATUS_FILTER,
    formatCategoryCount,
} from "../../libs";


const toolbarMessages = messages.products.categories.toolbar;


/**
 * Barra de búsqueda, filtro de estado y botón de crear. No guarda estado, lo
 * recibe del hook de categorías a través de la pantalla.
 */
interface CategoriesToolbarProps {
    query: string;
    onQueryChange: (value: string) => void;

    status: CategoryStatusFilter;
    onStatusChange: (value: CategoryStatusFilter) => void;

    onCreateCategory: () => void;

    /** Categorías que se ven en la página actual. */
    visibleCount: number;

    /** Categorías que cumplen los filtros, sumando todas las páginas. */
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
    const hasFilters = query.trim().length > 0 || status !== DEFAULT_CATEGORY_STATUS_FILTER;

    return (
        <div className={cn(categoriesToolbarRootVariants(), className)}>
            <div className={categoriesToolbarVariants()}>
                <TextField
                    type="search"
                    size="md"
                    value={query}
                    onChange={onQueryChange}
                    clearable
                    leftIcon={<ICON_TOKENS.SEARCH aria-hidden="true" />}
                    placeholder={toolbarMessages.searchPlaceholder}
                    aria-label={toolbarMessages.searchLabel}
                    className={categoriesToolbarSearchVariants()}
                />

                {/* Si el selector queda vacío se vuelve a Todas. */}
                <FilterSelect
                    size="md"
                    value={status}
                    onChange={(value) =>
                        onStatusChange((value || DEFAULT_CATEGORY_STATUS_FILTER) as CategoryStatusFilter)
                    }
                    options={CATEGORY_STATUS_OPTIONS}
                    placeholder={toolbarMessages.allStatuses}
                    aria-label={toolbarMessages.filterLabel}
                    className={categoriesToolbarFilterVariants()}
                />

                <GenericButton
                    type="button"
                    label={toolbarMessages.create}
                    startIcon={ICON_TOKENS.CREATE}
                    onClick={onCreateCategory}
                    className={categoriesToolbarActionVariants()}
                />
            </div>

            {/* El lector de pantalla lee el resumen sin sacar a la persona del
                buscador, así sabe cuántas categorías quedan mientras escribe. */}
            {hasFilters && (
                <p aria-live="polite" className={categoriesToolbarSummaryVariants()}>
                    <span className="tabular-nums">
                        {formatMessage(toolbarMessages.summary, {
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
}
