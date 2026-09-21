import type { ApiResponseWithPagination, InputSelectorOption } from "@/interfaces";

import type { CategoryFormValues, CategoryList, CategoryListApiResponse, CreateCategoryParams, UpdateCategoryParams } from "../interfaces";

/**
 * Conversiones entre lo que manda el backend y lo que usa la aplicación. Aquí
 * se rellenan los campos que pueden faltar, para que las pantallas no tengan
 * que revisarlos. Cómo se muestra un campo vacío lo decide cada pantalla.
 */


/**
 * Convierte una categoría del backend al formato de la aplicación. Toda
 * categoría que llegue del backend pasa por aquí antes de guardarse en caché.
 */
export const toCategory = (category: CategoryListApiResponse): CategoryList => ({
    id: category.id,
    name: category.name,

    // Se deja vacía y no con una raya, porque el formulario de edición la
    // mostraría y se guardaría como si fuera la descripción real.
    description: category.description ?? "",

    updatedAt: category.updatedAt,
    isActive: category.isActive,
});


/** Convierte todas las filas del listado. */
export const toCategoryList = (categories: CategoryListApiResponse[]): CategoryList[] =>
    categories.map(toCategory);


/**
 * Convierte una página de categorías en opciones del selector. El valor es el
 * id porque es lo que el alta de producto le envía al backend.
 */
export const toCategoryOptions = (
    page: ApiResponseWithPagination<CategoryList[]>
): InputSelectorOption[] =>
    page.rows.map((category) => ({ label: category.name, value: category.id }));


/** Llena el formulario de edición con los datos de la categoría. */
export const toCategoryFormValues = (category: CategoryList): CategoryFormValues => ({
    name: category.name,
    description: category.description,
    isActive: category.isActive,
});


/**
 * Prepara los datos del formulario para crear una categoría. Quita los
 * espacios de los extremos y no envía la descripción si quedó vacía, porque
 * para el backend no es lo mismo no tener descripción que tener una vacía. El
 * estado no se envía porque al crear lo decide el servidor.
 */
export const toCreateCategoryParams = (
    values: CategoryFormValues
): CreateCategoryParams => {
    const description = values.description.trim();

    return {
        name: values.name.trim(),
        ...(description ? { description } : {}),
    };
};


/**
 * Prepara los datos del formulario para editar una categoría. Usa lo mismo
 * que la creación y le suma el id y el estado.
 */
export const toUpdateCategoryParams = (
    values: CategoryFormValues,
    current: CategoryList
): UpdateCategoryParams => ({
    ...toCreateCategoryParams(values),

    // El backend espera el id en el cuerpo, así que se toma de la categoría
    // que se está editando.
    categoryId: current.id,

    // El estado solo se envía si cambió.
    ...(values.isActive !== current.isActive ? { isActive: values.isActive } : {}),
});
