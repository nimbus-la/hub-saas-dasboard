# Arquitectura

Dónde vive cada cosa y por qué. Los otros documentos explican **cómo** se
escribe una pieza —un componente, un texto, una petición—; este explica **dónde
ponerla** y qué significa cada carpeta.

La idea entera cabe en una frase: **las rutas son finas y los features son
gordos**. `src/app/` solo declara qué URL existe y qué se pinta en ella; todo lo
demás —la pantalla, su estado, sus peticiones, sus textos y sus clases— vive en
`src/features/<módulo>/`. Lo que necesitan dos módulos distintos sube a la capa
compartida, y no antes.

El módulo de referencia es `products`. Cuando este documento dice "así se hace",
ahí está hecho.

---

## El recorrido de una pantalla

De la URL al backend y de vuelta, con los archivos reales de categorías:

```
src/app/products/categories/page.tsx      la ruta: metadata, precarga y poco más
  │
  └── features/products/page/Categories.tsx      la pantalla: compone y abre diálogos
        │
        ├── hooks/use-categories.ts              el estado: filtros, página, mutaciones
        │     │
        │     └── services/categories.service.ts qué ruta y qué verbo usa cada operación
        │           │
        │           ├── mappers/categories.mapper.ts   del backend al dominio
        │           └── @/lib/http                     el cliente, que ya abrió el sobre
        │
        ├── components/categories/*.tsx          las piezas, que solo reciben props
        ├── libs/categories.ts                   los cálculos y constantes del dominio
        └── style/categories.style.ts            las clases de la pantalla
```

Cada nivel conoce solo al de abajo. La pantalla no sabe cómo se llama la ruta
del backend ni cómo viene envuelta la respuesta; el servicio no sabe que existe
React.

---

## `src/app/` solo declara rutas

Un `page.tsx` hace como mucho cuatro cosas: exportar su `metadata` desde
`@/messages`, resolver datos si hacen falta en el servidor, montar el componente
del feature y nada más. No tiene JSX propio, ni estado, ni clases. Si un
`page.tsx` crece, lo que creció pertenece a un feature.

Hoy conviven tres maneras de resolver datos, y no son equivalentes:

| Forma | Dónde | Cuándo usarla |
|---|---|---|
| Precarga con hidratación | `products/categories/page.tsx` | **La buena.** Siempre que el dato venga del backend |
| Dato síncrono por props | `products/page.tsx` | Transitoria: el catálogo todavía sale de un mock en memoria |
| Nada | `products/create/page.tsx` | Cuando la pantalla parte de un borrador vacío y no hay nada que pedir |

La primera es la que conviene copiar. `src/app/products/categories/page.tsx`
está comentado línea a línea y explica las tres decisiones que la componen:
`connection()`, para que la ruta se renderice en cada petición y no se quede
congelada con las categorías que hubiera el día del despliegue; un `queryClient`
nuevo por render, porque uno compartido sería una caché común a todos los
usuarios que atiende el proceso; y `prefetchQuery` más `HydrationBoundary`, para
que la tabla llegue pintada en el HTML en lugar de aparecer vacía y rellenarse
después.

Para que esa precarga sirva de algo, la ruta y el hook tienen que pedir **lo
mismo**: por eso los dos pasan por `categoriesQueryOptions`, que vive en el
servicio. Si las claves no coincidieran, la precarga se tiraría a la basura sin
avisar a nadie.

---

## Anatomía de un feature

Ocho carpetas. Ninguna es obligatoria: aparecen cuando hacen falta.

| Carpeta | Qué guarda |
|---|---|
| `page/` | La pantalla completa: compone las piezas y gobierna los diálogos |
| `components/` | Las piezas de esa pantalla, agrupadas por zona |
| `hooks/` | El estado de pantalla: filtros, paginación, formularios, mutaciones |
| `services/` | Una función por operación del backend, más sus claves de caché |
| `mappers/` | La traducción entre la forma del backend y la del dominio |
| `interfaces/` | Los tipos del módulo: el dominio, la forma cruda, el contrato del servicio |
| `libs/` | La lógica y las constantes del dominio, sin React y sin clases |
| `style/` | Las clases de las pantallas, una hoja por archivo de `page/` |

### `page/`

Un archivo por pantalla, en `PascalCase` y sin el sufijo `Page` —ese ya lo pone
la carpeta—, con `export default`. Lo que queda aquí es composición: qué piezas
se pintan, en qué orden, y qué diálogo está abierto sobre qué elemento.

Lo que **no** queda aquí es de dónde salen los datos. `page/Categories.tsx`
empieza con una sola línea de sustancia, `const categories = useProductsCategories()`,
y a partir de ahí solo enchufa props.

