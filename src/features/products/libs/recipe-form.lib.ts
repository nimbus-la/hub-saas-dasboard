// ── Reglas del paso de receta ───────────────────────────────────────────────
// Cómo se lee una cantidad escrita y qué reglas debe cumplir la receta para
// poder continuar. Están en `libs` y no en `utils` porque las reglas usan el
// parser de cantidades, y `utils` no debe importar nada de `libs`.

import { getUnitName, type IngredientUnit } from "@/lib/ingredients";
import { formatMessage, messages } from "@/messages";

import type {
    ProductRecipeFormValues,
    ProductRecipeQuantityRules,
    ProductRecipeRules,
} from "../interfaces";
import { RECIPE_VALIDATION } from "../utils";


const message = messages.products.create.recipe.validation;


/* -------------------------------------------------------------------------- */
/*  Cantidad                                                                   */
/* -------------------------------------------------------------------------- */

/** Acepta dígitos con un separador decimal opcional, como `150`, `0,5` o `2.25`. */
const QUANTITY_PATTERN = /^\d+([.,]\d+)?$/;


/** Deja la cantidad lista para convertirla, sin espacios y con punto decimal. */
const normalizeQuantity = (value: string): string =>
    value.trim().replace(",", ".");


/**
 * Convierte la cantidad escrita en un número.
 *
 * Devuelve `null` si el campo está vacío o si lo escrito no es una cantidad,
 * en lugar de devolver `0` o `NaN`. Así podemos distinguir una línea que falta
 * por llenar de una que de verdad vale cero.
 *
 * Se aceptan la coma, que es lo que sale del teclado en español, y el punto,
 * que es lo que suele venir al copiar desde una hoja de cálculo.
 */
export function parseRecipeQuantity(value: string): number | null {
    const normalized = normalizeQuantity(value);

    if (!QUANTITY_PATTERN.test(normalized)) return null;

    const quantity = Number(normalized);

    return Number.isFinite(quantity) ? quantity : null;
}


/** Cuántos decimales tiene la cantidad escrita. */
const countDecimals = (value: string): number =>
    normalizeQuantity(value).split(".")[1]?.length ?? 0;


/**
 * Arma las reglas de cantidad para una unidad.
 *
 * Las validaciones van en orden y react-hook-form se detiene en la primera que
 * falla, así que la persona siempre ve el problema más básico primero.
 */
const buildRecipeQuantityRules = (
    unit: IngredientUnit
): ProductRecipeQuantityRules => ({
    validate: {
        required: (value) =>
            value.trim() !== "" || message.quantityRequired,

        number: (value) =>
            parseRecipeQuantity(value) !== null || message.quantityInvalid,

        decimals: (value) =>
            countDecimals(value) <= RECIPE_VALIDATION.quantity.maxDecimals ||
            formatMessage(message.quantityDecimals, {
                max: RECIPE_VALIDATION.quantity.maxDecimals,
            }),

        min: (value) =>
            (parseRecipeQuantity(value) ?? 0) >= RECIPE_VALIDATION.quantity.min ||
            message.quantityMin,

        max: (value) =>
            (parseRecipeQuantity(value) ?? 0) <= RECIPE_VALIDATION.quantity.max ||
            formatMessage(message.quantityMax, {
                max: RECIPE_VALIDATION.quantity.max,
                unit: getUnitName(unit),
            }),
    },
});


/**
 * Reglas de cantidad ya armadas para cada unidad.
 *
 * El mensaje del máximo nombra la unidad del insumo, por eso hay una versión
 * por unidad. Se crean una sola vez para que cada fila reciba siempre el mismo
 * objeto y no uno nuevo en cada render.
 */
const RECIPE_QUANTITY_RULES: Record<IngredientUnit, ProductRecipeQuantityRules> = {
    gramo: buildRecipeQuantityRules("gramo"),
    mililitro: buildRecipeQuantityRules("mililitro"),
    unidad: buildRecipeQuantityRules("unidad"),
};


/** Reglas del campo de cantidad según la unidad del insumo. */
export const getRecipeQuantityRules = (
    unit: IngredientUnit
): ProductRecipeQuantityRules => RECIPE_QUANTITY_RULES[unit];


/* -------------------------------------------------------------------------- */
/*  Receta completa                                                            */
/* -------------------------------------------------------------------------- */

/** Revisa que ningún insumo aparezca en más de una línea. */
const hasUniqueIngredients = (recipe: readonly ProductRecipeFormValues[]): boolean =>
    new Set(recipe.map((line) => line.itemId)).size === recipe.length;


/**
 * Reglas de la receta completa.
 *
 * El buscador ya no ofrece los insumos que están en la receta ni deja pasar
 * del tope, pero estas reglas lo vuelven a comprobar al validar el paso para
 * que el formulario no dependa solo de la pantalla.
 */
export const RECIPE_RULES: ProductRecipeRules = {
    validate: {
        minIngredients: (recipe) =>
            recipe.length >= RECIPE_VALIDATION.minIngredients ||
            message.recipeRequired,

        maxIngredients: (recipe) =>
            recipe.length <= RECIPE_VALIDATION.maxIngredients ||
            formatMessage(message.recipeMax, {
                max: RECIPE_VALIDATION.maxIngredients,
            }),

        uniqueIngredients: (recipe) =>
            hasUniqueIngredients(recipe) || message.ingredientDuplicated,
    },
};
