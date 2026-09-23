/**
 * Valores del formulario de categoría. Se usa el mismo tipo para crear y para
 * editar, porque los dos modos tienen los mismos campos.
 *
 * Todos los campos son obligatorios porque los controles del formulario
 * necesitan siempre un valor. Si la descripción pudiera faltar, React avisaría
 * que el campo cambió de controlado a no controlado. Una descripción vacía se
 * guarda como texto vacío, y los mappers deciden si se envía o no al backend.
 */
export interface CategoryFormValues {
    name: string;
    description: string;
    isActive: boolean;
}
