# Peticiones, servicios y avisos

Cómo habla la aplicación con el backend: quién hace cada petición, qué forma
tiene una respuesta, cómo se integra un endpoint nuevo y cómo aparecen los
avisos en pantalla.

Hoy la única integración real es **categorías de producto**
(`features/products`). Todo lo que sigue está escrito a partir de ella, así que
sirve de plantilla: el resto de módulos todavía trabaja con los datos de
ejemplo de `src/lib/*.ts`.

---

## En treinta segundos

Leer datos en una pantalla:

```tsx
const categories = useProductsCategories();

categories.data        // las filas de la página actual, ya mapeadas
categories.total       // cuántas cumplen los filtros, según el backend
categories.isLoading   // primera carga
```

Mandar algo y avisar:

```ts
await categories.create.mutateAsync(toCreateCategoryParams(values));
// El aviso de éxito lo lanza la caché por su cuenta: la mutación
// lleva meta: { alertOnSuccess: true }.
```

Avisar a mano, desde cualquier sitio:

```ts
import { notify } from "@/components";

notify.success("Categoría creada");
notify.error("No se pudo guardar", { duration: null });
```

---

## El mapa

Cada capa conoce solo a la de abajo. De abajo arriba:

```
fetch
  └── FetchHttpClient      transporte: timeouts, query string, cabeceras,
      │                    y traduce cualquier fallo a HttpError
      └── EnvelopeHttpClient   abre el sobre del backend y convierte un
          │                    código de fallo en un error lanzado
          └── httpClient       la instancia compartida (lib/http/index.ts)
              │
              ├── servicio      qué ruta y qué verbo usa cada operación,
              │   + mapper      y traduce la respuesta al dominio
              │
              ├── queryOptions  clave de caché + función de consulta
              │
              └── hook          estado de pantalla: filtros, página, mutaciones
                  │
                  └── pantalla  composición y diálogos
```

En paralelo, la caché de TanStack Query enruta errores y éxitos hacia los
avisos:

```
QueryCache / MutationCache  →  notifyApi  →  resolveApiAlert  →  AlertToaster
```

| Archivo | Responsabilidad |
|---|---|
| `src/lib/http/` | Cliente, sobre, error y traducción a aviso |
| `src/interfaces/http/` | Contratos: `HttpClient`, `ApiEnvelope`, `HttpError` |
| `src/utils/http.constants.ts` | Timeout, códigos del sobre, qué se reintenta |
| `src/utils/endpoints.constants.ts` | Las rutas del backend, todas juntas |
| `src/lib/query/query-client.ts` | Política de caché, reintentos y avisos |
| `src/context/HttpClientContext.tsx` | Inyección del cliente en el árbol de React |
| `features/*/services/` | Una función por operación del backend |
| `features/*/mappers/` | Traducción entre la forma del backend y el dominio |

---

## El sobre del backend

El backend nunca devuelve el objeto pelado. Lo envuelve:

```ts
interface ApiEnvelope<TContent> {
    status: "SUCCESS" | "ERROR" | "WARNING" | "INFO";
    code: string;        // "0000" es éxito
    httpStatus: number;  // el código que el backend considera adecuado
    message: string;     // texto ya redactado
    content: TContent;   // lo que se pidió
    traceId?: string;    // para buscar en los registros del servidor
}
```

Quien decide si la operación salió bien es **`code`**, no `status` ni el código
HTTP. Los códigos que no son un fallo están en una lista:

| Código | Significa | Constante |
|---|---|---|
| `"0000"` | Todo bien, `content` trae lo que se esperaba | `API_SUCCESS_CODE` |
| `"0001"` | La consulta salió bien y no hay resultados | `API_EMPTY_RESULT_CODE` |

Es una lista y no una comparación con `"0000"` por un motivo concreto: "no hay
resultados" llega con código propio, HTTP 200 y una página vacía pero válida
dentro. Tratarlo como error hacía que una búsqueda sin coincidencias tirase los
datos de la tabla y pintase un aviso de avería, cuando lo único que pasaba es
que no había nada que enseñar.

