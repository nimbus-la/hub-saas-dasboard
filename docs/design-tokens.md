# Design tokens

Catálogo de todo lo que existe y cómo se llama. Para entender el reparto entre
CSS y TypeScript, ver [`tailwind.md`](./tailwind.md); para construir un
componente con esto, [`components.md`](./components.md).

Todo se importa desde `@/tokens`.

**Los que se usan a diario** son siete: `CONTROL_SIZE`, `TYPOGRAPHY`,
`SPACING_CLASS`, `TRANSITION`, `RADIUS_SEMANTIC`, `FOCUS_RING` y
`ICON_STROKE_BY_SIZE`. El resto del catálogo aparece con menos frecuencia, y
algunos existen sin usarse todavía; cuando es el caso, está anotado.

---

## 1. La escala

`src/tokens/scale.tokens.ts`

Seis escalones compartidos por espaciado, radios, iconos y componentes.

```ts
import { SIZE_SCALE, DEFAULT_SIZE, GRID_STEP, REM_BASE, toRem } from "@/tokens";
import type { SizeToken, SizeMap } from "@/tokens";
```

| Export | Valor | Para qué |
|---|---|---|
| `SIZE_SCALE` | `["xs","sm","md","lg","xl","2xl"]` | Recorrer la escala o pintar un catálogo |
| `SizeToken` | Unión de los seis nombres | Tipar una prop `size` |
| `SizeMap<T>` | `Record<SizeToken, T>` | Declarar un mapa completo sin olvidar escalones |
| `DEFAULT_SIZE` | `"md"` | El escalón por defecto de todo |
| `GRID_STEP` | `4` | Paso mínimo de la retícula |
| `REM_BASE` | `16` | Raíz tipográfica del navegador |
| `toRem(px)` | `12 → "0.75rem"` | Estilos en línea que no pasan por Tailwind |

`SizeMap` es lo que impide que un mapa quede incompleto: declarado con
`satisfies SizeMap<T>`, no compila si le falta un escalón.

`SIZE_SCALE`, `GRID_STEP` y `toRem` todavía no tienen ningún consumidor. Están
para el día que haya un catálogo de componentes o un estilo en línea que no
pase por Tailwind.

---

## 2. Espaciado

`src/tokens/spacing.tokens.ts` — retícula de 4px.

| Token | px | Utilidad |
|---|---|---|
| `xs` | 4 | `gap-1` `p-1` `px-1` |
| `sm` | 8 | `gap-2` `p-2` `px-2` |
| `md` | 12 | `gap-3` `p-3` `px-3` |
| `lg` | 16 | `gap-4` `p-4` `px-4` |
| `xl` | 24 | `gap-6` `p-6` `px-6` |
| `2xl` | 32 | `gap-8` `p-8` `px-8` |

La escala salta 4-8-12-16-24-32: pasos cortos en la parte baja, que es donde se
separan elementos de un mismo grupo, y saltos amplios arriba, donde se separan
bloques.

```ts
import { SPACING, SPACING_CLASS, SPACING_SEMANTIC } from "@/tokens";

SPACING.lg                 // 16, el número, para cálculos en JS
SPACING_CLASS.gap.lg       // "gap-4"
SPACING_CLASS.paddingX.md  // "px-3"
SPACING_SEMANTIC.card      // "p-6"
```

`SPACING_CLASS` está agrupado por eje (`gap`, `padding`, `paddingX`,
`paddingY`, `stack`) porque así se consume dentro de un `cva`: se elige el eje
y se indexa por el `size` del componente.

**Alias de uso**, para las decisiones que se repiten en cada pantalla:

| Alias | Clase | Cuándo |
|---|---|---|
| `SPACING_SEMANTIC.inline` | `gap-2` | Entre un icono y su texto |
| `SPACING_SEMANTIC.field` | `space-y-4` | Entre campos de un formulario |
| `SPACING_SEMANTIC.card` | `p-6` | Relleno interior de tarjetas |
| `SPACING_SEMANTIC.section` | `gap-8` | Entre secciones de una página |

Cuando dos sitios usan el mismo escalón por motivos distintos, conviene que
cada uno entre por su alias. Así, si mañana uno cambia, el otro no cambia con
él.

Escribir `gap-4` a mano también es válido: es exactamente el mismo valor. Los
mapas están para cuando hay que indexar por `size`.

