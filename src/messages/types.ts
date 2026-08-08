/**
 * Vocabulario del catálogo de textos
 *
 * Los tipos que hacen que un diccionario sea comprobable: qué idiomas existen,
 * cuál manda, y cómo se declara un texto que cambia con una cantidad.
 *
 * Este archivo no importa ningún diccionario a propósito. El tipo `Messages`
 * —la forma que todos deben cumplir— se deriva del español y vive en
 * `index.ts`, porque derivarlo aquí obligaría a importar el catálogo entero
 * para poder describirlo, y eso es una dependencia circular esperando a pasar.
 */


/* -------------------------------------------------------------------------- */
/*  Idiomas                                                                    */
/* -------------------------------------------------------------------------- */

/**
 * Idiomas que la aplicación sabe hablar.
 *
 * Hoy sólo el español. Añadir uno es escribir su carpeta bajo `locales/` y su
 * código aquí: a partir de ese momento TypeScript no deja compilar hasta que
 * el diccionario nuevo tenga **todas** las claves del español, que es la razón
 * de que el catálogo esté en TypeScript y no en JSON.
 */
export const LOCALES = ["es"] as const;

export type Locale = (typeof LOCALES)[number];


/**
 * Idioma de la interfaz mientras no haya forma de cambiarlo.
 *
 * No es lo mismo que el "idioma preferido del navegador": esa negociación,
 * cuando llegue, se resuelve en la ruta (`/[lang]/…`) y termina eligiendo uno
 * de `LOCALES`. Hasta entonces todo el mundo lee español.
 */
export const DEFAULT_LOCALE: Locale = "es";


/**
 * Etiqueta BCP-47 de cada idioma.
 *
 * Es lo que consumen las APIs de `Intl` —las reglas de plural de `format.ts` y,
 * el día que el idioma se pueda cambiar, los formateadores de `@/lib/format`—.
 * Lleva región porque el español de Colombia y el de España no puntúan igual
 * los números ni escriben igual las fechas.
 */
export const LOCALE_TAGS = {
    es: "es-CO",
} as const satisfies Record<Locale, string>;


/* -------------------------------------------------------------------------- */
/*  Textos con cantidad                                                        */
/* -------------------------------------------------------------------------- */

/**
 * Un texto que cambia según cuántos haya.
 *
 * `1 categoría` y `8 categorías` no son el mismo texto con un número delante:
 * son dos textos. Escribirlos como `count === 1 ? "categoría" : "categorías"`
 * funciona en español y se rompe en el primer idioma que tenga tres formas
 * —el ruso, el polaco, el árabe—, así que la elección la hace
 * `Intl.PluralRules` en `formatPlural` y aquí sólo se declaran las variantes.
 *
 * `zero` es opcional y **no** es la forma gramatical del cero: en español el
 * cero usa el plural (`0 ingredientes`). Está para cuando el cero merece otra
 * frase entera —`Sin ingredientes` en vez de `0 ingredientes`—, que es una
 * decisión de redacción, no de gramática.
 *
 * Las variantes admiten `{count}`, que `formatPlural` sustituye por la cantidad
 * ya formateada con separador de miles.
 */
export interface Plural {
    /** Forma singular. `1 producto` */
    one: string;
    /** Forma plural, y comodín para todo lo que no sea singular. `22 productos` */
    other: string;
    /** Frase propia del cero, cuando decir "0 algos" queda peor. */
    zero?: string;
}


/**
 * Valores que se inyectan en los huecos `{nombre}` de un texto.
 *
 * Los números entran sin formatear —`formatMessage` los pasa por el separador
 * de miles— para que quien llama no tenga que acordarse de hacerlo.
 */
export type MessageValues = Record<string, string | number>;
