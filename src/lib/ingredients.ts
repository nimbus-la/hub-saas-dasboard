// ── Inventario de insumos ───────────────────────────────────────────────────
// La forma del insumo y las reglas que no dependen de dónde salga. Los datos
// los trae el servicio de inventario de productos, que ya los convierte a esta
// forma.
//
// La receta necesita dos cosas del insumo que el catálogo de productos no
// tiene. La unidad de medida, para que la cantidad escrita en la receta se
// entienda igual que el stock del almacén, y el costo por unidad, que es con
// lo que se calcula cuánto cuesta preparar el plato.

import { formatNumber } from "@/lib/format";
import { messages } from "@/messages";
// Se importa directo del archivo y no desde `@/utils` para no cargar los
// iconos y las constantes de la API que exporta el barril.
import { normalizeText } from "@/utils/formatters.utils";


/* -------------------------------------------------------------------------- */
/*  Tipos                                                                      */
/* -------------------------------------------------------------------------- */

/**
 * Unidad en la que el almacén mide un insumo.
 *
 * Solo hay tres porque cualquier otra medida de cocina, como una taza o una
 * cucharada, se puede convertir a una de estas. Así el costo de todos los
 * insumos se puede sumar sin conversiones.
 */
export type IngredientUnit = "gramo" | "mililitro" | "unidad";


export interface Ingredient {
    id: string;
    name: string;
    /** Código único con el que el almacén identifica el insumo. */
    sku: string;
    /** Existencias, medidas en la unidad del propio insumo. */
    stock: number;
    unit: IngredientUnit;
    /**
     * Lo que cuesta una sola unidad de medida en COP, es decir un gramo, un
     * mililitro o una pieza. Se guarda así para que la receta solo tenga que
     * multiplicar por la cantidad.
     */
    unitCost: number;
    isPerishable: boolean;
    /** Un insumo inactivo fue retirado del inventario y no se puede añadir a recetas nuevas. */
    isActive: boolean;
    /** Foto que envía el backend. Si no llega, se muestran las iniciales del nombre. */
    image?: string;
}


/* -------------------------------------------------------------------------- */
/*  Reglas                                                                     */
/* -------------------------------------------------------------------------- */

/**
 * Indica si ya no queda nada del insumo.
 *
 * Se compara con `<= 0` y no con `=== 0` porque un ajuste de inventario mal
 * hecho puede dejar el stock en negativo, y eso también significa que no hay.
 */
export const isIngredientOutOfStock = (ingredient: Ingredient): boolean =>
    ingredient.stock <= 0;


/**
 * Busca insumos por nombre o por SKU, sin importar tildes ni mayúsculas.
 *
 * En cocina la gente busca "mozzarella" y en el almacén escriben "LAC-001", así
 * que se revisan los dos campos. Los insumos inactivos nunca aparecen. Los
 * agotados sí, porque la receta describe cómo se prepara el plato aunque hoy
 * no haya existencias.
 *
 * Con el texto vacío devuelve todos los insumos activos.
 */
export function searchIngredients(
    ingredients: readonly Ingredient[],
    query: string
): Ingredient[] {
    const term = normalizeText(query.trim());

    return ingredients.filter((ingredient) => {
        if (!ingredient.isActive) return false;
        if (!term) return true;

        return (
            normalizeText(ingredient.name).includes(term) ||
            normalizeText(ingredient.sku).includes(term)
        );
    });
}


/* -------------------------------------------------------------------------- */
/*  Textos de las unidades                                                     */
/* -------------------------------------------------------------------------- */

const UNITS = messages.products.units;


/** Abreviatura que acompaña a una cifra, como `g`, `ml` o `u`. */
export const getUnitAbbreviation = (unit: IngredientUnit): string =>
    UNITS[unit].abbreviation;


/** Nombre de la unidad para usarlo dentro de una frase, como `gramos`. */
export const getUnitName = (unit: IngredientUnit): string =>
    UNITS[unit].plural;


/**
 * Cantidad con su unidad, por ejemplo `1.200 g` o `0,5 u`.
 *
 * Entre la cifra y la unidad va un espacio que no se parte, para que en una
 * celda estrecha no quede el número en una línea y la unidad en otra.
 */
export const formatIngredientQuantity = (
    quantity: number,
    unit: IngredientUnit
): string => `${formatNumber(quantity)} ${getUnitAbbreviation(unit)}`;
