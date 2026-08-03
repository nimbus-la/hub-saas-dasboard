"use client";

// ── Paginación genérica ─────────────────────────────────────────────────────
// Controla la página y el tamaño de página de cualquier colección: no conoce
// los datos, solo cuántos elementos hay. Reúne las tres piezas que el usuario
// necesita para orientarse en una lista larga:
//
//   · El resumen de lo que está viendo ("Mostrando 1–12 de 22 productos")
//   · El selector de cuántos elementos quiere por página
//   · Los números de página, con puntos suspensivos cuando no caben todos
//
// Uso mínimo:
//   <Pagination page={page} pageSize={pageSize} totalItems={items.length}
//               onPageChange={setPage} onPageSizeChange={setPageSize} />

import { useId } from "react";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";
import type { PaginationProps } from "@/interfaces";

import {
    paginationArrowVariants,
    paginationEllipsisVariants,
    paginationPageVariants,
    paginationSelectVariants,
} from "./pagination.style";

const DEFAULT_PAGE_SIZE_OPTIONS = [8, 12, 24] as const;

const DEFAULT_ITEM_LABEL = { singular: "resultado", plural: "resultados" };

/** Máximo de casillas visibles antes de recurrir a los puntos suspensivos. */
const MAX_VISIBLE_PAGES = 7;

export default function Pagination({
    page,
    pageSize,
    totalItems,
    onPageChange,
    onPageSizeChange,
    pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
    itemLabel = DEFAULT_ITEM_LABEL,
    className,
}: PaginationProps) {
    // Id propio: en una misma pantalla puede haber más de una lista paginada.
    const pageSizeId = useId();

    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

    // La página puede quedar fuera de rango si el filtro encoge la colección;
    // se acota aquí para que el resumen y los botones nunca se contradigan.
    const currentPage = Math.min(Math.max(page, 1), totalPages);

    const firstItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
    const lastItem = Math.min(currentPage * pageSize, totalItems);

    const noun = totalItems === 1 ? itemLabel.singular : itemLabel.plural;
    const pageItems = buildPageItems(currentPage, totalPages);

    return (
        <nav
            aria-label="Paginación"
            className={cn(
                "flex w-full min-w-0 flex-col gap-4",
                "md:flex-row md:items-center md:justify-between",
                className
            )}
        >
            {/* ── Resumen ────────────────────────────────────────────────── */}
            {/* `aria-live` anuncia el nuevo rango al cambiar de página sin
                robar el foco del botón que acaba de pulsarse. */}
            <p aria-live="polite" className="text-xs text-neutral-600">
                Mostrando{" "}
                <span className="font-semibold tabular-nums text-neutral-800">
                    {firstItem}–{lastItem}
                </span>{" "}
                de{" "}
                <span className="font-semibold tabular-nums text-neutral-800">
                    {totalItems.toLocaleString("es-CO")}
                </span>{" "}
                {noun}
            </p>

            <div className="flex flex-wrap items-center justify-between gap-x-5 gap-y-3">
                {/* ── Tamaño de página ───────────────────────────────────── */}
                <div className="flex shrink-0 items-center gap-2">
                    <label
                        htmlFor={pageSizeId}
                        className="shrink-0 text-xs text-neutral-600"
                    >
                        Por página
                    </label>

                    <div className="relative w-[4.5rem]">
                        <select
                            id={pageSizeId}
                            value={pageSize}
                            onChange={(event) =>
                                onPageSizeChange(Number(event.target.value))
                            }
                            className={paginationSelectVariants()}
                        >
                            {pageSizeOptions.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>

                        <ChevronDown
                            size={14}
                            aria-hidden="true"
                            className="pointer-events-none absolute top-1/2 right-2.5 -translate-y-1/2 text-neutral-500"
                        />
                    </div>
                </div>

                {/* ── Números de página ──────────────────────────────────── */}
                {/* Envuelve en varias líneas antes que desbordar: con muchas
                    páginas, nueve controles no caben en un móvil. */}
                <ul className="flex flex-wrap items-center justify-end gap-1">
                    <li>
                        <button
                            type="button"
                            aria-label="Página anterior"
                            disabled={currentPage === 1}
                            onClick={() => onPageChange(currentPage - 1)}
                            className={paginationArrowVariants()}
                        >
                            <ChevronLeft size={16} aria-hidden="true" />
                        </button>
                    </li>

                    {pageItems.map((item, index) =>
                        typeof item === "number" ? (
                            <li key={item}>
                                <button
                                    type="button"
                                    aria-label={`Página ${item}`}
                                    aria-current={item === currentPage ? "page" : undefined}
                                    onClick={() => onPageChange(item)}
                                    className={paginationPageVariants({
                                        selected: item === currentPage,
                                    })}
                                >
                                    {item}
                                </button>
                            </li>
                        ) : (
                            <li
                                // Los dos huecos pueden coexistir, así que la
                                // posición es lo único estable como clave.
                                key={`${item}-${index}`}
                                aria-hidden="true"
                                className={paginationEllipsisVariants()}
                            >
                                …
                            </li>
                        )
                    )}

                    <li>
                        <button
                            type="button"
                            aria-label="Página siguiente"
                            disabled={currentPage === totalPages}
                            onClick={() => onPageChange(currentPage + 1)}
                            className={paginationArrowVariants()}
                        >
                            <ChevronRight size={16} aria-hidden="true" />
                        </button>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

/* -------------------------------------------------------------------------- */
/*  Ventana de páginas                                                         */
/* -------------------------------------------------------------------------- */

type PageItem = number | "gap";

/**
 * Páginas a mostrar: primera, última, la actual con una vecina a cada lado y
 * puntos suspensivos en los saltos — `1 … 4 5 6 … 20`.
 */
function buildPageItems(currentPage: number, totalPages: number): PageItem[] {
    if (totalPages <= MAX_VISIBLE_PAGES) {
        return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    const items: PageItem[] = [1];

    const windowStart = Math.max(2, currentPage - 1);
    const windowEnd = Math.min(totalPages - 1, currentPage + 1);

    if (windowStart > 2) items.push("gap");

    for (let pageNumber = windowStart; pageNumber <= windowEnd; pageNumber++) {
        items.push(pageNumber);
    }

    if (windowEnd < totalPages - 1) items.push("gap");

    items.push(totalPages);

    return items;
}
