# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Comandos

Gestor de paquetes: **pnpm** (hay `pnpm-lock.yaml` y `pnpm-workspace.yaml`).

```bash
pnpm dev          # servidor de desarrollo (http://localhost:3000)
pnpm dev:debug    # dev con --turbopack --inspect
pnpm build        # build de producción
pnpm start        # sirve el build
pnpm lint         # eslint (flat config, eslint-config-next)
pnpm typecheck    # tsc --noEmit
```

No hay framework de pruebas instalado: no inventes un `pnpm test`. La
verificación disponible es `pnpm typecheck` + `pnpm lint`, y el tsconfig es
agresivo (`noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`,
`noUnusedLocals`, `noImplicitReturns`…), así que conviene pasarlo antes de dar
algo por terminado.

Variables de entorno: copia `.env.exam` a `.env`. `NEXT_PUBLIC_API_URL` es el
origen del backend; `API_INTERNAL_URL` solo servidor y solo en producción;
`NEXT_PUBLIC_PRODUCT_IMAGES_ORIGIN` es necesario para que Next optimice las
fotos remotas de producto (sin él, las tarjetas caen a las iniciales).

## Documentación propia

`docs/` es la fuente de verdad del sistema de diseño y hay que leerla antes de
escribir UI. Nada de `README.md` sueltos por carpetas.

| Documento | Qué responde |
|---|---|
| `docs/README.md` | El sistema en una página. Empieza aquí |
| `docs/architecture.md` | Cómo se organiza el código: rutas, features, qué va en cada carpeta |
| `docs/design-tokens.md` | Catálogo de valores: escala, espaciado, radios, tipografía, iconos, capas, movimiento |
| `docs/tailwind.md` | Cómo está montado Tailwind v4 (sin config JS) y por qué unos tokens viven en CSS y otros en TS |
| `docs/components.md` | Cómo se construye un componente con el sistema |
| `docs/messages.md` | Dónde vive cada texto de la interfaz |
| `docs/http.md` | Capa HTTP, servicios, caché de TanStack Query, avisos y la receta para integrar un endpoint |

## Arquitectura

### Rutas finas, features gordas

`src/app/` solo declara rutas: cada `page.tsx` exporta su `metadata` desde
`@/messages`, resuelve datos si hace falta y renderiza un componente de
`src/features/<módulo>/page*/`. La lógica no vive en `app/`.

Un feature se organiza en `components/` · `hooks/` · `interfaces/` (o `types/`)
· `services/` · `mappers/` · `libs/` · `utils/` · `style/` · `page/`. Los
módulos nuevos (`products`) siguen esa forma completa; `cashier` es más antiguo
(usa `pages/`, `types/`, `data/` y todavía no pasó por servicios HTTP).

Los datos de `src/lib/products.ts`, `ingredients.ts`, `recent-orders.ts`,
`top-products.ts` y `branch-sales.ts` son **mocks en memoria** pensados para
reemplazarse por servicios reales manteniendo el mismo shape. El único módulo
conectado al backend hoy es categorías de producto.

### Capa HTTP: decoradores sobre fetch

`src/lib/http/` es un cliente propio, no axios:

- `BaseHttpClient` — escribe los verbos una sola vez; **cada método devuelve el
  sobre completo**, no su `content`.
- `FetchHttpClient` — transporte. Timeouts con `AbortSignal.timeout`, query
  params serializados, y fallos traducidos a un `kind` (`network` · `timeout` ·
  `aborted` · `parse` · `response`).
- `EnvelopeHttpClient` — desenvuelve el protocolo del backend y convierte un
  `code` de fallo en un `HttpError` lanzado, incluso si llegó con HTTP 200.
- `src/lib/http/index.ts` es el **único punto de composición**:
  `createHttpClient()` apila los decoradores y exporta la instancia `httpClient`.
  Las capas nuevas (logging, auth) se enchufan ahí y en ningún otro sitio.

Todas las respuestas del backend viajan en un sobre (`{ code, status, message,
content, httpStatus }`). `API_NON_FAILURE_CODES`, en `src/utils/http.constants.ts`,
define qué códigos **no** son fallo: "sin resultados" es un 200 válido con
página vacía, no un error.

Cómo se consume el cliente:

- Server Component o Server Action → importa `httpClient` de `@/lib/http`.
- Componente o hook cliente → `useHttpClient()` de `@/context`, que permite
  inyectar un doble en pruebas. Nadie instancia un cliente por su cuenta.

Las rutas del backend salen siempre de `ENDPOINTS`
(`src/utils/endpoints.constants.ts`), nunca escritas a mano en un servicio.

### Servicios y estado de servidor

