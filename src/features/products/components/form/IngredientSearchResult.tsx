import { Avatar, AvatarFallback, AvatarImage } from "@/components";
import { formatCurrency } from "@/lib/format";
import {
    formatIngredientQuantity,
    getUnitAbbreviation,
    isIngredientOutOfStock,
} from "@/lib/ingredients";
import { getProductInitials } from "@/lib/products";
import { formatMessage, messages } from "@/messages";
import { ICON_SIZE, ICON_STROKE_BY_SIZE, ICON_TOKENS } from "@/tokens";

import type { IngredientSearchResultProps } from "../../interfaces";
import {
    ingredientSearchResultIconVariants,
    ingredientSearchResultMetaVariants,
    ingredientSearchResultNameVariants,
    ingredientSearchResultStockHintVariants,
    ingredientSearchResultStockValueVariants,
    ingredientSearchResultStockVariants,
    ingredientSearchResultTextVariants,
    ingredientSearchResultVariants,
} from "./ingredient-search-result.style";


const searchMessages = messages.products.create.recipe.search;
const stockMessages = messages.products.create.recipe.stock;


/**
 * Un insumo dentro de los resultados del buscador.
 *
 * Toda la fila es un botón que añade el insumo a la receta. Muestra el SKU, el
 * costo por unidad y el stock para que se pueda elegir sin abrir el inventario.
 */
export default function IngredientSearchResult({ ingredient, onAdd }: IngredientSearchResultProps) {
    const outOfStock = isIngredientOutOfStock(ingredient);

    return (
        <button
            type="button"
            onClick={() => onAdd(ingredient)}
            className={ingredientSearchResultVariants()}
        >
            {/* Va antes del contenido para que el lector de pantalla diga qué
                hace el botón y después lea el insumo. */}
            <span className="sr-only">{searchMessages.add}</span>

            <Avatar size="md" aria-hidden="true">
                {ingredient.image && <AvatarImage src={ingredient.image} alt="" />}
                <AvatarFallback>{getProductInitials(ingredient.name)}</AvatarFallback>
            </Avatar>

            <span className={ingredientSearchResultTextVariants()}>
                <span className={ingredientSearchResultNameVariants()}>
                    {ingredient.name}
                </span>

                <span className={ingredientSearchResultMetaVariants()}>
                    {`${ingredient.sku} · ${formatMessage(searchMessages.unitCost, {
                        cost: formatCurrency(ingredient.unitCost),
                        unit: getUnitAbbreviation(ingredient.unit),
                    })}`}
                </span>
            </span>

            {/* El stock se acompaña de una palabra para que "Agotado" no
                dependa solo del color. */}
            <span className={ingredientSearchResultStockVariants()}>
                <span className={ingredientSearchResultStockValueVariants({ outOfStock })}>
                    {formatIngredientQuantity(ingredient.stock, ingredient.unit)}
                </span>

                <span className={ingredientSearchResultStockHintVariants()}>
                    {outOfStock ? stockMessages.outOfStock : stockMessages.available}
                </span>
            </span>

            <ICON_TOKENS.CREATE
                aria-hidden="true"
                size={ICON_SIZE.lg}
                strokeWidth={ICON_STROKE_BY_SIZE.lg}
                className={ingredientSearchResultIconVariants()}
            />
        </button>
    );
};
