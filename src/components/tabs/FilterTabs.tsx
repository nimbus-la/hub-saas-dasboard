"use client";

// ── Pestañas de filtrado ────────────────────────────────────────────────────
// Grupo de pestañas controlado que segmenta una colección (categorías, estados,
// periodos…). Implementa el patrón ARIA de tabs con activación automática: las
// flechas mueven el foco y filtran a la vez, que es lo que se espera cuando la
// pestaña no abre una vista nueva sino que acota la que ya está en pantalla.
//
// El componente no conoce el dominio: recibe las opciones y el valor activo.
//
// Uso mínimo:
//   <FilterTabs items={items} value={category} onChange={setCategory}
//               label="Categorías" panelId="products-grid" />

import * as React from "react";

import { cn } from "@/lib/utils";
import type { FilterTabsProps } from "@/interfaces";

import { filterTabCountVariants, filterTabVariants } from "./filter-tabs.style";

export function FilterTabs({
    items,
    value,
    onChange,
    label,
    panelId,
    className,
}: FilterTabsProps) {
    const baseId = React.useId();

    // Se guarda un nodo por pestaña para poder devolver el foco tras navegar
    // con el teclado; el índice del array no sirve porque las opciones pueden
    // reordenarse entre renders.
    const tabRefs = React.useRef<Record<string, HTMLButtonElement | null>>({});

    const handleKeyDown = React.useCallback(
        (event: React.KeyboardEvent<HTMLDivElement>) => {
            const currentIndex = items.findIndex((item) => item.value === value);
            if (currentIndex === -1) return;

            const lastIndex = items.length - 1;
            let nextIndex: number;

            switch (event.key) {
                case "ArrowRight":
                    nextIndex = currentIndex === lastIndex ? 0 : currentIndex + 1;
                    break;
                case "ArrowLeft":
                    nextIndex = currentIndex === 0 ? lastIndex : currentIndex - 1;
                    break;
                case "Home":
                    nextIndex = 0;
                    break;
                case "End":
                    nextIndex = lastIndex;
                    break;
                default:
                    return;
            }

            const nextItem = items[nextIndex];
            if (!nextItem) return;

            // Evita que las flechas desplacen el contenedor horizontal por su
            // cuenta: el scroll lo provoca el propio `focus()`.
            event.preventDefault();

            onChange(nextItem.value);
            tabRefs.current[nextItem.value]?.focus();
        },
        [items, onChange, value]
    );

    return (
        // La línea divisoria vive fuera del contenedor con scroll; dentro solo
        // van las pestañas, que lo arrastran en horizontal cuando no caben.
        // El tirón de 1px hace que el subrayado de la pestaña activa tape la
        // línea en lugar de apilarse encima.
        <div className={cn("w-full min-w-0 border-b border-neutral-200", className)}>
            <div className="-mb-px w-full min-w-0 overflow-x-auto pt-1">
                <div
                    role="tablist"
                    aria-label={label}
                    onKeyDown={handleKeyDown}
                    className="flex min-w-max items-end gap-5 px-0.5 sm:gap-6"
                >
                    {items.map((item) => {
                        const isSelected = item.value === value;

                        return (
                            <button
                                key={item.value}
                                ref={(node) => {
                                    tabRefs.current[item.value] = node;
                                }}
                                type="button"
                                role="tab"
                                id={`${baseId}-${item.value}`}
                                aria-selected={isSelected}
                                aria-controls={panelId}
                                // Roving tabindex: el grupo entero ocupa una sola
                                // parada de tabulador y dentro se navega con flechas.
                                tabIndex={isSelected ? 0 : -1}
                                data-selected={isSelected}
                                onClick={() => onChange(item.value)}
                                className={filterTabVariants()}
                            >
                                {item.label}

                                {item.count !== undefined && (
                                    <span
                                        aria-hidden="true"
                                        className={filterTabCountVariants({ selected: isSelected })}
                                    >
                                        {item.count}
                                    </span>
                                )}

                                {/* El contador se oculta al lector de pantalla y se
                                    repite como texto: "Bebidas 4" se leería como un
                                    número suelto sin decir de qué. */}
                                {item.count !== undefined && (
                                    <span className="sr-only">
                                        {item.count === 1
                                            ? ", 1 resultado"
                                            : `, ${item.count} resultados`}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