---

## 3. Radios

`src/tokens/radius.tokens.ts` — el nombre del token es el mismo que el de la
utilidad.

| Token | px | Utilidad |
|---|---|---|
| `xs` | 4 | `rounded-xs` |
| `sm` | 6 | `rounded-sm` |
| `md` | 8 | `rounded-md` |
| `lg` | 10 | `rounded-lg` |
| `xl` | 14 | `rounded-xl` |
| `2xl` | 18 | `rounded-2xl` |
| — | 9999 | `rounded-full` |

```ts
RADIUS_CLASS.lg         // "rounded-lg"
RADIUS_FULL_CLASS       // "rounded-full"
RADIUS_SEMANTIC.control // "rounded-lg"
```

**Por uso**, que es como se decide en la práctica:

| Alias | Radio | Para |
|---|---|---|
| `badge` | `rounded-md` | Insignias, tags, contadores |
| `control` | `rounded-lg` | Botones e inputs |
| `surface` | `rounded-xl` | Tarjetas, paneles, celdas |
| `overlay` | `rounded-2xl` | Modales, drawers |
| `pill` | `rounded-full` | Avatares, botones circulares |

El radio comunica jerarquía: cuanto mayor es la superficie, más redondeada. Un
control de 32px con radio de 18px se lee como un chip, no como un botón.

---

## 4. Tipografía

`src/tokens/typography.tokens.ts` y el bloque `@theme` de `style.css`.

Familia: **Plus Jakarta Sans**, cargada en `app/layout.tsx` y expuesta como
`--font-sans`.

Cada estilo fija **tamaño, interlineado, grosor y tracking a la vez**, porque
las cuatro propiedades dependen entre sí. Elegirlas por separado es lo que
produce textos que no acaban de encajar con el resto.

### Display, para cifras protagonistas y estados vacíos

| Utilidad | Tamaño/Interlineado | Grosor | Tracking |
|---|---|---|---|
| `text-display-lg` | 48 / 56 | 700 | −0.02em |
| `text-display-md` | 40 / 48 | 700 | −0.02em |
| `text-display-sm` | 32 / 40 | 700 | −0.02em |

### Titulares, para la jerarquía de contenido

| Utilidad | Tamaño/Interlineado | Grosor | Tracking |
|---|---|---|---|
| `text-h1` | 36 / 44 | 700 | −0.02em |
| `text-h2` | 30 / 38 | 700 | −0.02em |
| `text-h3` | 24 / 32 | 600 | −0.01em |
| `text-h4` | 20 / 28 | 600 | −0.01em |
| `text-h5` | 18 / 26 | 600 | 0 |
| `text-h6` | 16 / 24 | 600 | 0 |

### Subtítulos, para apoyar un título o encabezar una tarjeta

| Utilidad | Tamaño/Interlineado | Grosor |
|---|---|---|
| `text-subtitle-lg` | 16 / 24 | 600 |
| `text-subtitle-md` | 14 / 22 | 600 |
| `text-subtitle-sm` | 13 / 20 | 600 |

### Cuerpo, para párrafos y celdas de tabla

| Utilidad | Tamaño/Interlineado | Grosor |
|---|---|---|
| `text-body-lg` | 16 / 26 | 400 |
| `text-body-md` | 14 / 22 | 400 |
| `text-body-sm` | 13 / 20 | 400 |
| `text-body-xs` | 12 / 18 | 400 |

`text-body-md` es el estilo por defecto de la interfaz (`TYPOGRAPHY_DEFAULT`).

### Etiquetas, para el texto dentro de controles

| Utilidad | Tamaño/Interlineado | Grosor |
|---|---|---|
| `text-label-xl` | 18 / 24 | 500 |
| `text-label-lg` | 16 / 20 | 500 |
| `text-label-md` | 14 / 20 | 500 |
| `text-label-sm` | 12 / 16 | 500 |
| `text-label-xs` | 11 / 16 | 500 |

El interlineado es corto a propósito: dentro de un control la altura la fija el
propio control, y un interlineado alto descuadra el centrado vertical.

### Auxiliares

| Utilidad | Tamaño/Interlineado | Grosor | Notas |
|---|---|---|---|
| `text-caption` | 12 / 18 | 400 | Ayudas, metadatos, notas al pie |
| `text-overline` | 11 / 16 | 700 | Rótulos de sección. Va con `uppercase` y tracking 0.08em |
| `text-code` | 13 / 20 | 400 | SKU e identificadores. Va con `font-mono` |

