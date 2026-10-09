"use client";

// ── El precio dentro del formulario ─────────────────────────────────────────
// Enlaza costo, precio y margen con el cálculo del backend. La persona escribe
// el costo y después el precio o el margen; el otro lo rellena el backend, que
// es quien después revisa al guardar que los tres cuadren. Calcularlo aquí con
// la misma fórmula daría diferencias de redondeo que el alta rechaza.
//
// Reemplaza a `useProductPricing`, que sacaba el costo de la receta y hacía la
// cuenta en el navegador. Ese se queda estacionado hasta que vuelvan las
// recetas.

import * as React from "react";
import { useWatch, type UseFormReturn } from "react-hook-form";

import type { ProductFormValues, ProfitabilityInput } from "../interfaces";
import { PRICING_VALIDATION, hasCost } from "../libs";
import { useProfitability } from "./use-profitability";


/**
 * El último campo que la persona escribió entre el precio y el margen. Es el
 * que manda: el otro se calcula a partir de él. En `null` todavía no tocó
 * ninguno, que es como arranca la edición.
 */
type PriceDriver = "price" | "margin";


const isValidMargin = (margin: number): boolean =>
    margin > PRICING_VALIDATION.margin.min && margin < PRICING_VALIDATION.margin.max;


/**
 * Qué preguntarle al backend con lo que hay escrito, o `null` si todavía no
 * alcanza para calcular nada.
 *
 * Sin un campo que mande se pide con el precio: así la edición muestra el
 * resumen del producto guardado sin cambiar ningún campo.
 */
function buildProfitabilityInput(
    cost: number | null,
    price: number | null,
    margin: number | null,
    driver: PriceDriver | null
): ProfitabilityInput | null {
    if (cost === null || !hasCost(cost)) return null;

    if (driver === "margin") {
        return margin !== null && isValidMargin(margin) ? { cost, targetMargin: margin } : null;
    }

    return price !== null && price > 0 ? { cost, price } : null;
}


export function useProductPrice({
    control,
    getValues,
    setValue,
    trigger,
}: UseFormReturn<ProductFormValues>) {
    const cost = useWatch({ control, name: "cost" });
    const price = useWatch({ control, name: "price" });
    const margin = useWatch({ control, name: "margin" });

    const [driver, setDriver] = React.useState<PriceDriver | null>(null);

    const input = buildProfitabilityInput(cost, price, margin, driver);

    const { profitability, isCalculating, errorMessage } = useProfitability(input);

    // Cuando llega la respuesta a lo último que se escribió, se rellena el
    // campo que no manda. Solo con la respuesta ya al día: mientras tanto el
    // cálculo en pantalla es el anterior, y escribirlo pisaría lo nuevo.
    //
    // No se retroalimenta: rellenar el precio no cambia lo que se pregunta
    // cuando manda el margen, y al revés tampoco.
    React.useEffect(() => {
        if (isCalculating || !profitability || !driver) return;

        const field = driver === "margin" ? "price" : "margin";
        const value = driver === "margin" ? profitability.price : profitability.margin;

        if (value === null || value === getValues(field)) return;

        setValue(field, value, { shouldValidate: true, shouldDirty: true });
    }, [driver, getValues, isCalculating, profitability, setValue]);

    // El campo avisa de sus cambios también cuando el valor le llega por
    // props, así que al rellenar el de al lado el aviso vuelve como si alguien
    // hubiera tecleado, y ese campo pasaría a mandar. Si lo que llega es lo
    // que ya está guardado, es ese eco y se ignora.
    const isEcho = React.useCallback(
        (field: "cost" | "margin" | "price", value: number | null) => value === getValues(field),
        [getValues]
    );

    const handleCostChange = React.useCallback(
        (value: number | null) => {
            if (isEcho("cost", value)) return;

            setValue("cost", value, { shouldValidate: true, shouldDirty: true });

            // Con otro costo se rehace el precio desde el margen y no al revés:
            // el margen es lo que la persona decidió ganar y el precio es su
            // consecuencia. Al editar todavía no manda ninguno, y entonces
            // pasa a mandar el margen guardado.
            setDriver((current) => current ?? "margin");

            // El precio compara contra el costo, así que su error puede
            // aparecer o irse sin que nadie lo toque.
            if (getValues("price") !== null) void trigger("price");
        },
        [getValues, isEcho, setValue, trigger]
    );

    const handleMarginChange = React.useCallback(
        (value: number | null) => {
            if (isEcho("margin", value)) return;

            setValue("margin", value, { shouldValidate: true, shouldDirty: true });
            setDriver("margin");
        },
        [isEcho, setValue]
    );

    const handlePriceChange = React.useCallback(
        (value: number | null) => {
            if (isEcho("price", value)) return;

            setValue("price", value, { shouldValidate: true, shouldDirty: true });
            setDriver("price");
        },
        [isEcho, setValue]
    );

    return {
        cost,
        price,
        margin,

        /** El cálculo del backend para lo que hay escrito, o el último que respondió. */
        profitability,

        /**
         * Si falta que el backend responda al último cambio. Mientras tanto el
         * campo que no manda todavía tiene el valor viejo, y guardar mandaría
         * tres números que no cuadran.
         */
        isCalculating,

        /** El mensaje del backend si el cálculo falló. */
        errorMessage,

        /** El precio no deja ganancia. El backend no lo acepta. */
        isBelowCost: cost !== null && price !== null && hasCost(cost) && price <= cost,

        /** Sin costo no se puede calcular nada, así que precio y margen esperan. */
        hasCost: cost !== null && hasCost(cost),

        onCostChange: handleCostChange,
        onMarginChange: handleMarginChange,
        onPriceChange: handlePriceChange,
    };
}


/** Lo que devuelve `useProductPrice`, para pasarlo a la tarjeta del precio. */
export type ProductPrice = ReturnType<typeof useProductPrice>;
