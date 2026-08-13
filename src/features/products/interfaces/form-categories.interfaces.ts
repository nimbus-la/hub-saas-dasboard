/**
 * Valores del formulario de categoría
 *
 * **Un solo tipo para el alta y para la edición.** Los dos modos comparten
 * campos, reglas y mensajes; lo único que cambia es si el interruptor de estado
 * se enseña o no, y eso es una decisión de pintado, no de datos.
 *
 * Todos los campos son obligatorios, y eso no es un descuido: react-hook-form
 * alimenta con esto controles **controlados**, y un control controlado necesita
 * un valor concreto en cada render. Declarar `description?: string` hace que el
 * `<TextAreaField value={...}>` reciba `string | undefined`, que React
 * interpreta como "este campo pasa a ser no controlado" — el aviso clásico de
 * *"a component is changing a controlled input to be uncontrolled"*, con el
 * cursor saltando al final del texto al escribir.
 *
 * La ausencia se representa con el **valor vacío** del tipo, no quitando la
 * propiedad: `""` para el texto, `true` para el estado inicial. Convertir eso
 * en lo que espera la API —donde una descripción vacía sí se omite— es trabajo
 * de `toCreateCategoryPayload` y `toUpdateCategoryPayload`, en la frontera.
 */
export interface CategoryFormValues {
    name: string;
    description: string;
    isActive: boolean;
};