### Criterios de la rampa

- Interlineado ajustado (≈1.2) en títulos y holgado (≈1.55) en párrafos.
- Tracking negativo solo por encima de 20px. A 36px las letras se ven
  separadas y hay que cerrarlas; a 14px ocurre lo contrario.
- Todos los interlineados son múltiplos de 2px, para no romper la retícula.

### Desde TypeScript

```ts
import { TYPOGRAPHY, FONT_WEIGHT_CLASS } from "@/tokens";

TYPOGRAPHY.h3               // "text-h3"
TYPOGRAPHY.bodyMd           // "text-body-md"
TYPOGRAPHY.overline         // "text-overline uppercase"
FONT_WEIGHT_CLASS.semibold  // "font-semibold"
```

`FONT_WEIGHT_CLASS` es para casos puntuales, como una celda que pasa a semibold
al destacarse. El grosor habitual ya viene en el estilo.

Si necesitas el número (Chart.js, canvas), está
`readCssVariable("--text-body-md")` en `lib/theme.ts`, el mismo puente que se
usa para los colores.

---

## 5. Color

`src/style/style.css`. No hay tokens de color en TypeScript: se consumen como
utilidades de Tailwind.

Cada familia semántica tiene cinco tonos: `lighter`, `light`, `main`, `dark` y
`darker`.

| Familia | Uso |
|---|---|
| `primary-*` | Acción principal, foco, selección |
| `secondary-*` | Acento secundario |
| `success-*` | Confirmaciones y estados sanos |
| `info-*` | Avisos neutros |
| `warning-*` | Atención sin bloqueo |
| `error-*` | Errores y acciones destructivas |

```tsx
<span className="bg-success-lighter text-success-dark">Disponible</span>
```

**Neutrales**: `white` y `neutral-50` … `neutral-900`. Los más frecuentes:

| Clase | Para |
|---|---|
| `text-neutral-800` | Texto principal |
| `text-neutral-600` | Texto secundario y placeholders |
| `text-neutral-500` | Iconos en reposo |
| `text-neutral-400` | Texto deshabilitado |
| `border-neutral-300` | Bordes de control |
| `border-neutral-200` | Separadores y bordes de superficie |
| `bg-neutral-100` | Fondo hundido, hover suave |
| `bg-neutral-200` | Relleno de superficie neutra |

Sobre un fondo tintado, el texto va en `-darker`. Es una cuestión de contraste
medido: `-dark` sobre el `-lighter` de su propia familia se queda en 3,7:1 con
el verde y el ámbar, y un párrafo necesita 4,5:1. En `-darker`, la peor pareja
de las cinco familias da 6,9:1.

---

## 6. Iconos

`src/tokens/icons.tokens.ts`

**Registro**: un único sitio donde se decide qué icono representa cada
concepto. Los componentes importan el token, no el icono de lucide, así que
cambiar el glifo de "productos" en toda la aplicación es editar una línea.

```tsx
import { ICON_TOKENS } from "@/tokens";

<ICON_TOKENS.PRODUCTS size={16} strokeWidth={2} />
```

**Tamaños**: los iconos de lucide se dimensionan con una prop numérica. La
clase equivalente es para cuando el icono va dentro de un contenedor estilado.

| Token | px | Clase |
|---|---|---|
| `xs` | 12 | `size-3` |
| `sm` | 14 | `size-3.5` |
| `md` | 16 | `size-4` |
| `lg` | 18 | `size-4.5` |
| `xl` | 20 | `size-5` |
| `2xl` | 24 | `size-6` |

> El icono no sigue la escala de espaciado. `size-md` existe y vale 12px, que
> no es el icono `md` (16px). Indexa `ICON_SIZE_CLASS` en lugar de escribir
> `size-md` a mano.

En la práctica, `ICON_SIZE_CLASS` se consume a través de las recetas de
`components.tokens.ts`, que ya emparejan cada tamaño de control con el suyo.
Casi nunca hace falta indexarlo directamente.

**Trazo**: lucide dibuja a 2px. En tamaños pequeños un trazo grueso empasta el
glifo, y en tamaños grandes se ve débil, así que se compensa.

