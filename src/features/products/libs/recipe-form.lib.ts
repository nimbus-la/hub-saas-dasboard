// ── Reglas del paso de receta ───────────────────────────────────────────────
// Qué debe cumplir cada cantidad y la receta completa para poder continuar.
// La cantidad ya llega como número desde `NumberField`, que se encarga de los
// separadores y de no dejar escribir decimales de más.

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

/** Indica si la cantidad tiene valor y está dentro de los límites de la receta. */
export const isRecipeQuantityInRange = (quantity: number | null): quantity is number =>
    quantity !== null &&
    quantity >= RECIPE_VALIDATION.quantity.min &&
    quantity <= RECIPE_VALIDATION.quantity.max;


/**
 * Arma las reglas de cantidad para una unidad.
 *
 * Las validaciones van en orden y react-hook-form se detiene en la primera que
 * falla, así que la persona siempre ve el problema más básico primero.
 *
 * No hace falta revisar si es un número ni cuántos decimales tiene, porque
 * `NumberField` solo deja escribir números con los decimales permitidos.
 */
const buildRecipeQuantityRules = (
    unit: IngredientUnit
): ProductRecipeQuantityRules => ({
    validate: {
        required: (value) =>
            value !== null || message.quantityRequired,

        min: (value) =>
            value === null ||
            value >= RECIPE_VALIDATION.quantity.min ||
            message.quantityMin,

        max: (value) =>
            value === null ||
            value <= RECIPE_VALIDATION.quantity.max ||
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