Cualquier otro código hace que `EnvelopeHttpClient` lance un `HttpError`, aunque
el HTTP sea 200.

### Respuestas paginadas

Cuando la operación pagina, el `content` es un `ApiResponseWithPagination`: los
elementos van en `rows` y alrededor viaja el estado del pie.

```ts
{
    rows: Category[],
    pageNumber: number,
    pageSize: number,
    total: number,     // el de los resultados con los filtros puestos
}
```

Ese `total` es el de la consulta filtrada, no el del catálogo entero, y es de
donde el pie saca cuántas páginas hay.

---

## Usar el cliente HTTP

Los cinco verbos devuelven **el sobre completo**, no su `content`, porque el
`code` y el `message` son los que deciden el aviso:

```ts
get<TContent>(url, config?)
post<TContent>(url, body?, config?)
put<TContent>(url, body?, config?)
patch<TContent>(url, body?, config?)
delete<TContent>(url, config?)
```

El parámetro de tipo es el `content`, que es lo único que cambia de un endpoint
a otro. Quien solo quiere los datos los saca con un destructuring:

```ts
const { content } = await http.get<Category[]>(ENDPOINTS.PRODUCTS_CATEGORY);
```

### De dónde sale el cliente

Depende de dónde estés, y no es intercambiable:

```ts
// Server Component o Server Action
import { httpClient } from "@/lib/http";

// Componente o hook de cliente
import { useHttpClient } from "@/context";
const http = useHttpClient();
```

`useHttpClient()` existe para poder envolver el árbol con un cliente falso en
pruebas, y para el día que el cliente necesite algo del contexto de React (el
token de sesión, la sucursal activa). Lanza si falta el proveedor en lugar de
caer al cliente compartido, para que un componente fuera del proveedor falle a
la primera en vez de saltarse el doble en las pruebas.

Nadie más instancia un cliente. El único punto de composición es
`src/lib/http/index.ts`; ahí se apilan los decoradores y ahí entrarían los que
faltan (`AuthHttpClient`, `LoggingHttpClient`).

### Las rutas

Siempre desde `ENDPOINTS`, nunca escritas a mano en el servicio:

```ts
import { ENDPOINTS } from "@/utils";

ENDPOINTS.PRODUCTS_CATEGORY   // "products/categories"
```

Ahí va la ruta de la colección. La de un elemento la compone el servicio
añadiéndole el identificador, porque es la misma ruta con otro verbo. El origen
(`https://api…`) no entra: lo pone el cliente desde `NEXT_PUBLIC_API_URL`.

### `config`: lo que se puede ajustar por petición

| Campo | Para qué |
|---|---|
| `params` | Query string. `null` y `undefined` se omiten; un array repite la clave (`tag=a&tag=b`) |
| `headers` | Cabeceras de esta llamada, fusionadas sobre las del cliente |
| `signal` | Cancelación. TanStack Query pasa la suya y se combina con el timeout |
| `timeoutMs` | Sobrescribe los 20 s por defecto. `0` desactiva el límite |
| `responseAs` | `"json"` (por defecto), `"text"` o `"blob"` para descargas |
| `credentials` | Envío de cookies si la sesión va en otro dominio |
| `next` | `revalidate` y `tags` de Next, para Server Components |

---

## Errores

Todo lo que puede fallar llega como **`HttpError`**. La interfaz nunca ve un
`TypeError: Failed to fetch` ni un `DOMException`.

```ts
import { isHttpError } from "@/lib/http";

if (isHttpError(error)) {
    error.kind      // qué falló
    error.status    // código HTTP real, o null
    error.code      // código de negocio del backend, o null
    error.apiMessage
    error.isUnauthorized
    error.isServerError
    error.hasStatusMismatch  // el sobre dice un código y la respuesta otro
}
```

Los cinco `kind`:

| `kind` | Qué pasó |
|---|---|
| `response` | El servidor contestó con un error, o el sobre trajo un código de fallo |
| `network` | No hubo respuesta: DNS, CORS, sin conexión, servidor caído |
| `timeout` | Se agotó la espera |
| `aborted` | Lo canceló el llamante |
| `parse` | Respondió bien, pero el cuerpo no tiene la forma esperada |

