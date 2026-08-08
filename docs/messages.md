# Textos

Todo lo que la aplicación le dice a quien la usa vive en `src/messages/`. Ni un
rótulo de botón, ni un mensaje de error, ni una etiqueta accesible se escribe
dentro de un componente.

La regla es la misma que con los tokens: **si se ve, no se inventa donde se
pinta**.

---

## En treinta segundos

```tsx
import { formatMessage, formatPlural, messages } from "@/messages";

messages.products.categories.title              // "Categorías"

formatPlural(messages.products.count, 22)       // "22 productos"
formatPlural(messages.products.count, 1)        // "1 producto"

formatMessage(messages.components.productCard.editProduct, {
    name: product.name,
})                                              // "Editar Pizza Margherita"
```

`messages` es una constante, no un hook: sirve igual en un Server Component, en
un Client Component y en una función suelta de `libs/`. No hay proveedor que
montar ni `await` que esperar.

---

## Cómo está repartido

```
src/messages/
  index.ts              →  messages, getMessages(), tipo Messages
  types.ts              →  Locale, Plural, DEFAULT_LOCALE, LOCALE_TAGS
  format.ts             →  formatMessage(), formatPlural()
  locales/
    es/
      index.ts          →  junta los cinco bloques
      common.messages.ts
      components.messages.ts
      navigation.messages.ts
      errors.messages.ts
      products.messages.ts
```

Los cinco bloques, y qué responde cada uno:

| Bloque | Qué contiene |
|---|---|
| `common` | Botones, estados y formularios que no pertenecen a ningún módulo |
| `components` | Lo que dice un componente de `src/components/` **por su cuenta**: valores por defecto de props y etiquetas accesibles |
| `navigation` | Marca, barra superior, menú lateral y los rótulos de sus entradas |
| `errors` | Fallos que redacta la aplicación cuando el backend no puede |
| `products` | Módulo de productos: catálogo, alta por pasos y categorías |

---

## Dónde va un texto nuevo

Tres preguntas, en este orden:

1. **¿Lo dice un componente del design system sin que nadie se lo pase?**
   Va a `components.<familia>`. El `Cerrar` de la equis de un modal es suyo; el
   título del modal lo pone la pantalla y no entra aquí.

2. **¿El *mismo* texto sirve en dos módulos distintos?**
   Va a `common`. Ojo con la trampa: que la palabra se repita no basta.
   `common.actions.create` es "Crear" a secas; "Crear categoría" es de
   productos aunque empiece igual, porque hay idiomas que ponen el verbo detrás
   del sustantivo y ahí la concatenación se rompe.

3. **En cualquier otro caso**, al bloque de su módulo, en la sección de la
   pantalla donde se lee.

Lo que **nunca** entra: datos. Los nombres de las sucursales, los de los
productos y los de las categorías vienen del backend; están en el catálogo de
textos sólo los que la aplicación redacta.

---

## Huecos: `formatMessage`

Un texto con datos dentro lleva huecos con nombre:

```ts
editProduct: "Editar {name}",
tooLarge: "La foto pesa {size} y el máximo son {max}. Redúcela e inténtalo de nuevo.",
```

```ts
formatMessage(copy.tooLarge, { size: "7,4 MB", max: "5,0 MB" })
```

No son plantillas de TypeScript (`` `Editar ${name}` ``) a propósito. Con huecos
el diccionario sigue siendo **dato**: se puede volcar a JSON, mandar a traducir
y volver sin que nadie tenga que abrir el editor. Con plantillas, cada
traducción sería código.

Los números pasan por el separador de miles, así que `{total}` con 1200 se lee
`1.200`. Cuando eso no se quiere —una posición, un número de página— hay que
pasarlo ya convertido con `String(...)`.

Un hueco sin valor se queda visible en pantalla. Es deliberado: un `{name}` a la
vista se ve y se arregla; borrarlo en silencio deja una frase coja que nadie
relaciona con la llamada que se olvidó un argumento.

---

## Cantidades: `formatPlural`

`1 categoría` y `8 categorías` no son el mismo texto con un número delante: son
dos textos. Se declaran como un `Plural`:

```ts
count: {
    one: "{count} categoría",
    other: "{count} categorías",
} satisfies Plural,
```

```ts
formatPlural(messages.products.categories.count, 8)   // "8 categorías"
```