```ts
ICON_STROKE.light       // 1.5, iconos decorativos
ICON_STROKE.regular     // 2, el de casi toda la interfaz
ICON_STROKE.bold        // 2.25, iconos que cargan significado por sí solos
ICON_STROKE_BY_SIZE.xl  // 1.5, el recomendado para ese tamaño
```

---

## 7. Recetas de componente

`src/tokens/components.tokens.ts`

Aquí está la parte del sistema que el CSS no puede expresar: **qué token usa
cada componente en cada tamaño**. Son combinaciones cerradas, elegidas juntas
porque funcionan juntas.

### `CONTROL_SIZE`, para botones, inputs, selectores y pestañas

| Token | Alto | Relleno | Separación | Icono | Radio | Texto |
|---|---|---|---|---|---|---|
| `xs` | `h-6` (24) | `px-2` | `gap-1` | 12 | `rounded-sm` | `text-label-xs` |
| `sm` | `h-8` (32) | `px-3` | `gap-2` | 14 | `rounded-md` | `text-label-sm` |
| `md` | `h-10` (40) | `px-4` | `gap-2` | 16 | `rounded-lg` | `text-label-md` |
| `lg` | `h-11` (44) | `px-4` | `gap-2` | 18 | `rounded-lg` | `text-label-lg` |
| `xl` | `h-12` (48) | `px-6` | `gap-3` | 20 | `rounded-xl` | `text-label-lg` |
| `2xl` | `h-14` (56) | `px-6` | `gap-3` | 24 | `rounded-xl` | `text-label-xl` |

Cuándo usar cada uno:

- **`xs`**: densidades altas, como filtros de tabla o chips accionables.
- **`sm`**: acciones secundarias, barras de herramientas, paginación.
- **`md`**: el tamaño por defecto del panel.
- **`lg`**: objetivo táctil cómodo; acción principal de un formulario.
- **`xl`**: campos amplios y buscadores destacados.
- **`2xl`**: llamadas a la acción de página completa, como onboarding o login.

Las alturas no salen de la escala de espaciado: son alturas de control, no
ritmo de layout. Todas son múltiplos de 4.

Campos de cada receta:

```ts
CONTROL_SIZE.md.height          // 40, para anclajes y virtualización
CONTROL_SIZE.md.heightClass     // "h-10"
CONTROL_SIZE.md.squareClass     // "size-10", para el modo solo icono
CONTROL_SIZE.md.paddingXClass   // "px-4"
CONTROL_SIZE.md.gapClass        // "gap-2"
CONTROL_SIZE.md.iconSize        // 16, para la prop de lucide
CONTROL_SIZE.md.iconClass       // "size-4"
CONTROL_SIZE.md.radiusClass     // "rounded-lg"
CONTROL_SIZE.md.typographyClass // "text-label-md"
```

### `BADGE_SIZE`, para insignias y etiquetas

| Token | Alto | Relleno | Icono | Radio | Texto |
|---|---|---|---|---|---|
| `xs` | `h-5` | `px-1` | 12 | `rounded-sm` | `text-label-xs` |
| `sm` | `h-6` | `px-2` | 12 | `rounded-sm` | `text-label-sm` |
| `md` | `h-7` | `px-2` | 14 | `rounded-md` | `text-label-sm` |
| `lg` | `h-8` | `px-3` | 16 | `rounded-md` | `text-label-md` |
| `xl` | `h-9` | `px-3` | 16 | `rounded-lg` | `text-label-md` |
| `2xl` | `h-10` | `px-4` | 18 | `rounded-lg` | `text-label-lg` |

Una insignia es una etiqueta, no un control: va un par de escalones por debajo
del control al que acompaña para que no parezca pulsable.

### `AVATAR_SIZE`, para avatares y miniaturas

| Token | Lado | Clase | Iniciales | Radio en `square` |
|---|---|---|---|---|
| `xs` | 24 | `size-6` | `text-label-xs` | `rounded-sm` |
| `sm` | 32 | `size-8` | `text-label-sm` | `rounded-sm` |
| `md` | 40 | `size-10` | `text-label-md` | `rounded-md` |
| `lg` | 48 | `size-12` | `text-label-md` | `rounded-md` |
| `xl` | 64 | `size-16` | `text-label-lg` | `rounded-lg` |
| `2xl` | 80 | `size-20` | `text-label-xl` | `rounded-lg` |