Se distingue preguntando a las señales cuál se disparó, no leyendo el mensaje de
la excepción, que cambia entre navegadores.

### Qué se reintenta

`isRetryableError` decide, y lo consume la política de la caché: se repite lo
que puede resolverse con el tiempo (`network`, `timeout`, los 5xx y los 408,
425 y 429) y nunca lo que va a fallar igual. Un 422 con los mismos datos se
rechaza las veces que haga falta, así que falla una vez y se muestra de
inmediato.

Las mutaciones no se reintentan solas: repetir un `POST` que quizá sí llegó
puede crear el registro dos veces. Reintentar es decisión del usuario, con un
botón.

---

## Avisos

### Los automáticos

La caché ya avisa por su cuenta. Está montado en `query-client.ts`: el
`QueryCache` y el `MutationCache` mandan lo que pasa a `notifyApi`, que traduce
la respuesta a un aviso y lo lanza.

- **Los errores se avisan siempre**, en consultas y en mutaciones.
- **Los éxitos no**, salvo que la mutación lo pida con `meta`.

```ts
const createCategory = useMutation({
    mutationFn: (params) => service.create(params),
    onSuccess: invalidate,
    meta: { alertOnSuccess: true },   // avisa con el message del backend
});
```

Lo que se puede declarar en `meta`:

| Clave | Efecto |
|---|---|
| `alertOnError: false` | Silencia el aviso de error de esa consulta o mutación |
| `alertOnSuccess: true` | Avisa al terminar bien. Solo en mutaciones |
| `alertOptions` | `NotifyOptions` para ese aviso: `duration`, `id`, `description`… |

Está tipado: `QueryAlertPolicy` y `MutationAlertPolicy` se registran en el
módulo de TanStack Query, así que `meta` autocompleta y no admite claves
inventadas.

Para silenciar un aviso se usa `meta`, no un try/catch en la pantalla.

### Qué texto se muestra

Lo decide `resolveApiAlert`, y la regla es que **el backend gana cuando puede
explicarse**:

| Situación | Texto |
|---|---|
| Sobre con `httpStatus` 200, HTTP 200 y `message` no vacío | El `message` del backend |
| `kind: "network"` | `errors.http.network` |
| `kind: "timeout"` | `errors.http.timeout` |
| `kind: "aborted"` | Ninguno: no se avisa de lo que se canceló |
| Cualquier otro caso | `errors.unexpected` |

El `message` de un 500 no se le enseña a nadie: queda en el error para quien
mire el registro. Solo se muestra el de una respuesta que el backend declara
presentable (`API_PRESENTABLE_STATUS`), y el tono sale de su `status` con
`ALERT_TONE_BY_API_STATUS`.

Cuando solo hace falta el texto, por ejemplo para avisar desde un `catch`:

```ts
import { getApiErrorMessage } from "@/lib/http";

catch (error: unknown) {
    notify.error(getApiErrorMessage(error));
}
```

Es lo que hace la pantalla de categorías al guardar: el modal se queda abierto
con lo que se escribió y el motivo encima, en vez de obligar a reescribirlo.

### Avisar a mano: `notify`

```ts
import { notify } from "@/components";

notify.info("El turno se cierra en 10 minutos");
notify.success("Categoría creada");
notify.warning("Quedan 3 unidades de queso mozzarella");
notify.error("No se pudo guardar", { duration: null });
notify.neutral("Sucursal cambiada a Centro");

notify.dismiss(id);   // retirar uno, o todos si no se pasa id
```

Es una función y no un hook porque un aviso se lanza casi siempre desde donde
no hay render: el `onSuccess` de una mutación, un `catch`, un manejador de
evento.

Opciones útiles (`NotifyOptions`):

| Opción | Cuándo |
|---|---|
| `duration` | Por defecto 5 s. **`null` no caduca**: úsalo cuando el usuario tiene que hacerse cargo del error |
| `id` | Repetirlo actualiza el aviso en pantalla en vez de apilar otro igual. Es lo que evita seis "Sin conexión" seguidos |
| `description` | El detalle y qué hacer ahora. Acepta nodos, así que admite un enlace |
| `actions` | "Reintentar", "Deshacer". El temporizador se para mientras el puntero está sobre la pila |

