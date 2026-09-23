// ── Cálculos de la receta ───────────────────────────────────────────────────
// Cruza lo que guarda el formulario con el inventario y saca de ahí lo que la
// pantalla necesita mostrar: el insumo de cada línea, el costo total y los
// insumos agotados. Si más adelante otra pantalla necesita el costo, puede
// usar estas mismas funciones.

import { formatList } from "@/lib/format";
import {
    getIngredient,
    isIngredientOutOfStock,
    searchIngredients,
    type Ingredient,
} from "@/lib/ingredients";
import { formatPlural, messages } from "@/messages";

import type {
    IngredientSearchResult,
    ProductRecipeFormValues,
    RecipeCost,
    RecipeLine,
    RecipeRow,
} from "../interfaces";
import { RECIPE_VALIDATION, isRecipeQuantityInRange } from "./recipe-form";


/**
 * Cuántos resultados muestra el buscador de insumos.
 *
 * La lista aparece dentro del formulario y empuja el contenido hacia abajo, así
 * que se limita a seis. Si hay más, se invita a afinar la búsqueda.
 */
export const RECIPE_SEARCH_RESULTS = 6;

const message = messages.products.create.recipe;


/**
 * Busca el insumo de cada línea del formulario y calcula su costo.
 *
 * Si el insumo de una línea ya no existe en el inventario, esa línea se deja
 * por fuera porque no hay nada que mostrar ni que sumar. Cada línea conserva
 * su `index` original para no confundir una fila con otra cuando falta alguna.
 *
 * Una cantidad fuera de los límites se trata igual que una vacía. Si se
 * sumara, el total mostraría una cifra con un error en pantalla y además diría
 * que está completo.
 */
export function resolveRecipeLines(
    recipe: readonly ProductRecipeFormValues[]
): RecipeLine[] {
    return recipe.flatMap((item, index) => {
        const ingredient = getIngredient(item.itemId);

        if (!ingredient) return [];

        const quantity = isRecipeQuantityInRange(item.quantity) ? item.quantity : null;

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
 * Arma las filas de la tabla a partir de los `fields` de `useFieldArray`.
 *
 * Igual que en `resolveRecipeLines`, se deja por fuera la línea cuyo insumo ya
 * no existe y cada fila guarda su posición original en la receta.
 */
export function resolveRecipeRows(
    fields: readonly (ProductRecipeFormValues & { id: string })[]
): RecipeRow[] {
    return fields.flatMap((field, index) => {
        const ingredient = getIngredient(field.itemId);

        if (!ingredient) return [];

        return [{
            id: field.id,
            index,
            ingredient,
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


/**
 * Busca insumos para añadir a la receta.
 *
 * Deja por fuera los que ya están en la receta y no busca nada si la receta
 * llegó al tope. Separa las coincidencias de las que se pueden añadir para
 * saber si el insumo no existe o si ya está en la receta, porque en cada caso
 * la persona tiene que hacer algo distinto.
 */
export function searchRecipeIngredients(
    query: string,
    selectedIds: readonly string[]
): IngredientSearchResult {
    const term = query.trim();

    if (selectedIds.length >= RECIPE_VALIDATION.maxIngredients) {
        return { status: "full", results: [], hiddenCount: 0 };
    }

    if (!term) {
        return { status: "idle", results: [], hiddenCount: 0 };
    }

    const matches = searchIngredients(term);
    const selected = new Set(selectedIds);
    const available = matches.filter((ingredient) => !selected.has(ingredient.id));

    if (matches.length === 0) {
        return { status: "empty", results: [], hiddenCount: 0 };
    }

    if (available.length === 0) {
        return { status: "allAdded", results: [], hiddenCount: 0 };
    }

    const results = available.slice(0, RECIPE_SEARCH_RESULTS);

    return {
        status: "results",
        results,
        hiddenCount: available.length - results.length,
    };
}
