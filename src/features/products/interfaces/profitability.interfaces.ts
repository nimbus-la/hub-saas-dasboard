/**
 * Lo que se le pide al cálculo de rentabilidad, en números.
 *
 * El costo siempre va; además se manda el precio, el margen o los dos. Con
 * el margen el backend calcula el precio que lo alcanza, con el precio
 * calcula el margen real, y con los dos revisa que cuadren.
 */
export interface ProfitabilityInput {
    cost: number;
    price?: number;
    /** Parte del precio que se quiere ganar, de 0 a menos de 100. */
    targetMargin?: number;
}


/**
 * Cuerpo de `POST products/profitability`. Todo viaja como texto numérico,
 * también el margen: como número el backend lo rechaza con 400, aunque el
 * alta sí lo pida así.
 */
export interface ProfitabilityParams {
    cost: string;
    price?: string;
    targetMargin?: string;
}


/**
 * Resultado del cálculo como lo envía el backend: texto con dos decimales.
 * Con solo el costo, los demás llegan en `null`, y el markup también llega en
 * `null` con costo 0, porque sería una división por cero.
 */
export interface ProfitabilityApiResponse {
    cost: string;
    price: string | null;
    grossProfit: string | null;
    margin: string | null;
    foodCost: string | null;
    markup: string | null;
}


/**
 * El resultado del cálculo en números.
 *
 * `margin` y `foodCost` se reparten el precio y siempre suman 100. `margin` y
 * `markup` miden la misma ganancia contra bases distintas, el precio y el
 * costo, por eso el markup siempre da más.
 */
export interface Profitability {
    cost: number;
    price: number | null;
    /** Lo que queda de cada venta. Negativo si el precio no cubre el costo. */
    grossProfit: number | null;
    /** Parte del precio que es ganancia, en porcentaje. */
    margin: number | null;
    /** Parte del precio que se va en costo, en porcentaje. */
    foodCost: number | null;
    /** Cuánto se le subió al costo, en porcentaje. */
    markup: number | null;
}