El `Toaster` se monta una sola vez, en el layout raíz. Dentro de una pantalla,
cuando el aviso no flota sino que forma parte del contenido, se usa `Alert`
directamente con `variant="soft"`.

---

## Integrar un endpoint nuevo

La receta completa, en el orden en que conviene escribirla. El ejemplo es
categorías; los archivos están en `features/products/`.

### 1. La ruta

```ts
// src/utils/endpoints.constants.ts
export const ENDPOINTS = {
    PRODUCTS_CATEGORY: "products/categories",
} as const;
```

### 2. Los tipos: dos formas, no una

Una para lo que manda el backend y otra para lo que usa la aplicación. Esta
separación es la que permite que el resto del código no sepa nada de campos
opcionales:

```ts
// interfaces/categories.interfaces.ts
export interface CategoryListApiResponse {
    id: string;
    name: string;
    description?: string;   // puede no venir
    isActive: boolean;
    updatedAt: string;
    createdAt: string;
}

export interface CategoryList {
    id: string;
    name: string;
    description: string;    // aquí siempre existe
    isActive: boolean;
    updatedAt: string;
}
```

Los cuerpos de escritura también van tipados, y conviene que sean estrictos:
`CreateCategoryParams` no admite `isActive` porque al crear lo decide el
servidor, así que mandarlo es un error de compilación en lugar de una regla que
hay que recordar.

### 3. El mapper

Normaliza las ausencias, y nada más. Cómo se *ve* un hueco es cosa de la tabla:

```ts
// mappers/categories.mapper.ts
export const toCategory = (category: CategoryListApiResponse): CategoryList => ({
    id: category.id,
    name: category.name,
    description: category.description ?? "",
    updatedAt: formatDate(category.updatedAt),
    isActive: category.isActive,
});
```

Mapea también lo que devuelven el alta, la edición y el detalle, no solo el
listado: si no, la categoría recién creada entra en la caché con la forma cruda
y es la única fila que no cumple el contrato.

Para el camino de vuelta hay mappers simétricos (`toCreateCategoryParams`), que
recortan los extremos y omiten los campos vacíos, porque `""` y "no tiene" no
son lo mismo para el backend.

### 4. El contrato del servicio

```ts
// interfaces/categories-service.interface.ts
export interface CategoriesService {
    list(params: CategoryListParams, config?: HttpRequestConfig):
        Promise<ApiResponseWithPagination<CategoryList[]>>;
    detail(id: string, config?: HttpRequestConfig): Promise<CategoryList>;
    create(payload: CreateCategoryParams, config?: HttpRequestConfig): Promise<ApiEnvelope<null>>;
    update(id: string, payload: UpdateCategoryParams, config?: HttpRequestConfig): Promise<ApiEnvelope<null>>;
    remove(id: string, config?: HttpRequestConfig): Promise<unknown>;
}
```

La paginación va como argumento propio y no como una entrada más de `config`:
es lo único que el llamante decide siempre, y con tipo propio olvidarla no
compila.

### 5. El servicio

Recibe el `HttpClient` **por parámetro**. Es lo que permite que el mismo archivo
sirva al servidor y al cliente, así que no lleva `"use client"` ni importa React:

```ts
// services/categories.service.ts
export function createCategoriesService(http: HttpClient): CategoriesService {
    return {
        list: async (params, config) => {
            const { content } = await http.get<ApiResponseWithPagination<CategoryListApiResponse[]>>(
                ENDPOINTS.PRODUCTS_CATEGORY,
                withTenantParam(withListParams(params, config))
            );

            return { ...content, rows: toCategoryList(content.rows) };
        },
        // …
    };
}
```

Solo se traducen las filas; `pageNumber`, `pageSize` y `total` se conservan tal
cual porque los necesita el pie.

### 6. Las claves de caché y las `queryOptions`