Un servicio (`features/*/services/*.service.ts`) recibe el `HttpClient` por
parámetro —así el mismo archivo sirve al servidor y al cliente, y no lleva
`"use client"`—, traduce con un mapper al modelo del dominio y exporta también
sus **claves de caché** (`categoryKeys`) y sus `queryOptions`, porque el Server
Component que precarga las necesita y no puede importar un módulo de cliente.

La política de TanStack Query está centralizada en `src/lib/query/query-client.ts`:
staleTime/gcTime, reintentos solo de errores recuperables (`isRetryableError`),
sin reintento en mutaciones, y **avisos automáticos**: el `QueryCache` y el
`MutationCache` enrutan los errores —y los éxitos marcados con
`meta.alertOnSuccess`— hacia `notifyApi` → `resolveApiAlert`
(`src/lib/http/api-alert.ts`) → `AlertToaster` (sonner). Para silenciar un aviso
se usa `meta: { alertOnError: false }` en la query o la mutación, no un
try/catch en la pantalla.

Los tiempos de HTTP viven en `utils/http.constants.ts` y los de caché en
`utils/query.constants.ts`, separados a propósito.

### Providers

`src/app/layout.tsx` monta `HttpClientProvider` → `QueryProvider` →
`SidebarLayoutProvider` → `AppShell`, más `AlertToaster`. Los providers traen su
propio valor por defecto en lugar de recibirlo por props: un layout es Server
Component y una instancia de clase no es serializable.

## Sistema de diseño (reglas duras)

Un solo vocabulario de tamaños `xs · sm · md · lg · xl · 2xl` con el mismo
significado en todos los componentes; el escalón por defecto es `md`.

```
src/style/style.css   →  VALORES (color, tipografía, radios, sombras).
                         Tailwind v4 genera una utilidad por token en @theme
src/tokens/           →  RECETAS (qué token usa cada componente), el espaciado
                         y los números que JavaScript necesita
src/messages/         →  TEXTOS de la interfaz, por módulo y tipados
```

Para decidir dónde va algo nuevo: **¿lo necesita JavaScript como número?** Si
no, va solo al CSS. Para leer un valor del CSS desde JS (canvas, Chart.js) está
`readCssVariable` de `@/lib/theme`, y solo en cliente.

1. **No inventes valores.** Si algo "necesita" 18px de separación, casi siempre
   le tocan 16 o 24. La escala está en `docs/design-tokens.md`.
2. **Las clases van en `<componente>.style.ts` con `cva`**, no dentro del
   `.tsx`: componente en `PascalCase.tsx`, estilos en `kebab-case.style.ts`.
3. **Las clases se escriben literales.** Tailwind escanea el fuente y no ve una
   clase construida con plantillas.
4. **El tamaño se lee de la receta**: `CONTROL_SIZE.md.heightClass`, no `"h-10"`.
5. **La tipografía es un token único.** `text-body-md` fija tamaño,
   interlineado, grosor y tracking a la vez.
6. **Los textos salen de `@/messages`** (`messages`, `formatMessage`,
   `formatPlural`), nunca escritos en el componente. `messages` es una
   constante, no un hook: vale igual en servidor y en cliente.

Los props de los componentes compartidos se declaran en
`src/interfaces/components/`, no en el `.tsx`, y el componente se exporta desde
`src/components/index.ts`. `ICON_TOKENS` solo registra iconos que representan un
concepto del producto; la gramática de un control —chevron, equis, palomita— se
importa directa de lucide.

`components.json` apunta shadcn a `src/style/style.css` y a `@/components/ui`,
pero el proyecto **traduce** lo que baja el CLI al sistema propio y lo mueve a
su familia (así entró `modals/`); si duplica algo que ya existe —un `button`— se
borra sin traducir. Queda muy poco en `src/components/ui/`.

## Convenciones del repo

- Imports con alias `@/*` → `src/*`.
- Barriles `index.ts` por carpeta (`@/tokens`, `@/messages`, `@/interfaces`,
  `@/utils`, `@/context`, `@/components`); importa desde el barril.
- El código y los comentarios están en español, y los comentarios explican **por
  qué** se tomó una decisión, no qué hace la línea. Sigue ese registro.
- React 19 con React Compiler activado (`reactCompiler: true` en
  `next.config.ts`): no añadas `useMemo`/`useCallback` decorativos, pero sí donde
  la identidad referencial es el objetivo (constantes como `NO_CATEGORIES`).
- Base UI (`@base-ui/react`) es la base de los primitivos accesibles;
  `framer-motion` para movimiento, `chart.js` para gráficos, `react-hook-form`
  para formularios y `react-number-format` para el `NumberField`.
