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
          └── AuthHttpClient   solo en el navegador: ante un 401 renueva la
              │                sesión y repite la petición una vez
              └── httpClient   la instancia compartida (lib/http/http-client.ts)
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
// Server Component o Server Action: uno por petición, con la sesión de quien
// pide la página. Va fuera del barril porque importa `next/headers`.
import { createServerHttpClient } from "@/lib/http/server-http-client";
const http = await createServerHttpClient();

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
`createHttpClient`, en `src/lib/http/http-client.ts`: ahí se apilan los
decoradores y ahí entraría el que falta (`LoggingHttpClient`).
`createServerHttpClient` no es otra composición: llama a la misma fábrica y solo
le añade la cookie de la visita. Ningún servicio ni pantalla toca la sesión; ver
[Sesión](#sesión).

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
    error.effectiveStatus  // el httpStatus del sobre, o el real si no hubo sobre
    error.code      // código de negocio del backend, o null
    error.apiMessage
    error.isUnauthorized
    error.isServerError
    error.hasStatusMismatch  // el sobre dice un código y la respuesta otro
}
```

### Dos estados en el mismo error

Una respuesta de este backend trae dos números que no siempre coinciden: el
estado HTTP que vio el navegador (`status`) y el `httpStatus` que el backend
declara dentro del sobre. Puede responder `200 OK` con un 401 dentro, o un 400
cuyo sobre dice 200.

| Navegador | Sobre | Qué es | Qué se hace |
|---|---|---|---|
| 200 | 200 y `code` de fallo | Fallo de negocio | Se avisa con el `message` |
| 400 | 400 | Error corriente | Se avisa con el `message` |
| 200 | 401 | El fallo va dentro de un 200 | Se clasifica como 401 y se calla |
| 400 | 200 | Los dos dicen cosas distintas | Se avisa con el `message` y se escribe en consola |
| 502 | Sin sobre | La página HTML de un proxy | `errors.unexpected` |

El criterio es que **manda el sobre**. Todo lo que decide qué aviso ve el
usuario, si se calla o qué texto lleva, pregunta a `effectiveStatus`, que es el
`httpStatus` del sobre y solo cae al del navegador cuando no llegó sobre.

Los reintentos son la excepción y siguen mirando `status`. Un 503 que llegó de
verdad es un servidor saturado; un 503 escrito dentro de un 200 es el backend
contestando, y repetir la petición no lo cambia.

Cuando los dos números no coinciden, `EnvelopeHttpClient` lo escribe en consola
(solo en desarrollo) con el método, la URL, los dos estados y el código:

```
[http] POST /categories llegó con HTTP 200 pero el sobre declara 400 (código 1923)
```

Es para llevárselo al backend con la petición exacta; al usuario no le cambia
nada.

Un 4xx o 5xx que sale del backend **sin cabeceras CORS** llega como `network`:
el navegador no deja leer el cuerpo, así que no hay sobre ni mensaje que
enseñar. Eso se arregla en el backend, no aquí.

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

## Sesión

La sesión vive en dos cookies HttpOnly que pone el backend al iniciar sesión y
que el panel nunca lee: `jwt_access`, que caduca en una hora, y `jwt_refresh`,
que dura una semana. El transporte las manda con `credentials: "include"`, así
que ningún servicio firma nada, y el backend saca de ellas el inquilino, así que
ningún servicio manda `tenantId`.

Lo que el panel sí guarda, en `localStorage` bajo `vorea-auth`, es el usuario y
las dos fechas de caducidad (`src/store/auth/auth.store.ts`). El usuario porque
el backend no tiene un "quién soy" y solo lo devuelve el login; las fechas para
saber cuándo renovar sin preguntar.

| Pieza | Dónde | Qué hace |
|---|---|---|
| Proxy | `src/proxy.ts` | Deja pasar con cualquiera de las dos cookies; sin ninguna, manda a `/login?from=<ruta>` |
| `useLogin` | `features/auth/hooks/` | Inicia sesión, guarda el usuario y entra a la ruta de `from` |
| Gestor de sesión | `src/lib/auth/session-manager.ts` | `refreshSession`, `closeSession` y `expireSession` |
| `AuthHttpClient` | `src/lib/http/` | Ante un 401, renueva y repite la petición una vez |
| `useSessionRefresh` | `features/auth/hooks/` | Renueva un minuto antes de que caduque el acceso |
| `useSessionSync` | `features/auth/hooks/` | Lleva los cambios de sesión de una pestaña a las demás |
| `createServerHttpClient` | `src/lib/http/server-http-client.ts` | Precarga en el servidor con la cookie de acceso |

### Entrar

`app/login/page.tsx` lee `from` en el servidor y lo pasa por
`resolvePostLoginHref` (`src/utils/session.utils.ts`), que solo acepta rutas
internas del panel: lo que empieza por `//` o `/\` el navegador lo lee como
otro origen, y un enlace a `/login?from=https://otro-sitio` no debe sacar a
nadie del panel. Lo demás cae a `DEFAULT_HOME_HREF`.