Viven en el servicio, no junto a los hooks, porque el Server Component que
precarga también las necesita y no puede importar un módulo `"use client"`:

```ts
export const categoryKeys = {
    all: ["products_categories"] as const,
    lists: () => [...categoryKeys.all, "products_categories_list"] as const,
    list: (params: CategoryListParams) => [...categoryKeys.lists(), params] as const,
    detail: (id: string) => [...categoryKeys.all, "products_categories_detail", id] as const,
};

export function categoriesQueryOptions(service: CategoriesService, params = DEFAULT_CATEGORIES_PAGINATION) {
    return {
        queryKey: categoryKeys.list(params),
        queryFn: ({ signal }: { signal: AbortSignal }) => service.list(params, { signal }),
    };
}
```

La jerarquía permite invalidar por prefijo: `all` alcanza listado y detalles,
`lists()` refresca todas las páginas sin saber en cuál está el usuario.

La página y los filtros entran en la clave porque cada combinación es una
respuesta distinta. Eso además abarata la búsqueda: borrar una letra vuelve a
una clave ya pedida y la respuesta sale de caché.

El `signal` viene de TanStack Query y llega hasta `fetch`, así que una consulta
que deja de interesar cancela su petición de verdad.

### 7. El hook

Es donde se juntan filtros, página, consulta y mutaciones. El orden importa,
porque cada paso depende del anterior:

```ts
export function useProductsCategories() {
    const http = useHttpClient();
    const queryClient = useQueryClient();

    // Una sola instancia para la consulta y las dos mutaciones.
    const service = React.useMemo(() => createCategoriesService(http), [http]);

    const filters = useCategoryFilters();                    // 1. publican su huella

    const pagination = usePagination({                       // 2. vuelve a la página 1
        initialPageSize: DEFAULT_CATEGORIES_PAGINATION.pageSize,
        resetKey: filters.key,                               //    cuando la huella cambia
    });

    const query = useQuery({                                 // 3. necesita las dos cosas
        ...categoriesQueryOptions(service, { ...pagination.params, ...filters.params }),
        placeholderData: keepPreviousData,
    });

    useClampedPage(pagination, query.data?.total);           // 4. necesita el total

    const invalidate = () =>
        queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });

    const createCategory = useMutation({
        mutationFn: (params: CreateCategoryParams) => service.create(params),
        onSuccess: invalidate,
        meta: { alertOnSuccess: true },
    });

    return { data: query.data?.rows ?? NO_CATEGORIES, total: query.data?.total ?? 0,
             filters, pagination, create: createCategory, /* … */ };
}
```

Dos detalles que ahorran depuración:

- **`placeholderData: keepPreviousData`** mantiene la tabla llena mientras llega
  la página siguiente. Sin él, cada clic en el pie la vacía, la altura salta y
  el estado vacío aparece un instante diciendo algo que es falso.
- **La lista vacía es una constante** (`NO_CATEGORIES`), no un `[]` literal. Un
  array nuevo en cada render rompe la igualdad por referencia de todo lo que la
  reciba.

### 8. La precarga en la ruta

El Server Component pide la primera página, la deja en la caché y monta la
pantalla encima:

```tsx
// app/products/categories/page.tsx
export default async function CategoriesPage() {
    await connection();                     // se renderiza en cada petición

    const queryClient = getQueryClient();   // uno nuevo por render en servidor

    await queryClient.prefetchQuery(
        categoriesQueryOptions(createCategoriesService(httpClient))
    );

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <Categories />
        </HydrationBoundary>
    );
}
```

Tres cosas que tienen que cumplirse para que esto sirva de algo:

1. **`await connection()`**, o Next prerrenderiza la ruta en el `build` y el
   panel enseña el catálogo del día del despliegue. No se usa
   `export const dynamic = "force-dynamic"` porque Next 16 la elimina al
   habilitar Cache Components.
2. **Un `QueryClient` por render.** En el servidor no puede haber uno
   compartido: sería una caché común a todos los usuarios que atiende el
   proceso.
