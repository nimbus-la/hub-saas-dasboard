/**
 * Interpolación y plural
 *
 * Las dos únicas operaciones que un texto necesita antes de pintarse: meterle
 * datos en los huecos y elegir su forma según una cantidad.
 *
 * Los textos del catálogo son cadenas, no funciones. Podrían serlo —una
 * plantilla de TypeScript resuelve `${name}` sin ninguna ayuda— pero entonces
 * cada traducción sería código, y traducir dejaría de ser algo que se pueda
 * hacer sin abrir el editor. Con huecos `{nombre}` el diccionario sigue siendo
 * dato: se puede volcar a JSON, mandar a traducir y volver, sin tocar nada de
 * esto.
 */

import { formatNumber } from "@/lib/format";

import { LOCALE_TAGS, DEFAULT_LOCALE, type MessageValues, type Plural } from "./types";


/**
 * Reglas de plural del idioma activo.
 *
 * Se crea una sola vez: instanciar un `Intl.*` es caro y estas funciones se
 * llaman por celda de tabla y por tarjeta de una rejilla.
 */
const pluralRules = new Intl.PluralRules(LOCALE_TAGS[DEFAULT_LOCALE]);


/** Un hueco: `{nombre}`, `{count}`, `{max}`. */
const PLACEHOLDER = /\{(\w+)\}/g;


/**
 * Rellena los huecos de un texto.
 *
 *     formatMessage("Editar {name}", { name: "Bebidas" })  // "Editar Bebidas"
 *     formatMessage("Máximo {max} caracteres", { max: 40 })
 *
 * Los números pasan por `formatNumber`, así que `{total}` con 1200 se lee
 * `1.200` y no `1200`. Cuando eso no se quiere —un número de página, un año—
 * hay que pasarlo ya convertido a texto.
 *
 * Un hueco sin valor se queda tal cual, visible. Es a propósito: un `{name}`
 * en pantalla se ve y se arregla, mientras que borrarlo en silencio deja una
 * frase coja que nadie relaciona con la llamada que se olvidó un argumento.
 */
export function formatMessage(template: string, values?: MessageValues): string {
    if (!values) return template;

    return template.replace(PLACEHOLDER, (placeholder, key: string) => {
        const value = values[key];

        if (value === undefined) return placeholder;

        return typeof value === "number" ? formatNumber(value) : value;
    });
}


/**
 * Elige la forma que le toca a una cantidad y la rellena.
 *
 *     formatPlural(messages.products.list.count, 22)   // "22 productos"
 *     formatPlural(messages.products.list.count, 1)    // "1 producto"
 *
 * `{count}` se sustituye por la cantidad formateada sin que haya que pasarla
 * en `values`; el resto de huecos, si los hay, van ahí como siempre.
 *
 * Qué forma toca lo decide `Intl.PluralRules` y no un `=== 1`. En español la
 * diferencia no se nota, pero es justo el `if` que habría que ir a buscar a
 * treinta sitios el día que entre un idioma con más de dos formas.
 */
export function formatPlural(
    plural: Plural,
    count: number,
    values?: MessageValues
): string {
    if (count === 0 && plural.zero !== undefined) {
        return formatMessage(plural.zero, { count, ...values });
    }

    const template = pluralRules.select(count) === "one" ? plural.one : plural.other;

    return formatMessage(template, { count, ...values });
}