El formulario recorta empresa y usuario, nunca la contraseña, y se bloquea con
un candado propio mientras dura el envío, porque un doble clic llega antes de
que el botón se deshabilite y abriría dos sesiones. Cada intento abre un aviso
de carga que se convierte en el mensaje del backend o en el error.

### Renovar

Hay dos caminos, y los dos acaban en `refreshSession`:

- **El temporizador** de `useSessionRefresh`, un minuto antes de
  `accessExpiresAt`. Está apagado en `/login`: lo que haya guardado ahí es de
  una sesión anterior, y renovarla la resucitaría con el formulario en pantalla.
- **Un 401** en cualquier petición. `AuthHttpClient` va por fuera de
  `EnvelopeHttpClient` porque este backend puede anunciar el 401 dentro de un
  `200 OK`, y una capa colocada por dentro no lo vería. El login, el refresh y
  el logout llevan `skipAuthRefresh`, para que su propio 401 no intente renovar.

Renovar dos veces a la vez es peligroso: el backend rota `jwt_refresh` en cada
uso y revoca la sesión entera si recibe una ya gastada. Por eso hay tres
defensas: dentro de una pestaña se comparte la renovación en curso
(`pendingRefresh`); entre pestañas, un Web Lock las pone en fila para que la
segunda salga ya con la cookie nueva; y `useSessionSync` reprograma el
temporizador de las demás en cuanto una renueva.

Solo un 401 del refresh expulsa. Un timeout o un 503 son pasajeros: se ignoran
y lo vuelve a intentar la siguiente petición que reciba un 401.

### Salir

| | Cuándo | A dónde |
|---|---|---|
| `closeSession` | El usuario pulsa "Cerrar sesión" | `/login` |
| `expireSession` | El refresh da 401, o lo da una petición repetida con el token recién renovado, o hay cookies pero no usuario guardado | `/login?from=<ruta y query>` |

Las dos pasan siempre por `POST /auth/logout`, incluso con la sesión ya caída:
las cookies son HttpOnly y solo el backend puede borrarlas, y si `jwt_refresh`
se quedara, el proxy devolvería al panel a quien acaba de salir. Después vacían
el almacenamiento y navegan con una carga completa, no con el router, para
tirar la caché de TanStack Query y no enseñarle al siguiente usuario nada del
anterior. `closeSession` no recuerda la ruta porque quien entre después puede
ser otra persona.

`useSessionSync` escucha el evento `storage`, que solo llega a las pestañas que
no escribieron: si otra cerró sesión, ésta va al login; si otra la abrió
mientras ésta estaba en el login, ésta va al panel.

### En el servidor

`createServerHttpClient()` reenvía solo `jwt_access`. No renueva: rotaría
`jwt_refresh`, y un Server Component no puede devolverle la cookie nueva al
navegador, que se quedaría con una gastada. Si el acceso caducó, `prefetchQuery`
guarda el error en silencio, `dehydrate` no lo serializa y el navegador pide de
nuevo tras renovar.

Con `fetchQuery`, que sí lanza, un 401 hay que tratarlo a mano. Es el caso de
la edición de producto, que necesita el producto para responder 404: un 401 lo
deja "sin comprobar" y la pantalla va dentro de un `Suspense`, porque su
`useSuspenseQuery` intentaría pedirlo en el render del servidor con el mismo
acceso caducado y tumbaría la página entera.

### Requisito de despliegue

El proxy y la precarga ven la sesión porque el navegador manda las cookies del
backend también al panel. En local funciona porque los dos están en `localhost`
y las cookies no distinguen puertos. En producción, el backend tiene que
emitirlas para un dominio que comparta con el panel —`api.vorea.co` y
`app.vorea.co` con las cookies en `.vorea.co`—; si no, el proxy no verá nunca
la sesión y mandará al login aunque el usuario la tenga.

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

Lo que se calla en **toda** la aplicación no va en `meta` sino en dos listas de
`utils/http.constants.ts`, que consulta `isSilentError`:

- `HTTP_SILENT_STATUSES`, con el 401. Una sesión caducada no se arregla leyendo
  un aviso, y con la sesión caída fallan a la vez todas las consultas de la
  pantalla, cada una con su aviso repetido.
- `API_SILENT_CODES`, para códigos de negocio que la aplicación resuelve sola.

### Qué texto se muestra

Lo decide `resolveApiAlert`, y la regla es que **el backend gana cuando puede
explicarse**:

| Situación | Texto |
|---|---|
| Sobre con `message` no vacío y estado menor que 500 | El `message` del backend |
| Estado 5xx | `errors.unexpected` |
| `kind: "network"` | `errors.http.network` |
| `kind: "timeout"` | `errors.http.timeout` |
| `kind: "aborted"` | Ninguno: no se avisa de lo que se canceló |
| Estado en `HTTP_SILENT_STATUSES` (401) o código en `API_SILENT_CODES` | Ninguno: ver `isSilentError` |
| Cualquier otro caso | `errors.unexpected` |

