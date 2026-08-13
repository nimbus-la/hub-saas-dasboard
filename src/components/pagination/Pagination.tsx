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

import { formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";
import { formatMessage, formatPlural, messages } from "@/messages";
import type { PaginationProps } from "@/interfaces";
import { CONTROL_SIZE, ICON_STROKE_BY_SIZE } from "@/tokens";

import {
    paginationArrowVariants,
    paginationControlsVariants,
    paginationEllipsisVariants,
    paginationLabelVariants,
    paginationListVariants,
    paginationPageSizeVariants,
    paginationPageVariants,
    paginationSelectIconVariants,
    paginationSelectVariants,
    paginationSelectWrapperVariants,
    paginationSummaryValueVariants,
    paginationSummaryVariants,
    paginationVariants,
} from "./pagination.style";

const DEFAULT_PAGE_SIZE_OPTIONS = [8, 12, 24] as const;

const DEFAULT_ITEM_LABEL = messages.components.pagination.items;

/**
 * Los dos huecos del resumen que van resaltados.
 *
 * El resumen llega del catálogo como una sola frase —`Mostrando {range} de
 * {total} {items}`— y se parte por estos huecos en lugar de concatenar trozos
 * traducidos por separado. La diferencia importa: el orden de las piezas es
 * cosa del idioma, y partir por los huecos lo respeta sin que este componente
 * tenga que saber cuál va primero.
 *
 * El grupo de captura hace que `split` conserve los delimitadores, que es
 * justo lo que hay que sustituir.
 */
const SUMMARY_SLOTS = /(\{range\}|\{total\})/;

/** Máximo de casillas visibles antes de recurrir a los puntos suspensivos. */
const MAX_VISIBLE_PAGES = 7;

/** El pie entero va en `sm`, así que los iconos salen de esa misma fila. */
const ICON_SIZE = CONTROL_SIZE.sm.iconSize;
const ICON_STROKE = ICON_STROKE_BY_SIZE.sm;

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

    const noun = formatPlural(itemLabel, totalItems);
    const pageItems = buildPageItems(currentPage, totalPages);

    // La raya del rango es una raya corta (–), no un guión de teclado: separa
    // dos cifras, no une dos palabras.
    const range = `${firstItem}–${lastItem}`;
    const summaryParts = messages.components.pagination.summary.split(SUMMARY_SLOTS);

    return (
        <nav
            aria-label={messages.components.pagination.label}
            className={cn(paginationVariants(), className)}
        >
            {/* ── Resumen ────────────────────────────────────────────────── */}
            {/* `aria-live` anuncia el nuevo rango al cambiar de página sin
                robar el foco del botón que acaba de pulsarse. */}
            <p aria-live="polite" className={paginationSummaryVariants()}>
                {summaryParts.map((part, index) => {
                    if (part === "{range}") {
                        return (
                            <span
                                key={index}
                                className={paginationSummaryValueVariants()}
                            >
                                {range}
                            </span>
                        );
                    }

                    if (part === "{total}") {
                        return (
                            <span
                                key={index}
                                className={paginationSummaryValueVariants()}
                            >
                                {formatNumber(totalItems)}
                            </span>
                        );
                    }

                    // Lo que queda es texto de la frase, con el nombre de lo
                    // que se lista todavía por rellenar.
                    return formatMessage(part, { items: noun });
                })}
            </p>

            <div className={paginationControlsVariants()}>
                {/* ── Tamaño de página ───────────────────────────────────── */}
                <div className={paginationPageSizeVariants()}>
                    <label htmlFor={pageSizeId} className={paginationLabelVariants()}>
                        {messages.components.pagination.pageSize}
                    </label>

                    <div className={paginationSelectWrapperVariants()}>
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
                            size={ICON_SIZE}
                            strokeWidth={ICON_STROKE}
                            aria-hidden="true"
                            className={paginationSelectIconVariants()}
                        />
                    </div>
                </div>

                {/* ── Números de página ──────────────────────────────────── */}
                <ul className={paginationListVariants()}>
                    <li>
                        <button
                            type="button"
                            aria-label={messages.components.pagination.previousPage}
                            disabled={currentPage === 1}
                            onClick={() => onPageChange(currentPage - 1)}
                            className={paginationArrowVariants()}
                        >
                            <ChevronLeft
                                size={ICON_SIZE}
                                strokeWidth={ICON_STROKE}
                                aria-hidden="true"
                            />
                        </button>
                    </li>

                    {pageItems.map((item, index) =>
                        typeof item === "number" ? (
                            <li key={item}>
                                <button
                                    type="button"
                                    aria-label={formatMessage(
                                        messages.components.pagination.page,
                                        { page: String(item) }
                                    )}
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
                            aria-label={messages.components.pagination.nextPage}
                            disabled={currentPage === totalPages}
                            onClick={() => onPageChange(currentPage + 1)}
                            className={paginationArrowVariants()}
                        >
                            <ChevronRight
                                size={ICON_SIZE}
                                strokeWidth={ICON_STROKE}
                                aria-hidden="true"
                            />
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
