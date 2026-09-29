import { formatList } from "@/lib/format";
import type { Product, ProductStatus } from "@/lib/products";
import { formatMessage, messages } from "@/messages";

import type { CreateProductParams, ProductApiResponse, ProductFormValues } from "../interfaces";

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


/**
 * Convierte el formulario del alta en el cuerpo que espera el backend.
 *
 * Solo se llama después de validar el formulario entero, así que el precio y
 * las cantidades ya no pueden estar vacíos; el `?? 0` es solo para el tipo.
 *
 * La foto, la disponibilidad y las sucursales se quedan fuera: la foto porque
 * todavía no hay dónde subir el archivo, y las otras dos porque el backend aún
 * no las recibe.
 */
export const toCreateProductParams = (values: ProductFormValues): CreateProductParams => {
    const description = values.description.trim();

    return {
        productCategoryId: values.categoryId,
        productName: values.name.trim(),
        ...(description && { productDescription: description }),
        productBasePrice: String(values.price ?? 0),
        profitMargin: values.margin ?? 0,
        recipe: values.recipe.map((line) => ({
            inventoryItemId: line.itemId,
            quantity: String(line.quantity ?? 0),
            isOptional: line.isOptional,
        })),
    };
};