`AVATAR_SIZE.md.size` conserva el número porque lo piden los atributos `width`
y `height` de `next/image`.

El `Avatar` tiene dos formas, con la prop `shape`. `circle` es para personas y
`square` para cosas, como la miniatura de un producto o de un insumo. La forma
se declara solo en la raíz; la imagen, las iniciales y el borde la heredan con
la utilidad propia `rounded-inherit`.

```tsx
<Avatar size="md" shape="square">
    <AvatarFallback>QC</AvatarFallback>
</Avatar>
```

### `SURFACE_SIZE`, para tarjetas, paneles y popovers

| Token | Relleno | Separación | Radio |
|---|---|---|---|
| `xs` | `p-1` | `gap-1` | `rounded-md` |
| `sm` | `p-2` | `gap-2` | `rounded-md` |
| `md` | `p-3` | `gap-2` | `rounded-lg` |
| `lg` | `p-4` | `gap-3` | `rounded-xl` |
| `xl` | `p-6` | `gap-4` | `rounded-xl` |
| `2xl` | `p-8` | `gap-6` | `rounded-2xl` |

### `ROW_HEIGHT`, para filas de tabla y lista

`32`, `40`, `48`, `56`, `64` y `72` px, con `ROW_HEIGHT_CLASS` como equivalente
en clases. El número se conserva porque lo necesita cualquier virtualización,
aunque hoy solo lo consume `DataTable`.

### Tamaños por defecto

```ts
COMPONENT_DEFAULT_SIZE  // control "md", badge "sm", avatar "md",
                        // surface "xl", row "md"
```

---

## 8. Elevación y foco

`src/tokens/elevation.tokens.ts`

La sombra indica distancia respecto a la página. **Las superficies estáticas
(tarjetas, tablas) se separan con borde, no con sombra**; la sombra se reserva
para lo que flota por encima del contenido.

| Token | Clase | Para |
|---|---|---|
| `ELEVATION.xs` | `shadow-xs` | Botones y campos en reposo |
| `ELEVATION.sm` | `shadow-sm` | Tarjetas que necesitan despegarse del fondo |
| `ELEVATION.md` | `shadow-md` | Hover de tarjeta interactiva |
| `ELEVATION.lg` | `shadow-lg` | Desplegables, popovers y menús |
| `ELEVATION.xl` | `shadow-xl` | Drawers y paneles laterales |
| `ELEVATION["2xl"]` | `shadow-2xl` | Modales a pantalla completa |
| `ELEVATION_NONE` | `shadow-none` | El estado de casi todo |

Cada entrada incluye también `usage`, la frase de esta tabla, por si hace falta
mostrarla en un catálogo.

Las sombras están teñidas con el neutro de marca en lugar de negro puro: sobre
un panel claro el negro se ve sucio y el gris azulado se integra mejor.

### Anillo de foco

Es el mismo en toda la aplicación: igual grosor, color y desplazamiento en
cualquier control. Es lo que permite navegar con teclado, así que no debería
variar por componente.

```ts
FOCUS_RING.default  // anillo de 2px al 30%, para superficies claras
FOCUS_RING.offset   // contorno desplazado, para controles sólidos
FOCUS_RING.invalid  // el mismo anillo en rojo
```

---

## 9. Layout

`src/tokens/layout.tokens.ts` — medidas del armazón. Este archivo guarda
números porque son valores que JavaScript puede necesitar: cálculos de
desplazamiento, media queries y orden de capas.

```ts
SIDEBAR.width        // 256   widthClass "w-64"
SIDEBAR.railWidth    // 80    railWidthClass "w-20"  (colapsado)
SIDEBAR.headerHeight // 64    itemHeight 40
NAVBAR.height        // 64    paddingXClass "px-4"
CONTENT.maxWidth     // 1440  proseMaxWidth 720
CONTENT.gutter       // 24    sectionGap 32
```

`SIDEBAR` y `NAVBAR` los consumen los estilos de esas dos familias.
`CONTENT` todavía no tiene consumidores: las pantallas fijan su ancho por su
cuenta.

### Puntos de corte

`xs 480`, `sm 640`, `md 768`, `lg 1024`, `xl 1280`, `2xl 1536`.

