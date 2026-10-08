import { formatList } from "@/lib/format";
import type { Product, ProductStatus } from "@/lib/products";
import { formatMessage, messages } from "@/messages";

import type {
    CreateProductParams,
    CreateProductRecipeLineParams,
    ProductApiResponse,
    ProductApiStatus,
    ProductFormValues,
    ProductRecipeFormValues,
    UpdateProductParams,
} from "../interfaces";
import { DEFAULT_PRODUCT_FORM_VALUES, isSameRecipe } from "../libs";

/**
 * Conversiones entre el producto del backend y el que usa la aplicación.
 */


/**
 * El backend escribe el estado como texto y el resto de la aplicación lo trata
 * como un sí o un no. La traducción vive solo aquí para que el literal no se
 * repita por las pantallas.
 */
const isActiveStatus = (status: ProductApiStatus): boolean => status === "ACTIVE";

const toApiStatus = (isActive: boolean): ProductApiStatus => (isActive ? "ACTIVE" : "INACTIVE");


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
        status: toProductStatus(isActiveStatus(product.status),missingIngredients.length > 0),
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
 * La receta del formulario como la espera el backend. La usan el alta y la
 * edición, que mandan las líneas exactamente igual.
 */
const toRecipeParams = (recipe: ProductRecipeFormValues[]): CreateProductRecipeLineParams[] =>
    recipe.map((line) => ({
        inventoryItemId: line.itemId,
        quantity: String(line.quantity ?? 0),
        isOptional: line.isOptional,
    }));


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
        recipe: toRecipeParams(values.recipe),
    };
};


/**
 * Llena el formulario con un producto que ya existe, para editarlo.
 *
 * El backend manda precio, margen y cantidades como texto decimal y el
 * formulario trabaja con números. La foto y las sucursales se quedan como en
 * un alta nueva porque el formulario todavía no las sabe cargar.
 */
export const toProductFormValues = (product: ProductApiResponse): ProductFormValues => ({
    ...DEFAULT_PRODUCT_FORM_VALUES,
    name: product.productName,
    categoryId: product.productCategoryId,
    description: product.productDescription ?? "",
    price: Number(product.productBasePrice),
    margin: Number(product.profitMargin),
    isAvailable: isActiveStatus(product.status),
    recipe: product.ingredients.map((ingredient) => ({
        itemId: ingredient.inventoryItemId,
        quantity: Number(ingredient.quantity),
        isOptional: ingredient.isOptional,
    })),
});


/**
 * Lo que cambió en el formulario respecto a como empezó, ya en el formato
 * del backend. Es la base del cuerpo de la edición y también lo que decide si
 * el botón de guardar se habilita, así los dos nunca opinan distinto.
 *
 * Los dos lados se pasan primero al formato del backend y se comparan ya
 * convertidos. Así un espacio de más al final del nombre o un `22000` contra
 * un `22000.00` no cuentan como cambio.
 *
 * La receta se compara en el formulario, con la misma regla que usa el paso
 * de precio para saber si se tocó. Va entera o no va, porque el backend la
 * reemplaza completa y enviarla siempre cuenta como cambio. El estado solo
 * viaja si se activó o se desactivó: mandarlo igual hace que el backend
 * rechace toda la edición.
 *
 * La descripción sí se manda vacía cuando se borra. Si se omitiera, el
 * backend dejaría la anterior y no habría forma de quitarla.
 */
const getProductChanges = (
    values: ProductFormValues,
    initial: ProductFormValues
): Omit<UpdateProductParams, "productId"> => {
    const current = toCreateProductParams(values);
    const before = toCreateProductParams(initial);

    const description = current.productDescription ?? "";

    return {
        ...(current.productName !== before.productName && {
            productName: current.productName,
        }),
        ...(current.productCategoryId !== before.productCategoryId && {
            productCategoryId: current.productCategoryId,
        }),
        ...(description !== (before.productDescription ?? "") && {
            productDescription: description,
        }),
        ...(current.productBasePrice !== before.productBasePrice && {
            productBasePrice: current.productBasePrice,
        }),
        ...(current.profitMargin !== before.profitMargin && {
            profitMargin: current.profitMargin,
        }),
        ...(!isSameRecipe(values.recipe, initial.recipe) && {
            recipe: current.recipe,
        }),
        ...(values.isAvailable !== initial.isAvailable && {
            status: toApiStatus(values.isAvailable),
        }),
    };
};


/** Arma el cuerpo de la edición: el id del producto y solo lo que cambió. */
export const toUpdateProductParams = (
    productId: string,
    values: ProductFormValues,
    initial: ProductFormValues
): UpdateProductParams => ({
    productId,
    ...getProductChanges(values, initial),
});


/**
 * Si el formulario cambió en algo que el backend guarda. Sin cambios no vale
 * la pena llamarlo, porque respondería que no hay nada que guardar.
 */
export const hasProductChanges = (values: ProductFormValues, initial: ProductFormValues): boolean =>
    Object.keys(getProductChanges(values, initial)).length > 0;
