// import { formatList } from "@/lib/format";
import type { Product, ProductStatus } from "@/lib/products";
// import { formatMessage, messages } from "@/messages";

import type {
    CreateProductParams,
    // CreateProductRecipeLineParams,
    ProductApiResponse,
    ProductApiStatus,
    ProductFormValues,
    // ProductRecipeFormValues,
    UpdateProductParams,
} from "../interfaces";
import { DEFAULT_PRODUCT_FORM_VALUES /* , isSameRecipe */ } from "../libs";

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
 * Sin receta el backend solo dice si el producto está activo, así que no se
 * puede saber si falta algo para prepararlo. Cuando vuelvan las recetas, el
 * segundo parámetro vuelve a decidir entre disponible y no disponible.
 */
const toProductStatus = (isActive: boolean /* , hasMissingIngredients: boolean */): ProductStatus => {
    if (!isActive) return "inactivo";

    // return hasMissingIngredients ? "no-disponible" : "disponible";
    return "disponible";
};


/**
 * Convierte un producto del backend al formato de la aplicación.
 *
 * La foto todavía no se pasa: Next solo descarga imágenes de orígenes
 * declarados, y mientras no exista la subida de archivos no hay un origen
 * fijo que declarar. La tarjeta cae a las iniciales.
 */
export const toProduct = (product: ProductApiResponse): Product => {
    // Con receta, los insumos obligatorios sin existencias apagaban el
    // producto y armaban el aviso de la tarjeta. Los opcionales no contaban,
    // porque el producto se puede servir sin ellos.
    //
    // const missingIngredients = product.ingredients
    //     .filter((ingredient) => !ingredient.isOptional && !ingredient.hasStock)
    //     .map((ingredient) => ingredient.name);

    return {
        id: product.id,
        name: product.name,
        category: product.categoryName ?? "",
        price: Number(product.price),
        status: toProductStatus(isActiveStatus(product.status)),

        // ingredientsCount: product.ingredients.length,
        // ...(missingIngredients.length > 0 && {
        //     alert: formatMessage(messages.products.missingIngredients, {
        //         ingredients: formatList(missingIngredients),
        //     }),
        // }),
    };
};


/** Convierte todas las filas del listado. */
export const toProductList = (products: ProductApiResponse[]): Product[] =>
    products.map(toProduct);


// La receta del formulario como la esperaba el backend. La usaban el alta y la
// edición, que mandaban las líneas exactamente igual.
//
// const toRecipeParams = (recipe: ProductRecipeFormValues[]): CreateProductRecipeLineParams[] =>
//     recipe.map((line) => ({
//         inventoryItemId: line.itemId,
//         quantity: String(line.quantity ?? 0),
//         isOptional: line.isOptional,
//     }));


/**
 * Convierte el formulario del alta en el cuerpo que espera el backend.
 *
 * Solo se llama después de validar el formulario entero, así que costo,
 * precio y margen ya no pueden estar vacíos; el `?? 0` es solo para el tipo.
 *
 * La foto, la disponibilidad y las sucursales se quedan fuera: la foto porque
 * todavía no hay dónde subir el archivo, y las otras dos porque el backend aún
 * no las recibe.
 */
export const toCreateProductParams = (values: ProductFormValues): CreateProductParams => {
    const description = values.description.trim();

    return {
        categoryId: values.categoryId,
        name: values.name.trim(),
        ...(description && { description }),
        price: String(values.price ?? 0),
        cost: String(values.cost ?? 0),
        targetMargin: String(values.margin ?? 0),
        // recipe: toRecipeParams(values.recipe),
    };
};


/**
 * Llena el formulario con un producto que ya existe, para editarlo.
 *
 * El backend manda los montos y el margen como texto decimal y el formulario
 * trabaja con números. La foto y las sucursales se quedan como en un alta
 * nueva porque el formulario todavía no las sabe cargar.
 */
export const toProductFormValues = (product: ProductApiResponse): ProductFormValues => ({
    ...DEFAULT_PRODUCT_FORM_VALUES,
    name: product.name,
    categoryId: product.categoryId,
    description: product.description ?? "",
    cost: Number(product.cost),
    price: Number(product.price),
    margin: Number(product.targetMargin),
    isAvailable: isActiveStatus(product.status),
    // recipe: product.ingredients.map((ingredient) => ({
    //     itemId: ingredient.inventoryItemId,
    //     quantity: Number(ingredient.quantity),
    //     isOptional: ingredient.isOptional,
    // })),
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
 * Precio, costo y margen van los tres o ninguno. El backend completa los que
 * falten con lo guardado y exige que cuadren, y como los tres salen juntos del
 * mismo cálculo, mezclar uno nuevo con dos viejos puede no cuadrar por un
 * redondeo. El estado solo viaja si se activó o se desactivó: mandarlo igual
 * hace que el backend rechace toda la edición.
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

    const description = current.description ?? "";

    const isPricingChanged =
        current.price !== before.price ||
        current.cost !== before.cost ||
        current.targetMargin !== before.targetMargin;

    return {
        ...(current.name !== before.name && {
            name: current.name,
        }),
        ...(current.categoryId !== before.categoryId && {
            categoryId: current.categoryId,
        }),
        ...(description !== (before.description ?? "") && {
            description,
        }),
        ...(isPricingChanged && {
            price: current.price,
            cost: current.cost,
            targetMargin: current.targetMargin,
        }),
        // La receta iba entera o no iba, porque el backend la reemplazaba
        // completa.
        // ...(!isSameRecipe(values.recipe, initial.recipe) && {
        //     recipe: current.recipe,
        // }),
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