El estado que se mira es `effectiveStatus`: el `httpStatus` del sobre si llegó,
y si no, el que vio el navegador. Manda el del sobre porque el backend puede
responder 200 y declarar el fallo dentro.

Un 400 o un 404 enseñan su `message` porque el backend ya lo redactó para el
usuario. El de un 5xx no se le enseña a nadie: suele ser el texto de una
excepción interna y queda en el error para quien mire el registro. El tono sale
del `status` del sobre con `ALERT_TONE_BY_API_STATUS`.

Cuando solo hace falta el texto, por ejemplo para avisar desde un `catch` de
una operación que no pasa por la caché:

```ts
import { getApiErrorMessage, isHttpError, isSilentError } from "@/lib/http";

catch (error: unknown) {
    if (isHttpError(error) && isSilentError(error)) return;

    notify.error(getApiErrorMessage(error));
}
```

La pregunta a `isSilentError` va primero porque `getApiErrorMessage` siempre
devuelve un texto: con un error silenciado daría `errors.unexpected`.

Con una mutación no hace falta nada de esto. La pantalla de categorías hace
`mutateAsync` dentro de un `try` y deja el `catch` vacío: el aviso ya lo pone
la caché, y el `catch` solo sirve para que el modal se quede abierto con lo que
se escribió.

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

Para algo que tarda, `notify.loading` abre un aviso con un círculo que gira, sin
caducidad ni equis, y quien lo abrió lo convierte en su resultado repitiendo el
`id` con otro tono:

```ts
const id = notify.loading("Guardando…");
notify.success("Guardado", { id });   // o notify.error(…, { id })
```

Un `id` nuevo por operación hace que los resultados de operaciones seguidas se
apilen; un `id` fijo los haría pisarse. Es lo que hace el login con cada intento.

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
                withListParams(params, config)
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
    const http = await createServerHttpClient();  // con la cookie de acceso

    await queryClient.prefetchQuery(
        categoriesQueryOptions(createCategoriesService(http))
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

await categories.update.mutateAsync({ params: toUpdateCategoryParams(values, target) });
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

### Scroll infinito: `useInfiniteQuery` + `useInfiniteScroll`

El catálogo de productos no lleva pie de páginas: carga tandas de 12
(`PRODUCTS_PAGE_SIZE`) según se baja. Las piezas:

- **`productsInfiniteQueryOptions`** (en el servicio) usa `infiniteQueryOptions`.
  La clave lleva solo los filtros, no la página; `getNextPageParam` pide la
  siguiente mientras `pageNumber * pageSize < total`. La ruta precarga la
  primera tanda con `prefetchInfiniteQuery` y la misma constante de filtros
  vacíos (`NO_PRODUCT_FILTERS`), por la misma razón que la paginación por
  defecto.
- **`useInfiniteScroll`** (`src/hooks/`) devuelve la ref de un centinela y pide
  más cuando entra en pantalla, con 400px de adelanto. Su `enabled` tiene que
  apagarse mientras la consulta no está en reposo (`fetchStatus !== "idle"`) y
  tras un fallo: lo primero hace que el observador vuelva a mirar al terminar
  (y siga cargando si la pantalla es alta), lo segundo evita un bucle de
  peticiones fallidas. Se mira `fetchStatus` y no `isFetchingNextPage` porque
  un reintento en pausa —pestaña oculta, sin conexión— deja este último en
  `false`.
- **`LoadMore`** (`@/components`) pinta el centinela y el pie: cuántos van,
  "Cargando más…" y, tras un fallo, "Volver a intentarlo". Cuando no quedan
  páginas el pie desaparece. Es la alternativa a `Pagination` y usa el mismo
  `itemLabel`.

Cambiar un filtro cambia la clave y la lista empieza de nuevo en la página 1
sin reinicios manuales; no hace falta `usePagination` ni `useClampedPage`.

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
| `HTTP_SILENT_STATUSES` | 401 | Estados que nunca muestran aviso |
| `API_SILENT_CODES` | vacía | Códigos de negocio que nunca muestran aviso |

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

**El backend no tiene un "quién soy".** El usuario solo llega en la respuesta
del login y se guarda en el almacenamiento. Si se pierde con las cookies todavía
vivas, no hay forma de recuperarlo y la sesión se da por caducada (ver
[Sesión](#sesión)). Cuando exista ese endpoint, conviene pedir el usuario en vez
de expulsar.

**`detail` y `remove` no tienen consumidores.** Están implementados y tipados,
pero ninguna pantalla los llama. El borrado de categorías tiene su diálogo
montado y la llamada comentada en `Categories.tsx`, con el `TODO` a la vista.

**Falta el registro de peticiones.** `LoggingHttpClient` iría por fuera de
todo, también de `AuthHttpClient`, porque es el único punto que ve tanto los
fallos de red como los que lanza el sobre.

**El resto de módulos no está integrado.** `main-dashboard` y `cashier` leen
los datos de ejemplo de `src/lib/*.ts`, que están escritos con el mismo shape
que tendrá el servicio para que la sustitución sea un cambio de import.
