import { formatList } from "@/lib/format";
import type { Product, ProductStatus } from "@/lib/products";
import { formatMessage, messages } from "@/messages";

import type { ProductApiResponse } from "../interfaces";

/**
 * Conversiones entre el producto del backend y el que usa la aplicación.
 */


/**
 * El backend solo dice si el producto está activo y si cada insumo tiene
 * existencias. Con eso se sabe si está inactivo o si no se puede preparar.
 * El stock bajo todavía no se puede saber, porque no llegan los mínimos.
 */
const toProductStatus = (isActive: boolean, hasMissingIngredients: boolean): ProductStatus => {
    if (!isActive) return "inactivo";

    return hasMissingIngredients ? "no-disponible" : "disponible";
};


/**
 * Convierte un producto del backend al formato de la aplicación. Los insumos
 * opcionales no cuentan como faltantes, porque el producto se puede servir
 * sin ellos.
 */
export const toProduct = (product: ProductApiResponse): Product => {
    const missingIngredients = product.ingredients
        .filter((ingredient) => !ingredient.isOptional && !ingredient.hasStock)
        .map((ingredient) => ingredient.name);

    return {
        id: product.id,
        name: product.productName,
        category: product.nameProductCategory,
        price: Number(product.productBasePrice),
        status: toProductStatus(product.productStatus, missingIngredients.length > 0),
        ingredientsCount: product.ingredients.length,

        ...(missingIngredients.length > 0 && {
            alert: formatMessage(messages.products.missingIngredients, {
                ingredients: formatList(missingIngredients),
            }),
        }),
    };
};


/** Convierte todas las filas del listado. */
export const toProductList = (products: ProductApiResponse[]): Product[] =>
    products.map(toProduct);