`{count}` se rellena solo, ya formateado. Qué forma toca lo decide
`Intl.PluralRules`, no un `=== 1`: en español da igual, pero es justo el `if`
que habría que ir a buscar a treinta sitios el día que entre un idioma con tres
formas.

La tercera clave, `zero`, es opcional y **no** es la forma gramatical del cero
—en español el cero usa el plural—. Está para cuando el cero merece otra frase
entera:

```ts
ingredients: {
    zero: "Sin ingredientes",       // no "0 ingredientes"
    one: "{count} ingrediente",
    other: "{count} ingredientes",
} satisfies Plural,
```

---

## Texto con formato dentro

Cuando parte de la frase va resaltada, la tentación es partir el texto en tres
constantes y concatenarlas. No: el orden de las piezas es cosa del idioma.

La frase se declara entera y se parte **por sus huecos** en el punto de pintado.
El ejemplo vivo es el resumen de `Pagination`:

```ts
summary: "Mostrando {range} de {total} {items}",
```

```tsx
const SUMMARY_SLOTS = /(\{range\}|\{total\})/;   // el grupo conserva los delimitadores

messages.components.pagination.summary
    .split(SUMMARY_SLOTS)
    .map((part) => /* {range} y {total} van en <span>, el resto es texto */);
```

Un idioma que ponga el total delante sigue funcionando sin tocar el componente.

---

## Añadir un idioma

1. Copiar `locales/es/` a `locales/<código>/` y traducir.
2. Añadir el código a `LOCALES` y su etiqueta BCP-47 a `LOCALE_TAGS`, en
   `types.ts`.
3. Registrar el diccionario en `dictionaries`, en `index.ts`.

A partir del paso 2 **no compila** hasta que el diccionario nuevo tenga todas
las claves del español con los mismos tipos. Ésa es la razón de que el catálogo
esté en TypeScript y no en JSON: no hay forma de desplegar una traducción a
medias sin enterarse.

Lo que falta para que el idioma se pueda **cambiar** —y que hoy no está, porque
con un solo idioma sería infraestructura sin uso— es esto:

- Mover `src/app/` bajo `[lang]` y negociar el idioma en el proxy. El patrón
  está en `node_modules/next/dist/docs/01-app/02-guides/internationalization.md`.
- Cambiar `dictionaries` a `() => import(…)` para que cada idioma pese sólo en
  su ruta, y volver `getMessages` asíncrona.
- Un proveedor con un hook `useMessages()` para los Client Components, que es
  donde el idioma pasa a ser estado y la constante `messages` deja de valer.

Lo que **no** cambia en ninguno de los tres pasos es la forma de las claves, que
es la parte cara: `messages.products.list.title` se seguirá escribiendo igual.

---

## Qué está migrado

| Zona | Estado |
|---|---|
| `components/` — defaults y etiquetas accesibles de todas las familias | Migrado |
| `navbar/`, `sidebar/` y `DATA_MENU` | Migrado (la estructura del menú se queda en `data.utils.ts`; sólo el rótulo sale del catálogo) |
| `lib/http` — mensajes de red y de tiempo agotado | Migrado (`HTTP_ERROR_COPY` desaparece de `api.constants`) |
| `features/products/` — catálogo, alta por pasos y categorías | Migrado, reglas de validación incluidas |
| `lib/products.ts` — estados y contadores del dominio | Migrado |
| `app/` — metadata de las rutas de productos y del layout raíz | Migrado |
| `features/main-dashboard/` | **Pendiente.** Sus gráficas, leyendas y tablas accesibles siguen con sus literales |

Los nombres de las sucursales del `Navbar` y el catálogo de ejemplo de
`lib/products.ts` no están migrados **a propósito**: son datos de prueba a la
espera del backend, no textos de la interfaz.

### Cómo se leían antes

La migración se llevó por delante los bloques `COPY` sueltos que había en cada
pantalla. La forma de escribirlos era buena —el texto separado del JSX— pero
cada uno era una isla: `"Cancelar"` estaba escrito en cuatro archivos y no había
forma de saberlo sin buscarlo. Ahora esas constantes siguen existiendo, pero
apuntan al catálogo:

```ts
/** Todo lo que dice esta pantalla. Ver `@/messages`. */
const COPY = messages.products.categories;
```

El atajo se mantiene porque hace el JSX legible; lo que cambió es de dónde sale.