3. **La clave tiene que coincidir** con la del primer render del cliente. Por
   eso la paginación por defecto es una constante compartida
   (`DEFAULT_CATEGORIES_PAGINATION`) y no un número escrito en cada sitio: con
   valores distintos, la hidratación no encuentra nada y la tabla vuelve a
   pedir el listado al cargar.

`prefetchQuery` no lanza si el backend falla: guarda el error y sigue, así que
un mal segundo de la API no tumba la ruta.

### 9. La pantalla

Solo compone. Los manejadores del buscador y del selector son los del hook, sin
envolver, porque la espera del buscador y la vuelta a la primera página ya
están resueltas dentro:

```tsx
const categories = useProductsCategories();
const { filters, pagination } = categories;

await categories.update.mutateAsync({ id, params: toUpdateCategoryParams(values, target) });
```

Conviene que el envío sea `async` y que la pantalla lo espere: eso mantiene el
`isSubmitting` de react-hook-form mientras la petición viaja, que es lo que
deshabilita el botón y evita el doble clic que crearía el registro dos veces.

---

## Después de mutar: invalidar

```ts
const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
```

Se invalida **todo el listado**, no la página visible. Crear o editar reordena
la colección entera: lo que estaba en la página 2 pasa a la 3, y las demás
páginas se quedarían en caché con datos que ya no son.

---

## Paginación, filtros y búsqueda

Tres piezas compartidas, en `src/hooks/` y `src/lib/pagination.ts`.

### `usePagination`

Guarda página y tamaño, y expone `params` con identidad estable para pasárselo
a la clave de caché sin construir un objeto nuevo en cada render.

```ts
const pagination = usePagination({ initialPageSize: 12, resetKey: filters.key });

pagination.pageNumber      // empieza en 1, como la que se ve en pantalla
pagination.params          // { pageNumber, pageSize }
pagination.goToPage(3)
pagination.changePageSize(24)   // vuelve a la primera página
```

`resetKey` es la huella de lo que se está listando. Cuando cambia, el hook
vuelve a la página 1 **durante el render**, así que el cambio de filtro y la
vuelta a la primera página entran en la misma consulta y no en dos. Es una
cadena y no el objeto de filtros a propósito: se compara por valor, y un objeto
nuevo en cada render provocaría un reinicio infinito.

Valores por defecto en `lib/pagination.ts`: `FIRST_PAGE` 1, `DEFAULT_PAGE_SIZE`
12, `PAGE_SIZE_OPTIONS` `[8, 12, 24]`.

### `useClampedPage`

La última página puede desaparecer bajo los pies, al borrar el único elemento
que quedaba en ella o al subir el tamaño de página. Este hook ajusta la página
actual cuando llega el `total`.

### `useDebouncedValue`

TanStack Query no trae debounce porque su disparador es la clave, así que el
retraso tiene que estar **antes** de que el texto forme parte de ella:

```ts
const searchText = useDebouncedValue(query);   // 400 ms por defecto
```

De ahí la distinción que hace todo el trabajo en `useCategoryFilters`:

- **Lo que se escribe** (`query`) cambia en cada tecla y es lo que pinta el
  campo. Si se retrasara, el campo se sentiría roto.
- **Lo que se pide** (`params`) cambia cuando el usuario para de escribir, y es
  lo que decide cuántas veces se llama al servidor.

El selector de estado no pasa por el retraso: elegir "Inactivas" es una sola
acción deliberada, no una ráfaga de once.

Los filtros se construyen **por omisión**: un filtro sin elegir no se manda
vacío, porque `?text=` no significa "sin filtro" para el backend, significa
"filtra por cadena vacía" y devuelve cero resultados.

---

## Dónde se ajusta qué

Están separados porque son dos motivos de cambio distintos: uno describe **cómo**
se habla con el backend y el otro **cuándo** se vuelve a preguntar.

`src/utils/http.constants.ts`

