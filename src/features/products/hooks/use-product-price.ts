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

import { useDebouncedValue } from "@/hooks";

import type { ProductFormValues, ProfitabilityInput } from "../interfaces";
import { PRICE_CALCULATION_DEBOUNCE_MS, PRICING_VALIDATION, hasCost } from "../libs";
import { useProfitability } from "./use-profitability";


/**
 * El último campo que la persona escribió entre el precio y el margen. Es el
 * que manda: el otro se calcula a partir de él. En `null` todavía no tocó
 * ninguno, que es como arranca la edición.
 */
type PriceDriver = "price" | "margin";


/**
 * Los números con los que se calcula: los que había cuando la persona dejó de
 * escribir o salió del campo. Lo que todavía se está escribiendo no entra.
 */
interface CommittedPricing {
    cost: number | null;
    price: number | null;
    margin: number | null;
    driver: PriceDriver | null;
}


const isValidMargin = (margin: number): boolean =>
    margin > PRICING_VALIDATION.margin.min && margin < PRICING_VALIDATION.margin.max;


/**
 * Qué preguntarle al backend con lo que hay escrito, o `null` si todavía no
 * alcanza para calcular nada.
 *
 * Sin un campo que mande se pide con el precio: así la edición muestra el
 * resumen del producto guardado sin cambiar ningún campo.
 */
function buildProfitabilityInput({
    cost,
    price,
    margin,
    driver,
}: CommittedPricing): ProfitabilityInput | null {
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

    // Lo escrito se manda a calcular cuando la persona deja de teclear un rato
    // o cuando sale del campo, lo que pase primero. El retraso usa el hook
    // general pero más largo que en un buscador (ver
    // `PRICE_CALCULATION_DEBOUNCE_MS`). Salir del campo no espera: es la señal
    // de que el número ya está completo.
    //
    // Lo que se retrasa es su forma en texto y no el objeto, que es nuevo en
    // cada render y reiniciaría la espera sin fin.
    const currentKey = JSON.stringify({ cost, price, margin, driver } satisfies CommittedPricing);
    const debouncedKey = useDebouncedValue(currentKey, PRICE_CALCULATION_DEBOUNCE_MS);
    const [blurredKey, setBlurredKey] = React.useState<string | null>(null);

    // Si lo último que se hizo fue salir del campo, eso manda; si se siguió
    // escribiendo después, vuelve a mandar la espera. Al abrir el formulario
    // el retraso arranca con lo que trae, así la edición muestra su resumen
    // sin que nadie toque nada.
    const committedKey = blurredKey === currentKey ? currentKey : debouncedKey;

    const committed = React.useMemo(
        () => JSON.parse(committedKey) as CommittedPricing,
        [committedKey]
    );

    const input = buildProfitabilityInput(committed);

    const { profitability, isCalculating, errorMessage } = useProfitability(input);

    // Hay algo escrito que todavía no se mandó a calcular: otro costo, otro
    // campo al mando o un cambio en el que manda. El campo que rellena el
    // backend no cuenta, porque ese cambio lo hizo el propio cálculo.
    const isUncommitted =
        cost !== committed.cost ||
        driver !== committed.driver ||
        (driver === "price" && price !== committed.price) ||
        (driver === "margin" && margin !== committed.margin);

    /**
     * Manda a calcular lo escrito sin esperar al retraso. Va en el `onBlur`
     * de los tres campos: salir del campo es la señal de que el número ya
     * está completo, y hacer esperar ahí solo demoraría el guardado.
     */
    const commit = React.useCallback(() => setBlurredKey(currentKey), [currentKey]);

    // Cuando llega la respuesta, se rellena el campo que no manda. Solo si no
    // hay nada nuevo a medio escribir: la respuesta es de lo que se mandó, y
    // escribirla encima de lo que se está tecleando lo pisaría.
    //
    // No se retroalimenta: rellenar el precio no cambia lo que se pregunta
    // cuando manda el margen, y al revés tampoco.
    React.useEffect(() => {
        if (isCalculating || errorMessage || isUncommitted) return;
        if (!profitability || !committed.driver) return;

        const field = committed.driver === "margin" ? "price" : "margin";
        const value = committed.driver === "margin" ? profitability.price : profitability.margin;

        if (value === null || value === getValues(field)) return;

        setValue(field, value, { shouldValidate: true, shouldDirty: true });
    }, [committed.driver, errorMessage, getValues, isCalculating, isUncommitted, profitability, setValue]);

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

        /** El cálculo del backend para lo último que se mandó, o `null` si no hay. */
        profitability,

        /** Si el backend está respondiendo. Es lo que enciende el "Calculando…". */
        isCalculating,

        /**
         * Si el resumen no corresponde a lo que hay escrito: falta que pase la
         * espera (o salir del campo) o falta la respuesta. Mientras tanto
         * precio y margen pueden no cuadrar, y guardar mandaría números que el
         * backend rechaza.
         */
        isOutdated: isUncommitted || isCalculating,

        /** El mensaje del backend si el cálculo falló. */
        errorMessage,

        /** El precio no deja ganancia. El backend no lo acepta. */
        isBelowCost: cost !== null && price !== null && hasCost(cost) && price <= cost,

        /** Sin costo no se puede calcular nada, así que precio y margen esperan. */
        hasCost: cost !== null && hasCost(cost),

        onCostChange: handleCostChange,
        onMarginChange: handleMarginChange,
        onPriceChange: handlePriceChange,

        /** Para el `onBlur` de los tres campos: calcula sin esperar. */
        onCommit: commit,
    };
}


/** Lo que devuelve `useProductPrice`, para pasarlo a la tarjeta del precio. */
export type ProductPrice = ReturnType<typeof useProductPrice>;
