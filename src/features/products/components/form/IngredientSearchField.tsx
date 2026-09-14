"use client";

import * as React from "react";

import { TextField } from "@/components";
import type { Ingredient } from "@/lib/ingredients";
import { cn } from "@/lib/utils";
import { formatMessage, formatPlural, messages } from "@/messages";
import { ICON_TOKENS } from "@/tokens";

import { useIngredientSearch } from "../../hooks/use-ingredient-search";
import type { IngredientSearchFieldProps } from "../../interfaces";
import { RECIPE_VALIDATION } from "../../utils";
import IngredientSearchResult from "./IngredientSearchResult";
import {
    ingredientSearchEmptyVariants,
    ingredientSearchFooterVariants,
    ingredientSearchListVariants,
    ingredientSearchResultsVariants,
    ingredientSearchVariants,
} from "./ingredient-search-field.style";


const searchMessages = messages.products.create.recipe.search;
const listMessages = messages.products.create.recipe.list;


/**
 * Buscador de insumos del inventario.
 *
 * No guarda ningún valor del formulario. Cuando se elige un insumo lo envía por
 * `onAdd`, vacía el campo y devuelve el foco, porque lo normal es añadir varios
 * insumos seguidos.
 *
 * Teclado:
 * - Enter no envía el formulario. Si hay un solo resultado, lo añade.
 * - Flecha abajo pasa al primer resultado, y las flechas se mueven entre ellos.
 * - Escape vacía la búsqueda.
 */
export default function IngredientSearchField({
    selectedIds,
    onAdd,
    error,
    ref,
    className,
}: IngredientSearchFieldProps) {
    const { query, setQuery, clear, term, results, hiddenCount, status } =
        useIngredientSearch(selectedIds);

    const inputRef = React.useRef<HTMLInputElement>(null);
    const listRef = React.useRef<HTMLUListElement>(null);

    // El campo necesita su propia referencia para devolverse el foco, y además
    // tiene que pasarle la suya al componente que lo usa.
    React.useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

    const handleAdd = React.useCallback(
        (ingredient: Ingredient) => {
            onAdd(ingredient);
            clear();
            // El botón que se pulsó desaparece con la lista, así que el foco
            // vuelve al campo para seguir buscando.
            inputRef.current?.focus();
        },
        [onAdd, clear]
    );

    const focusResult = (position: number) => {
        const buttons = listRef.current?.querySelectorAll("button");
        buttons?.[position]?.focus();
    };

    const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            // Sin esto, Enter enviaría el formulario y saltaría al paso siguiente.
            event.preventDefault();

            const [onlyResult] = results;
            if (results.length === 1 && onlyResult) handleAdd(onlyResult);
            return;
        }

        if (event.key === "ArrowDown" && results.length > 0) {
            event.preventDefault();
            focusResult(0);
            return;
        }

        if (event.key === "Escape" && query) {
            event.preventDefault();
            clear();
        }
    };

    const handleListKeyDown = (event: React.KeyboardEvent<HTMLUListElement>) => {
        if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;

        event.preventDefault();

        const buttons = [...(listRef.current?.querySelectorAll("button") ?? [])];
        const current = buttons.indexOf(document.activeElement as HTMLButtonElement);
        const next = event.key === "ArrowDown" ? current + 1 : current - 1;

        // Subir desde el primer resultado vuelve al campo.
        if (next < 0) {
            inputRef.current?.focus();
            return;
        }

        focusResult(Math.min(next, buttons.length - 1));
    };

    const helperText =
        status === "full"
            ? formatMessage(listMessages.limitReached, {
                max: RECIPE_VALIDATION.maxIngredients,
            })
            : searchMessages.helper;

    return (
        <div className={cn(ingredientSearchVariants(), className)}>
            <TextField
                ref={inputRef}
                type="search"
                size="md"
                label={searchMessages.label}
                placeholder={searchMessages.placeholder}
                helperText={helperText}
                // La receta vacía no tiene un campo propio donde marcar el
                // error, así que se muestra aquí, que es donde se arregla.
                error={error ?? false}
                value={query}
                onChange={setQuery}
                onKeyDown={handleInputKeyDown}
                // Con la receta llena no se busca, pero el campo sigue activo
                // para no perder el foco al añadir el último insumo.
                readOnly={status === "full"}
                clearable
                autoComplete="off"
                leftIcon={<ICON_TOKENS.SEARCH aria-hidden="true" />}
            />

            {/* Solo se anuncia la cantidad. Los resultados se recorren con el
                teclado y el lector de pantalla los lee al llegar a cada uno. */}
            <p aria-live="polite" className="sr-only">
                {status === "results" ? formatPlural(searchMessages.resultsCount, results.length) : ""}
            </p>

            {status === "results" && (
                <div className={ingredientSearchResultsVariants()}>
                    <ul
                        ref={listRef}
                        aria-label={searchMessages.resultsLabel}
                        onKeyDown={handleListKeyDown}
                        className={ingredientSearchListVariants()}
                    >
                        {results.map((ingredient) => (
                            <li key={ingredient.id}>
                                <IngredientSearchResult ingredient={ingredient} onAdd={handleAdd} />
                            </li>
                        ))}
                    </ul>

                    {hiddenCount > 0 && (
                        <p className={ingredientSearchFooterVariants()}>
                            {formatMessage(searchMessages.more, {
                                shown: results.length,
                                total: results.length + hiddenCount,
                            })}
                        </p>
                    )}
                </div>
            )}

            {(status === "empty" || status === "allAdded") && (
                <p role="status" className={ingredientSearchEmptyVariants()}>
                    {formatMessage(
                        status === "allAdded" ? searchMessages.allAdded : searchMessages.empty,
                        { query: term }
                    )}
                </p>
            )}
        </div>
    );
};