### `components/`

Se agrupan por zona de la pantalla, no por tipo de componente: `categories/`,
`form/`, `list/`. Cada componente es `PascalCase.tsx` con su hoja hermana
`kebab-case.style.ts` al lado, y cada carpeta declara su API pública en su
`index.ts`.

Estos componentes reciben props y pintan. Cuando uno necesita saber algo que
nadie le pasó, casi siempre es señal de que ese dato le toca al hook.

### `hooks/`

`use-kebab-case.ts`. Aquí vive el estado que la pantalla enseña pero no calcula.

`use-categories.ts` es el ejemplo largo y vale la pena leerlo entero: junta los
filtros, la paginación y la consulta en ese orden concreto **porque unos
dependen de otros**, y explica por qué los filtros no pueden quedarse sueltos en
la pantalla. Texto, estado y página son una sola pregunta al servidor, y
separarlos abre la ventana en la que la tabla enseña una respuesta mientras los
controles describen otra.

### `services/`

`*.service.ts`. Qué ruta y qué verbo corresponden a cada operación, y nada más.
Tres reglas que no se negocian:

- **El cliente HTTP entra por parámetro**, no se importa. Es lo que permite que
  el mismo archivo sirva al servidor y al cliente.
- **Las rutas salen de `ENDPOINTS`** (`src/utils/endpoints.constants.ts`), nunca
  escritas a mano.
- **El servicio exporta también sus claves de caché y sus `queryOptions`**,
  porque el Server Component que precarga las necesita y no puede importar un
  módulo de cliente.

El detalle completo —el sobre del backend, los errores, los avisos— está en
[`http.md`](./http.md).

### `mappers/`

`*.mapper.ts`. Una frontera de una sola dirección: lo que entra tiene la forma
que decidió el backend, lo que sale tiene la forma con la que quiere trabajar la
aplicación. Todo lo que hay más adentro —caché, pantallas, tablas, formularios—
ve el tipo del dominio y solo ese.

Su trabajo concreto es **normalizar ausencias**: convertir los campos que pueden
no venir en valores que siempre existen. Eso es lo que quita los `??` repartidos
por el JSX. Lo que aquí no se decide es cómo *se ve* una ausencia: que una
descripción vacía se pinte con una raya es cosa de la tabla, no del dominio —el
mismo dato aparece en el formulario de edición, donde una raya sería un texto
que nadie escribió y que se guardaría como si sí.

### `interfaces/`

`*.interfaces.ts`, siempre en plural. Guarda tres clases de tipo: el modelo del
dominio (`CategoryList`), la forma cruda del backend (`CategoryListApiResponse`)
y el contrato del servicio (`CategoriesService`).

Los props de un componente **no** viven aquí. Se declaran en el propio `.tsx`,
justo debajo de los imports, y solo suben a `interfaces/` cuando más de un
componente los comparte. La razón es práctica: un tipo que usa un solo archivo
se lee mejor junto a lo que describe, y un `interfaces/` lleno de props ajenos
esconde lo que sí es transversal.

Los componentes de `src/components/`, que sí son compartidos, siguen la regla
contraria y llevan sus props a `src/interfaces/components/`. Ver
[`components.md`](./components.md).

### `libs/`

Un archivo por asunto, sin sufijo: el nombre del archivo es el tema.
`category-form.ts`, `product-image.ts`, `recipe.ts`. Dentro van juntas las
constantes y las funciones de ese asunto.

Se agrupa por tema y no por naturaleza —las constantes por un lado, las
funciones por otro— porque esa división no aguanta el primer caso real: las
reglas de un formulario son un objeto de mensajes **y** una función `validate` a
la vez. Separarlas obligaba a buscar en dos carpetas lo que siempre se lee de
una vez, y acababa con las reglas de categoría en un sitio y las de producto en
otro.

Aquí no hay una sola clase de Tailwind ni un solo componente. Es lógica y texto;
la pantalla decide cómo se pinta.

### `style/`

Una hoja por pantalla, con el mismo nombre: `page/Categories.tsx` ↔
`style/categories.style.ts`. Los estilos de cada pieza suelta no están aquí,
sino junto a su componente, en `components/<zona>/<componente>.style.ts`.

Todo se escribe con `cva` y con tokens; el porqué está en
[`components.md`](./components.md) y el catálogo de valores en
[`design-tokens.md`](./design-tokens.md).

---

## Dónde va un archivo nuevo

Cuatro preguntas en orden, y la primera que dé "sí" decide:

