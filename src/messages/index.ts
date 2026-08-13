/* -------------------------------------------------------------------------- */
/*  Textos de la aplicación — punto de entrada único                          */
/*                                                                            */
/*  Todo se importa desde `@/messages`. Aquí no hay ni una clase de Tailwind   */
/*  ni un componente: es texto y nada más, igual que `@/tokens` son valores    */
/*  y nada más.                                                               */
/*                                                                            */
/*      import { messages, formatMessage, formatPlural } from "@/messages";   */
/*                                                                            */
/*      messages.products.categories.title            // "Categorías"          */
/*      formatPlural(messages.products.count, 22)     // "22 productos"        */
/*      formatMessage(messages.components.productCard.editProduct,             */
/*                    { name: product.name })         // "Editar Pizza"        */
/*                                                                            */
/*  Documentación completa: `docs/messages.md`.                               */
/* -------------------------------------------------------------------------- */

import { es } from "./locales/es";
import { DEFAULT_LOCALE, type Locale } from "./types";


/**
 * La forma que tiene un diccionario.
 *
 * Se deriva del español porque es el idioma que se escribe primero y el único
 * que no puede quedarse a medias. El día que entre otro, `dictionaries` no
 * compila hasta que ese otro tenga las mismas claves con los mismos tipos: no
 * hay forma de desplegar una traducción incompleta sin enterarse.
 */
export type Messages = typeof es;


/**
 * Los diccionarios, por idioma.
 *
 * Un objeto y no un `import()` dinámico: con un solo idioma, cargarlo aparte
 * sólo añadiría una promesa que resolver en cada pantalla. Cuando haya varios
 * y el peso importe, es esta constante la que pasa a `() => import(…)` y
 * `getMessages` la que se vuelve `async`; nada de lo que hay fuera de esta
 * carpeta cambia por eso salvo el punto donde se elige el idioma.
 */
const dictionaries = {
    es,
} as const satisfies Record<Locale, Messages>;


/** El diccionario de un idioma concreto. */
export const getMessages = (locale: Locale): Messages => dictionaries[locale];


/**
 * Los textos del idioma activo.
 *
 * Hoy es siempre el español, así que es una constante y se puede leer desde
 * cualquier sitio —Server Component, Client Component, una función suelta de
 * `libs/`— sin proveedor, sin hook y sin `await`. Ésa es la razón de que la
 * migración se pueda hacer de una vez y sin tocar la arquitectura.
 *
 * Cuando el idioma se pueda cambiar, este atajo deja de servir para los
 * componentes de cliente —el idioma pasa a ser estado— y ahí es donde entra un
 * proveedor con un hook `useMessages()`. Lo que **no** cambia es la forma de
 * las claves, que es la parte cara: `messages.products.list.title` seguirá
 * escribiéndose igual.
 */
export const messages: Messages = getMessages(DEFAULT_LOCALE);


export { formatMessage, formatPlural } from "./format";
export {
    DEFAULT_LOCALE,
    LOCALES,
    LOCALE_TAGS,
    type Locale,
    type MessageValues,
    type Plural,
} from "./types";
