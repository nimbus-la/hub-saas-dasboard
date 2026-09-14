// ── Cálculos de la receta ───────────────────────────────────────────────────
// Cruza lo que guarda el formulario con el inventario y saca de ahí lo que la
// pantalla necesita mostrar: el insumo de cada línea, el costo total y los
// insumos agotados. Si más adelante otra pantalla necesita el costo, puede
// usar estas mismas funciones.

import { formatList } from "@/lib/format";
import {
    getIngredient,
    isIngredientOutOfStock,
    type Ingredient,
} from "@/lib/ingredients";
import { formatPlural, messages } from "@/messages";

import type {
    ProductRecipeFormValues,
    RecipeCost,
    RecipeLine,
} from "../interfaces";
import { parseRecipeQuantity } from "./recipe-form.lib";


const message = messages.products.create.recipe;


/**
 * Busca el insumo de cada línea del formulario y calcula su costo.
 *
 * Si el insumo de una línea ya no existe en el inventario, esa línea se deja
 * por fuera porque no hay nada que mostrar ni que sumar. Cada línea conserva
 * su `index` original para no confundir una fila con otra cuando falta alguna.
 */
export function resolveRecipeLines(
    recipe: readonly ProductRecipeFormValues[]
): RecipeLine[] {
    return recipe.flatMap((item, index) => {
        const ingredient = getIngredient(item.itemId);

        if (!ingredient) return [];

        const quantity = parseRecipeQuantity(item.quantity);

        return [{
            index,
            ingredient,
            quantity,
            cost: quantity === null ? null : quantity * ingredient.unitCost,
            isOutOfStock: isIngredientOutOfStock(ingredient),
        }];
    });
}


/**
 * Suma lo que cuesta preparar una unidad del producto.
 *
 * Una línea sin cantidad no anula el total, solo lo deja incompleto. Así la
 * persona puede ir viendo cuánto lleva mientras termina de llenar la receta.
 */
export function getRecipeCost(lines: readonly RecipeLine[]): RecipeCost {
    return lines.reduce<RecipeCost>(
        (cost, line) => ({
            total: cost.total + (line.cost ?? 0),
            isComplete: cost.isComplete && line.cost !== null,
        }),
        { total: 0, isComplete: true }
    );
}


/** Insumos de la receta que no tienen existencias. */
export const getOutOfStockIngredients = (
    lines: readonly RecipeLine[]
): Ingredient[] =>
    lines.filter((line) => line.isOutOfStock).map((line) => line.ingredient);


/**
 * Arma el texto del aviso de insumos agotados.
 *
 * Nombra cada insumo entre comillas y los une en una frase, por ejemplo
 * «Pan brioche» y «Queso feta», para que no haya que buscar en la tabla cuáles
 * son. `formatPlural` elige si la frase va en singular o en plural.
 */
export function formatOutOfStockNotice(ingredients: readonly Ingredient[]): string {
    const names = formatList(
        ingredients.map((ingredient) => `«${ingredient.name}»`)
    );

    return formatPlural(
        message.outOfStockNotice.description,
        ingredients.length,
        { names }
    );
}