1. **¿Habla con el backend?** → `services/`, con su ruta en `ENDPOINTS`.
2. **¿Traduce lo que devolvió el backend?** → `mappers/`.
3. **¿Guarda algo que cambia mientras la pantalla está abierta?** → `hooks/`.
4. **¿Es una función o una constante del dominio, sin React?** → `libs/`.

Si no es ninguna de las cuatro y son clases, va a un `.style.ts`. Si es un
texto, va a `@/messages` ([`messages.md`](./messages.md)). Si es un número que
describe el sistema de diseño, va a `@/tokens`
([`design-tokens.md`](./design-tokens.md)).

---

## Cliente y servidor

La frontera se cruza una sola vez, y hacia abajo no se propaga:

- **Un servicio no lleva `"use client"`.** No importa React ni TanStack Query, y
  por eso la ruta puede usarlo desde el servidor para precargar.
- **Un hook sí la lleva**, porque usa estado.
- **Un componente que ya cuelga de un árbol cliente no la necesita.** La
  directiva marca dónde empieza el árbol, no cada rama; ponerla en una pieza que
  solo recibe props y pinta no cambia nada y despista sobre quién manda.
- **El cliente HTTP se coge distinto según dónde estés.** En un Server Component
  o una Server Action se importa `httpClient` de `@/lib/http`; en un componente
  o un hook se pide con `useHttpClient()` de `@/context`, que permite inyectar
  un doble en pruebas. Nadie instancia un cliente por su cuenta.

---

## Barriles y cómo se importa

Cada carpeta declara su API pública en un `index.ts`, y desde dentro del feature
se importa por ese barril con ruta relativa:

```ts
import { useProductsCategories } from "../hooks";
import type { CategoryList } from "../interfaces";
import { formatCategoryCount, PRODUCTS_LIST_HREF } from "../libs";
```

Hacia afuera, siempre por alias y por el barril de la capa: `@/components`,
`@/tokens`, `@/messages`, `@/interfaces`, `@/utils`, `@/context`. Saltarse el
barril con una ruta profunda funciona, pero deja al módulo sin poder reordenar
sus propios archivos sin romper a quien lo usa.

La excepción son las rutas: `src/app/products/categories/page.tsx` importa
`@/features/products/page/Categories` por ruta directa. Es deliberado — un
barril de feature arrastraría el módulo entero, con sus hooks de cliente, hasta
un archivo que se ejecuta en el servidor.

---

## Cuándo algo sale del feature

La prueba es sencilla: **cuando lo necesita la segunda pantalla**. No antes.
`PageHeader` y `Modal` nacieron así, los dos al aparecer categorías, porque eran
la segunda pantalla que necesitaba lo mismo. Cuando algo se necesita dos veces
deja de pertenecer a la pantalla donde apareció.

Conviene tener presente también el error contrario, que en este proyecto ya
ocurrió: doce de los componentes de `src/components/` tienen hoy **un solo
consumidor**, `products`. `ProductThumbnail` no lo usa ningún feature
directamente —solo `ProductCard` por dentro—, aunque se exporte en el barril
como si fuera una pieza independiente. Subir algo a la capa compartida por si
acaso no lo hace reutilizable; solo lo aleja de donde se entiende.

---

## Las capas compartidas

| Carpeta | Qué es | Detalle en |
|---|---|---|
| `src/components/` | Las familias del sistema de diseño | [`components.md`](./components.md) |
| `src/interfaces/` | Props de los compartidos, contratos HTTP, formas de los tokens | [`components.md`](./components.md) |
| `src/tokens/` | Las recetas y los números que JavaScript necesita | [`design-tokens.md`](./design-tokens.md) |
| `src/style/style.css` | Los valores: color, tipografía, radios, sombras | [`tailwind.md`](./tailwind.md) |
| `src/messages/` | Todos los textos de la interfaz, por módulo | [`messages.md`](./messages.md) |
| `src/lib/` | Infraestructura: cliente HTTP, caché, formato, tema | [`http.md`](./http.md) |
| `src/utils/` | Constantes de configuración: rutas, timeouts, menú | [`http.md`](./http.md) |
| `src/context/` | Los providers que monta el layout raíz | [`http.md`](./http.md) |
| `src/hooks/` | Los hooks que puede necesitar cualquier pantalla | [`http.md`](./http.md) |

Dos cosas que no se ven en la tabla y conviene saber.

**`src/lib/` mezcla hoy dos cosas distintas.** Por un lado la infraestructura de
verdad: `http/`, `query/`, `theme.ts`, `format.ts`, `pagination.ts`, `utils.ts`.
Por otro, cinco archivos de **datos de ejemplo** que desaparecerán cuando exista
el backend: `products.ts`, `ingredients.ts`, `recent-orders.ts`,
`top-products.ts` y `branch-sales.ts`. Nada en la carpeta avisa de cuáles son
cuáles, así que merece recordarse: cada uno de esos cinco define además su
propio tipo de entidad, y `ProductCard` —un componente compartido— importa
`Product` desde `@/lib/products`. La capa compartida apunta hoy hacia un mock.

