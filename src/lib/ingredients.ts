// ── Inventario de insumos ───────────────────────────────────────────────────
// Datos de prueba mientras no exista el endpoint de inventario. Cuando llegue,
// basta con cambiar `getIngredients` y `getIngredient` por el servicio y
// mantener la misma forma de los datos.
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
/*  Datos de prueba                                                            */
/* -------------------------------------------------------------------------- */

/**
 * Inventario de la sucursal.
 *
 * Además de insumos normales incluye dos agotados (la carne molida y la
 * mozzarella) y uno inactivo (la mayonesa de chipotle), para poder probar
 * cómo se ve cada caso en la receta.
 */
const INGREDIENTS: Ingredient[] = [
    // ── Proteínas ───────────────────────────────────────────────────────────
    { id: "i01", name: "Carne de res molida", sku: "PRO-001", stock: 0, unit: "gramo", unitCost: 32, isPerishable: true, isActive: true },
    { id: "i02", name: "Pechuga de pollo", sku: "PRO-002", stock: 8400, unit: "gramo", unitCost: 22, isPerishable: true, isActive: true },
    { id: "i03", name: "Carne al pastor", sku: "PRO-003", stock: 5200, unit: "gramo", unitCost: 30, isPerishable: true, isActive: true },
    { id: "i04", name: "Bistec de res", sku: "PRO-004", stock: 3000, unit: "gramo", unitCost: 38, isPerishable: true, isActive: true },
    { id: "i05", name: "Tocineta ahumada", sku: "PRO-005", stock: 1900, unit: "gramo", unitCost: 34, isPerishable: true, isActive: true },
    { id: "i06", name: "Chorizo argentino", sku: "PRO-006", stock: 2400, unit: "gramo", unitCost: 27, isPerishable: true, isActive: true },
    { id: "i07", name: "Pepperoni en lonchas", sku: "PRO-007", stock: 340, unit: "gramo", unitCost: 48, isPerishable: true, isActive: true },

    // ── Lácteos ─────────────────────────────────────────────────────────────
    { id: "i08", name: "Queso mozzarella en barra", sku: "LAC-001", stock: 0, unit: "gramo", unitCost: 26, isPerishable: true, isActive: true },
    { id: "i09", name: "Queso cheddar en lonchas", sku: "LAC-002", stock: 4600, unit: "gramo", unitCost: 28, isPerishable: true, isActive: true },
    { id: "i10", name: "Queso feta", sku: "LAC-003", stock: 900, unit: "gramo", unitCost: 52, isPerishable: true, isActive: true },
    { id: "i11", name: "Leche entera", sku: "LAC-004", stock: 18000, unit: "mililitro", unitCost: 4, isPerishable: true, isActive: true },
    { id: "i12", name: "Leche deslactosada", sku: "LAC-005", stock: 1500, unit: "mililitro", unitCost: 6, isPerishable: true, isActive: true },

    // ── Panadería y granos ──────────────────────────────────────────────────
    { id: "i13", name: "Pan brioche", sku: "PAN-001", stock: 120, unit: "unidad", unitCost: 1800, isPerishable: true, isActive: true },
    { id: "i14", name: "Tortilla de maíz", sku: "PAN-002", stock: 480, unit: "unidad", unitCost: 450, isPerishable: true, isActive: true },
    { id: "i15", name: "Harina de trigo", sku: "GRA-001", stock: 25000, unit: "gramo", unitCost: 3, isPerishable: false, isActive: true },
    { id: "i16", name: "Azúcar refinada", sku: "GRA-002", stock: 14000, unit: "gramo", unitCost: 3, isPerishable: false, isActive: true },

    // ── Frutas y verduras ───────────────────────────────────────────────────
    { id: "i17", name: "Lechuga romana", sku: "VEG-001", stock: 3200, unit: "gramo", unitCost: 9, isPerishable: true, isActive: true },
    { id: "i18", name: "Tomate chonto", sku: "VEG-002", stock: 6800, unit: "gramo", unitCost: 6, isPerishable: true, isActive: true },
    { id: "i19", name: "Cebolla blanca", sku: "VEG-003", stock: 7400, unit: "gramo", unitCost: 5, isPerishable: true, isActive: true },
    { id: "i20", name: "Piña gold", sku: "VEG-004", stock: 2100, unit: "gramo", unitCost: 7, isPerishable: true, isActive: true },
    { id: "i21", name: "Limón tahití", sku: "VEG-005", stock: 260, unit: "unidad", unitCost: 500, isPerishable: true, isActive: true },
    { id: "i22", name: "Papa criolla", sku: "VEG-006", stock: 12000, unit: "gramo", unitCost: 4, isPerishable: true, isActive: true },

    // ── Salsas, aceites y otros ─────────────────────────────────────────────
    { id: "i23", name: "Salsa BBQ de la casa", sku: "SAL-001", stock: 4200, unit: "mililitro", unitCost: 18, isPerishable: false, isActive: true },
    { id: "i24", name: "Salsa de tomate napolitana", sku: "SAL-002", stock: 5600, unit: "mililitro", unitCost: 10, isPerishable: false, isActive: true },
    { id: "i25", name: "Aceite de oliva extra virgen", sku: "ACE-001", stock: 3400, unit: "mililitro", unitCost: 24, isPerishable: false, isActive: true },
    { id: "i26", name: "Café en grano tostado", sku: "BEB-001", stock: 6200, unit: "gramo", unitCost: 58, isPerishable: false, isActive: true },
    { id: "i27", name: "Chocolate semiamargo", sku: "POS-001", stock: 2800, unit: "gramo", unitCost: 40, isPerishable: false, isActive: true },
    { id: "i28", name: "Huevo AA", sku: "OTR-001", stock: 360, unit: "unidad", unitCost: 700, isPerishable: true, isActive: true },

    // Sigue guardada porque hay recetas antiguas que la usan, pero ya no se
    // puede elegir para una receta nueva.
    { id: "i29", name: "Mayonesa de chipotle", sku: "SAL-003", stock: 1800, unit: "mililitro", unitCost: 21, isPerishable: false, isActive: false },
];


/**
 * Mapa de insumos por `id`. La receta solo guarda el id de cada insumo, así que
 * con esto encontramos el insumo de cada línea sin recorrer toda la lista.
 */
const INGREDIENTS_BY_ID = new Map(
    INGREDIENTS.map((ingredient) => [ingredient.id, ingredient])
);


/** Todo el inventario, incluidos los insumos inactivos. */
export function getIngredients(): Ingredient[] {
    return INGREDIENTS;
}


/** Devuelve el insumo con ese `id`, o `undefined` si ya no existe. */
export const getIngredient = (id: string): Ingredient | undefined =>
    INGREDIENTS_BY_ID.get(id);


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
export function searchIngredients(query: string): Ingredient[] {
    const term = normalizeText(query.trim());

    return INGREDIENTS.filter((ingredient) => {
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
