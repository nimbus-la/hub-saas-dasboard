"use client";

import * as React from "react";

import { formatPlural, messages } from "@/messages";
import { ICON_SIZE, ICON_STROKE_BY_SIZE, ICON_TOKENS } from "@/tokens";

import type { RecipeLine } from "../../interfaces";
import RecipeTable from "./RecipeTable";

import {
    productRecipeCardVariants,
    productRecipeEmptyIconVariants,
    productRecipeEmptyMessageVariants,
    productRecipeEmptyTextVariants,
    productRecipeEmptyTitleVariants,
    productRecipeEmptyVariants,
    productRecipeListCountVariants,
    productRecipeListHeaderVariants,
    productRecipeListTitleVariants,
    productRecipeListVariants,
    productRecipeStepVariants
} from "./product-recipe-step.style";


/**
 * Datos quemados de la receta.
 *
 * Provisional hasta que existan el inventario y el buscador. Cubren los casos
 * que la tabla tiene que saber pintar: insumo sano, perecedero, **agotado** y
 * una línea con la cantidad todavía sin escribir.
 */
const MOCK_RECIPE_LINES: RecipeLine[] = [
    {
        index: 0,
        ingredient: { id: "i01", name: "Carne de res molida", sku: "PRO-001", stock: 0, unit: "g", unitName: "gramos", isPerishable: true },
        quantity: "150",
        isOutOfStock: true,
    },
    {
        index: 1,
        ingredient: { id: "i12", name: "Pan brioche", sku: "PAN-002", stock: 48, unit: "und", unitName: "unidades", isPerishable: true },
        quantity: "1",
        isOutOfStock: false,
    },
    {
        index: 2,
        ingredient: { id: "i20", name: "Salsa BBQ de la casa", sku: "SAL-004", stock: 2350, unit: "ml", unitName: "mililitros", isPerishable: false },
        quantity: "30",
        isOutOfStock: false,
    },
    {
        index: 3,
        ingredient: { id: "i09", name: "Queso cheddar en lonchas", sku: "LAC-003", stock: 1200, unit: "g", unitName: "gramos", isPerishable: true },
        quantity: "",
        isOutOfStock: false,
    },
];


export default function ProductRecipeStep() {
    const message = messages.products.create.recipe;

    // Estado local sobre los datos quemados: cuando la receta viva en el
    // formulario, esto pasa a `useFieldArray` + `useWatch`.
    const [lines, setLines] = React.useState<RecipeLine[]>(MOCK_RECIPE_LINES);

    const handleQuantityChange = (index: number, quantity: string) => {
        setLines((current) =>
            current.map((line) => (line.index === index ? { ...line, quantity } : line))
        );
    };

    // Al quitar una línea se renumeran las demás, igual que hace `remove` de
    // `useFieldArray` con las posiciones del array.
    const handleRemove = (index: number) => {
        setLines((current) =>
            current
                .filter((line) => line.index !== index)
                .map((line, position) => ({ ...line, index: position }))
        );
    };

    const hasLines = lines.length > 0;

    return (
        <div className={productRecipeStepVariants()}>
            {/* Barra de busqueda. */}

            <div className={productRecipeListVariants()}>
                <div className={productRecipeListHeaderVariants()}>
                    <h3 className={productRecipeListTitleVariants()}>
                        {message.list.title}
                    </h3>

                    <p aria-live="polite" className={productRecipeListCountVariants()}>
                        {formatPlural(message.list.count, lines.length)}
                    </p>
                </div>
            </div>

            {/* La tabla ocupa el espacio sin marco: su encabezado ya la delimita.
                El borde solo enmarca el estado vacío, que sin él sería un
                texto suelto en medio del paso. */}
            {
                hasLines ? (
                    <RecipeTable
                        lines={lines}
                        onQuantityChange={handleQuantityChange}
                        onRemove={handleRemove}
                    />
                ) : (
                    <div className={productRecipeCardVariants()}>
                        <div className={productRecipeEmptyVariants()}>
                            <span
                                aria-hidden="true"
                                className={productRecipeEmptyIconVariants()}
                            >
                                <ICON_TOKENS.INVENTORY
                                    size={ICON_SIZE["2xl"]}
                                    strokeWidth={ICON_STROKE_BY_SIZE["2xl"]}
                                />
                            </span>

                            <div className={productRecipeEmptyTextVariants()}>
                                <p className={productRecipeEmptyTitleVariants()}>
                                    {message.list.empty.title}
                                </p>

                                <p className={productRecipeEmptyMessageVariants()}>
                                    {message.list.empty.message}
                                </p>
                            </div>
                        </div>
                    </div>
                )
            }
        </div>
    )
}
