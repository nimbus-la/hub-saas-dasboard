"use client";

/**
 * Valor con retraso
 *
 * Devuelve el valor que le entra, pero sólo después de que pase un rato sin que
 * cambie.
 *
 * ¿Por qué hace falta? TanStack Query no tiene debounce, y no es un olvido. Su
 * unidad de trabajo es la `queryKey`; en cuanto la clave cambia, hay una
 * consulta nueva que resolver. Escribir "hamburguesa" en el buscador cambia la
 * clave once veces y son once peticiones, diez de las cuales el usuario no
 * llegó a querer. Lo que sí pone Query es lo de después: la respuesta de cada
 * texto queda cacheada —borrar una letra no vuelve a pedir nada— y
 * `keepPreviousData` mantiene la tabla llena mientras llega lo nuevo.
 *
 * Así que el retraso va **antes** de la clave, no dentro de la consulta:
 *
 *     const [query, setQuery] = React.useState("");     // lo que se teclea
 *     const search = useDebouncedValue(query);          // lo que se pide
 *
 * El campo sigue respondiendo a cada tecla —lo pinta `query`— y el servidor
 * sólo se entera cuando el usuario para. Esa separación es justo el motivo de
 * no debounciar el `onChange` del input: hacerlo allí retrasaría también lo que
 * se ve escrito, y el campo se sentiría roto.
 */

import * as React from "react";


/**
 * Cuánto se espera por defecto.
 *
 * Cuatrocientos milisegundos es el hueco entre teclas de alguien que deja de
 * escribir, no el de alguien que escribe despacio: por debajo de ~250 ms se
 * dispara en mitad de una palabra y por encima de ~600 ms la lista se siente
 * enganchada.
 */
export const DEFAULT_DEBOUNCE_MS = 400;


export function useDebouncedValue<TValue>(
    value: TValue,
    delayMs: number = DEFAULT_DEBOUNCE_MS
): TValue {
    const [debouncedValue, setDebouncedValue] = React.useState<TValue>(value);

    React.useEffect(() => {
        const timer = setTimeout(() => setDebouncedValue(value), delayMs);

        /**
         * Cada tecla cancela el temporizador de la anterior, y por eso esto es
         * un debounce y no un throttle: no se publica un valor cada 400 ms, se
         * publica **uno solo** 400 ms después de la última tecla.
         * 
         * La limpieza también corre al desmontar, así que un campo que se cierra
         * a media escritura no despierta luego para actualizar un estado que ya
         * no existe.
         */
        return () => clearTimeout(timer);
    }, [value, delayMs]);

    return debouncedValue;
}
