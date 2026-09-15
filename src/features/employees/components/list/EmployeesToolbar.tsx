"use client";

import GenericButton from "@/components/buttons/GenericButton";
import LinkButton from "@/components/buttons/LinkButton";
import FilterSelect from "@/components/filters/FilterSelect";
import { TextField } from "@/components/inputs/TextField";
import { cn } from "@/lib/utils";
import { formatMessage, messages } from "@/messages";

import { ICON_TOKENS } from "@/tokens";

import {
    employeesToolbarActionVariants,
    employeesToolbarFilterVariants,
    employeesToolbarSearchVariants,
    employeesToolbarSummaryVariants,
    employeesToolbarVariants,
} from "./employees-toolbar.style";
import { EMPLOYEE_STATUS_OPTIONS, EmployeeStatusFilter, formatEmployeeCount } from "../../libs";


/** Lo que dice esta barra. Ver `@/messages`. */
const COPY = messages.employees.toolbar;


/**
 * Barra de filtros de la pantalla de empleados.
 *
 * Componente de presentación: no guarda nada. El estado del buscador y del
 * filtro vive en la pantalla para que el resumen, la tabla y los controles no
 * puedan contradecirse.
 */

interface EmployeesToolbarProps {
    query: string;
    onQueryChange: (value: string) => void;

    status: EmployeeStatusFilter;
    onStatusChange: (value: EmployeeStatusFilter) => void;

    onCreateEmployee: () => void;

    /** Empleados que quedan tras filtrar. */
    visibleCount: number;
    /** Empleados que hay en total, sin filtros. */
    totalCount: number;
    onClearFilters: () => void;

    className?: string;
}

export default function EmployeesToolbar({
    query,
    onQueryChange,
    status,
    onStatusChange,
    onCreateEmployee,
    visibleCount,
    totalCount,
    onClearFilters,
    className,
}: EmployeesToolbarProps) {
    const hasFilters = query.trim().length > 0 || status !== "all";

    return (
        <div className={cn("flex flex-col gap-3", className)}>
            <div className={employeesToolbarVariants()}>
                <TextField
                    type="search"
                    size="md"
                    value={query}
                    onChange={onQueryChange}
                    clearable
                    leftIcon={<ICON_TOKENS.SEARCH aria-hidden="true" />}
                    placeholder={COPY.searchPlaceholder}
                    aria-label={COPY.searchLabel}
                    className={employeesToolbarSearchVariants()}
                />

                <FilterSelect
                    size="md"
                    value={status}
                    onChange={(value) => onStatusChange((value || "all") as EmployeeStatusFilter)}
                    options={EMPLOYEE_STATUS_OPTIONS}
                    placeholder={COPY.allStatuses}
                    aria-label={COPY.filterLabel}
                    className={employeesToolbarFilterVariants()}
                />

                <GenericButton
                    type="button"
                    label={COPY.create}
                    startIcon={ICON_TOKENS.CREATE}
                    onClick={onCreateEmployee}
                    className={employeesToolbarActionVariants()}
                />
            </div>

            {/* El resumen se anuncia sin robar el foco: quien escribe en el
                buscador se entera de cuántos quedan sin salir del campo. */}
            {hasFilters && (
                <p aria-live="polite" className={employeesToolbarSummaryVariants()}>
                    <span className="tabular-nums">
                        {formatMessage(COPY.summary, {
                            visible: formatEmployeeCount(visibleCount),
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