| Constante | Valor | Qué gobierna |
|---|---|---|
| `HTTP_DEFAULT_TIMEOUT_MS` | 20 s | Espera máxima por petición. `fetch` no tiene límite propio |
| `HTTP_EMPTY_STATUSES` | 204, 205 | Respuestas sin cuerpo, que no se intentan parsear |
| `HTTP_RETRYABLE_STATUSES` | 408, 425, 429 | Los 4xx que se resuelven repitiendo |
| `API_SUCCESS_CODE` | `"0000"` | Éxito |
| `API_EMPTY_RESULT_CODE` | `"0001"` | Sin resultados, que no es un fallo |
| `API_PRESENTABLE_STATUS` | 200 | El único `httpStatus` cuyo `message` se muestra |

`src/utils/query.constants.ts`

| Constante | Valor | Qué gobierna |
|---|---|---|
| `QUERY_DEFAULT_STALE_TIME_MS` | 60 s | Cuánto dura fresco un dato antes de volver a pedirlo |
| `QUERY_DEFAULT_GC_TIME_MS` | 5 min | Cuánto sobrevive en memoria lo que nadie mira |
| `QUERY_MAX_RETRIES` | 2 | Reintentos, sin contar el original |
| `QUERY_RETRY_BASE_DELAY_MS` | 1 s | Primera espera; se duplica en cada intento |
| `QUERY_MAX_RETRY_DELAY_MS` | 15 s | Techo de esa espera |

Un dato que cambia rápido (comandas, métricas del día) baja su `staleTime` en su
propio hook, no aquí.

La caché refresca además al volver a la pestaña (`refetchOnWindowFocus`) y
siempre al recuperar la conexión (`refetchOnReconnect: "always"`), porque
mientras no había red el dato pudo quedarse atrás sin que nadie se enterara.

`src/utils/alert.constants.ts`

| Constante | Valor | Qué gobierna |
|---|---|---|
| `ALERT_DURATION` | 5 s | Cuánto dura un aviso flotante |

---

## Checklist de integración

- [ ] La ruta está en `ENDPOINTS`, no escrita en el servicio
- [ ] Hay un tipo para la respuesta del backend y otro para el dominio
- [ ] El mapper cubre también el alta, la edición y el detalle
- [ ] El servicio recibe el `HttpClient` por parámetro y no lleva `"use client"`
- [ ] Las claves de caché y las `queryOptions` están en el servicio
- [ ] La paginación por defecto es una constante compartida con la precarga
- [ ] El listado usa `placeholderData: keepPreviousData`
- [ ] Las mutaciones invalidan por prefijo (`lists()`), no la página actual
- [ ] Las que confirman algo llevan `meta: { alertOnSuccess: true }`
- [ ] Las que no deben avisar llevan `meta: { alertOnError: false }`, en vez de un try/catch
- [ ] La ruta llama a `await connection()` antes de precargar
- [ ] Los textos nuevos salen de `@/messages`

---

## Lo que falta

Cosas conocidas, para que no se descubran leyendo el código:

**El inquilino está fijo.** `categories.service.ts` tiene un `TENANT_ID`
constante. El backend lo espera en la query cuando la petición no lleva cuerpo
y dentro del cuerpo cuando sí lo lleva, y de eso se encargan `withTenantParam` y
`withTenantBody`. Cuando exista `useTenantId()` o su equivalente, el valor
entrará por parámetro o por el interceptor de cabeceras y esa constante
desaparece.

**`detail` y `remove` no tienen consumidores.** Están implementados y tipados,
pero ninguna pantalla los llama. El borrado de categorías tiene su diálogo
montado y la llamada comentada en `Categories.tsx`, con el `TODO` a la vista.

**Falta la capa de sesión.** `createHttpClient` está preparado para recibirla:
`AuthHttpClient` iría por fuera del decorador del sobre, porque este backend
puede anunciar un 401 dentro de un `200 OK` y una capa colocada por dentro no lo
vería. `LoggingHttpClient` iría por fuera de todo, que es el único punto que ve
tanto los fallos de red como los que lanza el sobre.

**El resto de módulos no está integrado.** `main-dashboard`, `cashier` y `login`
leen los datos de ejemplo de `src/lib/*.ts`, que están escritos con el mismo
shape que tendrá el servicio para que la sustitución sea un cambio de import.
`features/login/hooks/use-login.ts` está vacío.
