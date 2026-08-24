import { formatMessage, messages } from "@/messages";
import { ProductFormStep } from "../interfaces";
import { BASICS_STEP, PRODUCT_FORM_STEP_LENGTH, PRODUCT_FORM_STEPS } from "../utils";


const message = messages.products.create;



/** 
 * Devuelve el paso del formulario correspondiente a una posición.
 * 
 * El índice se acota al rango válido de `PRODUCT_FORM_STEPS` para evitar
 * accesos fuera de los límites del array:
 * - Un índice negativo devuelve el primer paso.
 * - Un índice mayor al último devuelve el último paso.
 * 
 * De esta forma, quien la use recibe siempre  un `ProductFormStep` válido
 * sin tener que comprobar previamente si el índice está dentro del rango.
 * 
 * @param index - Posición del paso que se quiere obtener
 * @returns El paso correspondiente al índice, ajustado al rango válido
 */
export function getProductFormStep(index: number): ProductFormStep {
    const firstIndex: number = 0;
    const lastIndex: number = PRODUCT_FORM_STEP_LENGTH - 1;

    const safeIndex = Math.min(
        Math.max(index, firstIndex),
        lastIndex
    );

    return PRODUCT_FORM_STEPS[safeIndex] ?? BASICS_STEP;
}


/** `Paso 1 de 3` - para el resumen accesible y las pantallas estrechas */
export const formatStepPosition = (index: number): string =>
    formatMessage(message.stepPosition, {
        current: String(index + 1),
        total: String(PRODUCT_FORM_STEP_LENGTH)
    })