Los cinco grandes son los de Tailwind. `xs` está declarado en `@theme` y añade
la variante `xs:`. `DESKTOP_BREAKPOINT` (768) marca el punto donde el sidebar
deja de ser drawer.

**Hoy nadie lee estas constantes.** El único sitio que necesita el número es
`SidebarLayoutContext.tsx`, y tiene su propia cadena escrita a mano:

```ts
const DESKTOP_MEDIA_QUERY = "(min-width: 768px)";
```

Son dos fuentes para el mismo valor. Si se toca `DESKTOP_BREAKPOINT`, el
sidebar seguirá cambiando a 768px hasta que ese archivo lea el token.

### Capas

Una sola lista evita el `z-[9999]` defensivo que aparece cuando cada
componente decide por su cuenta.

| Token | Valor | Qué |
|---|---|---|
| `base` | 0 | Contenido |
| `sticky` | 10 | Cabeceras de tabla y controles anclados en el contenido |
| `navbar` | 40 | Barra superior |
| `overlay` | 40 | Velo oscuro |
| `drawer` | 50 | Sidebar en móvil |
| `modal` | 60 | Diálogos |
| **`dropdown`** | **70** | Menús, selectores y popovers |
| `toast` | 80 | Notificaciones |
| `tooltip` | 90 | Siempre lo último |

`dropdown` está por encima de `modal` a propósito. Los popovers se montan en un
portal, así que salen de su contenedor y compiten en la raíz con el resto del
armazón: un selector abierto desde la barra superior, o desde dentro de un
modal, tiene que quedar por encima. Este orden se corrigió cuando el panel del
combobox apareció por debajo del navbar.

`Z_INDEX_CLASS` da la utilidad equivalente (`"z-[70]"`).

---

## 10. Movimiento

`src/tokens/motion.tokens.ts`

Las duraciones son cortas porque en un panel de trabajo la animación solo
confirma que algo pasó. Por encima de 300ms la interfaz se siente lenta aunque
responda igual de rápido.

| Token | ms | Para |
|---|---|---|
| `instant` | 100 | Cambios de color |
| `fast` | 150 | El valor por defecto |
| `normal` | 200 | Desplegar, plegar, deslizar |
| `slow` | 300 | Entradas de panel y drawers |
| `slower` | 500 | Transiciones de página |

Curvas disponibles: `EASING.out`, `in`, `inOut` y `emphasized`, esta última con
un rebote sutil y declarada en `@theme` como `--ease-emphasized`. Ni `EASING` ni
`EASING_CLASS` tienen consumidores todavía: las transiciones compuestas ya
traen su curva incluida.

### Transiciones compuestas

Listas para usar dentro de un `cva`. Limitan la propiedad animada a propósito,
porque `transition-all` obliga al navegador a vigilar todo el estilo del
elemento.

```ts
TRANSITION.colors     // hover y foco de cualquier control
TRANSITION.input      // color, fondo, borde y anillo a la vez
TRANSITION.opacity    // aparición y desaparición
TRANSITION.transform  // desplazamientos y cambios de tamaño
TRANSITION.elevation  // sombra al elevar una tarjeta
```

Todas incluyen `motion-reduce:transition-none`. **Todo lo que se mueva tiene
que respetar `prefers-reduced-motion`.**

### Animaciones con nombre

Se declaran en `@theme` como `--animate-*`, con sus `@keyframes` dentro del
mismo bloque:

| Utilidad | Qué hace | Duración |
|---|---|---|
| `animate-countdown` | Barra que se vacía de izquierda a derecha | La pone quien la usa |

`animation-paused`, una utilidad propia, la congela en el fotograma actual.
`data-paused:animation-paused` es como la usa el aviso cuando el puntero se
posa encima.

Es la única animación cuya duración no está en el token, y es intencional: el
tiempo que un aviso permanece visible es una decisión de producto que llega
como número en ejecución (`ALERT_DURATION`, 5 segundos). Cuánto se deja algo a
la vista no es lo mismo que cuánto tarda en moverse, y por eso no aparece en la
tabla de arriba, donde el escalón más largo son 500ms.

Este es el único grupo de tokens que vive en CSS y en TypeScript a la vez.
framer-motion necesita la duración como número y la curva como cadena
`cubic-bezier`, y ninguna de las dos se puede extraer de una clase de Tailwind.