**`src/utils/` y `src/lib/` no se dividen por "funciones puras" y "lo demás".**
La frontera real es otra: `utils/` es el archivo de configuración del proyecto
—`ENDPOINTS`, timeouts, tiempos de caché, el árbol del menú— y `lib/` es
infraestructura con comportamiento. Dentro de un feature esta división no
existe: ahí solo hay `libs/`.

---

## Estado real

Solo `products` sigue lo que describe este documento. Los otros tres módulos son
anteriores y cada uno eligió su propia forma:

| | `cashier` | `login` | `main-dashboard` |
|---|---|---|---|
| Archivos | 29 | 5 | 19 |
| Carpeta de página | `pages/` | `page/` | `page/` |
| Carpeta de tipos | `types/` | `types/` | no tiene |
| Datos | `data/` propio | ninguno | `@/lib/*` |
| Estilos en `.style.ts` | no | uno, a medias | no |
| Textos de `@/messages` | no | no | no |
| Barriles | ninguno | ninguno | parciales |

`main-dashboard` es el más cercano: ya tiene la configuración de Chart.js fuera
de los componentes, en `utils/charts/`, y el estado de la leyenda en un hook. Le
faltan sobre todo los textos y las hojas de estilo. `cashier` es el más lejano:
no importa `@/tokens` ni `@/messages`, y guarda sus órdenes en un mock dentro
del propio feature.

Cosas concretas que alguien tendrá que arreglar, y que conviene no tener que
descubrir dos veces:

- **`PaymentMethod` está declarado dos veces con valores distintos** en el mismo
  feature: `cashier/types/cashier.ts` dice `"daviplata"` y
  `cashier/types/payment.ts` dice `"bank"`. Mismo nombre, tipos incompatibles.
- **`PaymentInformation.tsx` son 452 líneas**, con cuatro formularios de pago y
  el mismo bloque "Total a pagar" repetido cuatro veces.
- **`CategoriesTable.tsx` usa `accessorKey: "placedAt"`**, un campo que
  `CategoryList` no tiene. Viene de copiar `RecentOrdersTable`, donde sí existe.
  La celda lee `updatedAt`, así que se ve bien, pero el accessor apunta a
  `undefined` y cualquier ordenación que dependa de él fallará en silencio.
- **El borrado de categorías está sin conectar** (`page/Categories.tsx`, con su
  `TODO`), aunque `CategoriesService.remove` ya existe y funciona.
- **El catálogo de productos no sigue este documento**: su modelo y su filtrado
  viven enteros en `@/lib/products`, y `page/Products.tsx` mantiene el estado de
  filtros y paginación dentro de la pantalla, donde categorías tiene
  `useProductsCategories`.
- **Código muerto**: `cashier/components/layout/CashierStatus.tsx` no lo importa
  nadie, `login/hooks/use-login.ts` está vacío, `login/types/login.types.ts` no
  se usa, y `main-dashboard/utils/index.ts` es un barril sin nada dentro.
- **`src/app/page.tsx`** sigue siendo el andamio de Next, con un `<h1>Hola</h1>`.
  La ruta real del panel es `/dashboard`.
- **`src/components/ui/`** todavía tiene tres archivos de shadcn: `input.tsx`,
  que solo usa `cashier`, y `card.tsx` y `tabs.tsx`, que no usa nadie.

El orden natural para seguir es `main-dashboard`, donde falta poco, y después
`cashier`, que necesita además todos sus textos.

---

## Levantar un feature nuevo

- [ ] La ruta en `src/app/` solo tiene `metadata` y el componente de la pantalla
- [ ] La pantalla vive en `features/<módulo>/page/`, no en `app/`
- [ ] Los datos del backend pasan por `services/` y `mappers/`, y las rutas
      salen de `ENDPOINTS`
- [ ] El servicio recibe el `HttpClient` por parámetro y exporta sus claves de
      caché y sus `queryOptions`
- [ ] El estado de pantalla está en un hook, no en el `.tsx`
- [ ] Los textos salen de `@/messages`, incluida la `metadata`
- [ ] Las clases están en `.style.ts`, con `cva` y con tokens
- [ ] Cada carpeta tiene su `index.ts` y se importa por él
- [ ] Nada subió a `src/components/` sin tener dos consumidores
- [ ] `pnpm typecheck` y `pnpm lint` pasan
