# Design tokens — referencia

Catálogo de todo lo que existe y cómo se llama. Para el porqué del reparto
entre CSS y TypeScript, ver [`tailwind.md`](./tailwind.md); para construir un
componente con esto, [`components.md`](./components.md).

Todo se importa desde `@/tokens`.

---

## 1. La escala

`src/tokens/scale.tokens.ts`

Seis escalones compartidos por espaciado, radios, iconos y componentes.

```ts
import { SIZE_SCALE, DEFAULT_SIZE, GRID_STEP, toRem } from "@/tokens";
import type { SizeToken, SizeMap } from "@/tokens";
```

| Export | Valor | Para qué |
|---|---|---|
| `SIZE_SCALE` | `["xs","sm","md","lg","xl","2xl"]` | Recorrer la escala o pintar un catálogo |
| `SizeToken` | Unión de los seis | Tipar una prop `size` |
| `SizeMap<T>` | `Record<SizeToken, T>` | Declarar un mapa completo sin olvidar escalones |
| `DEFAULT_SIZE` | `"md"` | El escalón por defecto de todo |
| `GRID_STEP` | `4` | Paso mínimo de la retícula |
| `REM_BASE` | `16` | Raíz tipográfica |
| `toRem(px)` | `12 → "0.75rem"` | Estilos en línea que no pasan por Tailwind |

`SizeMap` es la red de seguridad del sistema: un mapa declarado con
`satisfies SizeMap<T>` no compila si le falta un escalón.

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

Pares cercanos abajo, donde se separan elementos de un mismo grupo; saltos
amplios arriba, donde se separan bloques.

```ts
import { SPACING, SPACING_CLASS, SPACING_SEMANTIC } from "@/tokens";

SPACING.lg                 // 16   — el número, para cálculos en JS
SPACING_CLASS.gap.lg       // "gap-4"
SPACING_CLASS.paddingX.md  // "px-3"
SPACING_SEMANTIC.card      // "p-6"
```

`SPACING_CLASS` se agrupa por eje (`gap`, `padding`, `paddingX`, `paddingY`,
`stack`) porque así es como se consume dentro de un `cva`: se elige el eje y se
indexa por el `size` del componente.

**Alias de uso** — para las decisiones que se repiten en cada pantalla:

| Alias | Clase | Cuándo |
|---|---|---|
| `SPACING_SEMANTIC.inline` | `gap-2` | Entre un icono y su texto |
| `SPACING_SEMANTIC.field` | `space-y-4` | Entre campos de un formulario |
| `SPACING_SEMANTIC.card` | `p-6` | Relleno interior de tarjetas |
| `SPACING_SEMANTIC.section` | `gap-8` | Entre secciones de una página |

Si dos sitios usan el mismo escalón por motivos distintos, que cada uno entre
por su alias: el día que uno cambie, el otro no se arrastra.

Escribir `gap-4` a mano es igual de válido: es el mismo valor. Los mapas están
para cuando hay que indexar por `size`.

---

## 3. Radios

`src/tokens/radius.tokens.ts` — el nombre del token **es** el de la utilidad.

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
RADIUS_CLASS.lg        // "rounded-lg"
RADIUS_FULL_CLASS      // "rounded-full"
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

El radio comunica jerarquía: cuanto más grande la superficie, más redondeada.
Un control de 32px con radio de 18px parece un chip, no un botón.

---

## 4. Tipografía

`src/tokens/typography.tokens.ts` + el bloque `@theme` de `style.css`.

Familia: **Plus Jakarta Sans**, cargada en `app/layout.tsx` y expuesta como
`--font-sans`.

Cada estilo fija **tamaño, interlineado, grosor y tracking a la vez**. Son
inseparables: elegirlos por separado es de donde salen los textos que "no
terminan de cuadrar".

### Display — cifras protagonistas, estados vacíos

| Utilidad | Tamaño/Interlineado | Grosor | Tracking |
|---|---|---|---|
| `text-display-lg` | 48 / 56 | 700 | −0.02em |
| `text-display-md` | 40 / 48 | 700 | −0.02em |
| `text-display-sm` | 32 / 40 | 700 | −0.02em |

### Titulares — jerarquía de contenido

| Utilidad | Tamaño/Interlineado | Grosor | Tracking |
|---|---|---|---|
| `text-h1` | 36 / 44 | 700 | −0.02em |
| `text-h2` | 30 / 38 | 700 | −0.02em |
| `text-h3` | 24 / 32 | 600 | −0.01em |
| `text-h4` | 20 / 28 | 600 | −0.01em |
| `text-h5` | 18 / 26 | 600 | 0 |
| `text-h6` | 16 / 24 | 600 | 0 |

### Subtítulos — apoyo de un título, cabecera de tarjeta

| Utilidad | Tamaño/Interlineado | Grosor |
|---|---|---|
| `text-subtitle-lg` | 16 / 24 | 600 |
| `text-subtitle-md` | 14 / 22 | 600 |
| `text-subtitle-sm` | 13 / 20 | 600 |

### Cuerpo — párrafos y celdas de tabla

| Utilidad | Tamaño/Interlineado | Grosor |
|---|---|---|
| `text-body-lg` | 16 / 26 | 400 |
| `text-body-md` | 14 / 22 | 400 |
| `text-body-sm` | 13 / 20 | 400 |
| `text-body-xs` | 12 / 18 | 400 |

`text-body-md` es el estilo por defecto de la interfaz (`TYPOGRAPHY_DEFAULT`).

### Etiquetas — texto dentro de controles

| Utilidad | Tamaño/Interlineado | Grosor |
|---|---|---|
| `text-label-xl` | 18 / 24 | 500 |
| `text-label-lg` | 16 / 20 | 500 |
| `text-label-md` | 14 / 20 | 500 |
| `text-label-sm` | 12 / 16 | 500 |
| `text-label-xs` | 11 / 16 | 500 |

Interlineado corto a propósito: dentro de un control la altura la fija el
control, y un leading alto solo descuadra el centrado.

### Auxiliares

| Utilidad | Tamaño/Interlineado | Grosor | Notas |
|---|---|---|---|
| `text-caption` | 12 / 18 | 400 | Ayudas, metadatos, notas al pie |
| `text-overline` | 11 / 16 | 700 | Rótulos de sección. Va con `uppercase`, tracking 0.08em |
| `text-code` | 13 / 20 | 400 | SKU e identificadores. Va con `font-mono` |

### Criterios aplicados

- Interlineado apretado (≈1.2) en títulos, holgado (≈1.55) en párrafos.
- Tracking negativo solo por encima de 20px: a 36px las letras se ven separadas
  y hay que cerrarlas; a 14px pasa lo contrario.
- Todo interlineado es múltiplo de 2px, para no romper la retícula.

### Desde TypeScript

```ts
import { TYPOGRAPHY, FONT_WEIGHT_CLASS } from "@/tokens";

TYPOGRAPHY.h3          // "text-h3"
TYPOGRAPHY.bodyMd      // "text-body-md"
TYPOGRAPHY.overline    // "text-overline uppercase"
FONT_WEIGHT_CLASS.semibold  // "font-semibold" — solo para excepciones
```

`FONT_WEIGHT_CLASS` es para casos puntuales, como una celda que se pone en
semibold al destacarse. El grosor normal ya lo trae el estilo.

¿Necesitas el número (Chart.js, canvas)? `readCssVariable("--text-body-md")` de
`lib/theme.ts`, el mismo puente que se usa para los colores.

---

## 5. Color

`src/style/style.css`. No hay tokens de color en TypeScript: se consumen como
utilidades de Tailwind.

Cada familia semántica tiene cinco tonos — `lighter`, `light`, `main`, `dark`,
`darker`:

| Familia | Uso |
|---|---|
| `primary-*` | Acción principal, foco, selección |
| `secondary-*` | Acento secundario |
| `success-*` | Confirmaciones, estados sanos |
| `info-*` | Avisos neutros |
| `warning-*` | Atención sin bloqueo |
| `error-*` | Errores y acciones destructivas |

```tsx
<span className="bg-success-lighter text-success-dark">Disponible</span>
```

**Neutrales** — `white` y `neutral-50` … `neutral-900`. Los que más se repiten:

| Clase | Para |
|---|---|
| `text-neutral-800` | Texto principal |
| `text-neutral-600` | Texto secundario, placeholders |
| `text-neutral-500` | Iconos en reposo |
| `text-neutral-400` | Texto deshabilitado |
| `border-neutral-300` | Bordes de control |
| `border-neutral-200` | Separadores y bordes de superficie |
| `bg-neutral-100` | Fondo hundido, hover suave |
| `bg-neutral-200` | Relleno de superficie neutra |

---

## 6. Iconos

`src/tokens/icons.tokens.ts`

**Registro** — un único sitio donde se decide qué icono representa cada
concepto. Los componentes importan el token, no el icono de lucide: cambiar el
glifo de "productos" en toda la app es editar una línea.

```tsx
import { ICON_TOKENS } from "@/tokens";

<ICON_TOKENS.PRODUCTS size={16} strokeWidth={2} />
```

**Tamaños** — los iconos de lucide se dimensionan por prop numérica; la clase
equivalente es para cuando el icono va dentro de un contenedor estilado.

| Token | px | Clase |
|---|---|---|
| `xs` | 12 | `size-3` |
| `sm` | 14 | `size-3.5` |
| `md` | 16 | `size-4` |
| `lg` | 18 | `size-4.5` |
| `xl` | 20 | `size-5` |
| `2xl` | 24 | `size-6` |

> El icono **no** sigue la escala de espaciado: `size-md` existe y vale 12px,
> que no es el icono `md` (16px). Indexa `ICON_SIZE_CLASS`, no escribas
> `size-md` a mano.

**Trazo** — lucide dibuja a 2px. A tamaños pequeños el trazo grueso empasta el
glifo y a tamaños grandes se ve endeble, así que se compensa:

```ts
ICON_STROKE.light    // 1.5 — decorativos
ICON_STROKE.regular  // 2   — el de casi toda la interfaz
ICON_STROKE.bold     // 2.25 — iconos que cargan significado solos
ICON_STROKE_BY_SIZE.xl  // 1.5 — el recomendado para ese tamaño
```

---

## 7. Recetas de componente

`src/tokens/components.tokens.ts`

Aquí está la parte que el CSS no puede expresar: **qué token usa cada
componente en cada tamaño**. Son combinaciones cerradas — se eligen juntas
porque juntas funcionan.

### `CONTROL_SIZE` — botones, inputs, selectores, pestañas

| Token | Alto | Relleno | Separación | Icono | Radio | Texto |
|---|---|---|---|---|---|---|
| `xs` | `h-6` (24) | `px-2` | `gap-1` | 12 | `rounded-sm` | `text-label-xs` |
| `sm` | `h-8` (32) | `px-3` | `gap-2` | 14 | `rounded-md` | `text-label-sm` |
| `md` | `h-10` (40) | `px-4` | `gap-2` | 16 | `rounded-lg` | `text-label-md` |
| `lg` | `h-11` (44) | `px-4` | `gap-2` | 18 | `rounded-lg` | `text-label-lg` |
| `xl` | `h-12` (48) | `px-6` | `gap-3` | 20 | `rounded-xl` | `text-label-lg` |
| `2xl` | `h-14` (56) | `px-6` | `gap-3` | 24 | `rounded-xl` | `text-label-xl` |

Cuándo usar cada uno:

- **`xs`** densidades extremas: filtros de tabla, chips accionables
- **`sm`** acciones secundarias, barras de herramientas, paginación
- **`md`** el tamaño por defecto del panel
- **`lg`** objetivo táctil cómodo; acción principal de un formulario
- **`xl`** campos amplios y buscadores destacados
- **`2xl`** llamadas a la acción de página completa (onboarding, login)

Las alturas no salen de la escala de espaciado: son alturas de control, no
ritmo de layout. Todas son múltiplos de 4.

Campos de cada receta:

```ts
CONTROL_SIZE.md.height          // 40  — número, para anclajes y virtualización
CONTROL_SIZE.md.heightClass     // "h-10"
CONTROL_SIZE.md.squareClass     // "size-10" — modo solo icono
CONTROL_SIZE.md.paddingXClass   // "px-4"
CONTROL_SIZE.md.gapClass        // "gap-2"
CONTROL_SIZE.md.iconSize        // 16  — para la prop de lucide
CONTROL_SIZE.md.iconClass       // "size-4"
CONTROL_SIZE.md.radiusClass     // "rounded-lg"
CONTROL_SIZE.md.typographyClass // "text-label-md"
```

### `BADGE_SIZE` — insignias y etiquetas

| Token | Alto | Relleno | Icono | Radio | Texto |
|---|---|---|---|---|---|
| `xs` | `h-5` | `px-1` | 12 | `rounded-sm` | `text-label-xs` |
| `sm` | `h-6` | `px-2` | 12 | `rounded-sm` | `text-label-sm` |
| `md` | `h-7` | `px-2` | 14 | `rounded-md` | `text-label-sm` |
| `lg` | `h-8` | `px-3` | 16 | `rounded-md` | `text-label-md` |
| `xl` | `h-9` | `px-3` | 16 | `rounded-lg` | `text-label-md` |
| `2xl` | `h-10` | `px-4` | 18 | `rounded-lg` | `text-label-lg` |

La insignia es una etiqueta, no un control: va un par de escalones por debajo
del control al que acompaña para que no parezca pulsable.

### `AVATAR_SIZE` — avatares y miniaturas

| Token | Lado | Clase | Iniciales |
|---|---|---|---|
| `xs` | 24 | `size-6` | `text-label-xs` |
| `sm` | 32 | `size-8` | `text-label-sm` |
| `md` | 40 | `size-10` | `text-label-md` |
| `lg` | 48 | `size-12` | `text-label-md` |
| `xl` | 64 | `size-16` | `text-label-lg` |
| `2xl` | 80 | `size-20` | `text-label-xl` |

`AVATAR_SIZE.md.size` conserva el número porque lo piden `width` y `height` de
`next/image`.

### `SURFACE_SIZE` — tarjetas, paneles, popovers

| Token | Relleno | Separación | Radio |
|---|---|---|---|
| `xs` | `p-1` | `gap-1` | `rounded-md` |
| `sm` | `p-2` | `gap-2` | `rounded-md` |
| `md` | `p-3` | `gap-2` | `rounded-lg` |
| `lg` | `p-4` | `gap-3` | `rounded-xl` |
| `xl` | `p-6` | `gap-4` | `rounded-xl` |
| `2xl` | `p-8` | `gap-6` | `rounded-2xl` |

### `ROW_HEIGHT` — filas de tabla y lista

`32 · 40 · 48 · 56 · 64 · 72` px, con `ROW_HEIGHT_CLASS` como equivalente en
clases. El número se conserva porque lo pide cualquier virtualización.

### Tamaños por defecto

```ts
COMPONENT_DEFAULT_SIZE  // control "md", badge "sm", avatar "md",
                        // surface "xl", row "md"
```

---

## 8. Elevación y foco

`src/tokens/elevation.tokens.ts`

La sombra indica distancia respecto a la página. **Regla: las superficies
estáticas —tarjetas, tablas— se separan con borde, no con sombra.** La sombra
se reserva para lo que flota por encima del contenido.

| Token | Clase | Para |
|---|---|---|
| `ELEVATION.xs` | `shadow-xs` | Botones y campos en reposo |
| `ELEVATION.sm` | `shadow-sm` | Tarjetas que necesitan despegarse del fondo |
| `ELEVATION.md` | `shadow-md` | Hover de tarjeta interactiva |
| `ELEVATION.lg` | `shadow-lg` | Desplegables, popovers, menús |
| `ELEVATION.xl` | `shadow-xl` | Drawers y paneles laterales |
| `ELEVATION["2xl"]` | `shadow-2xl` | Modales a pantalla completa |
| `ELEVATION_NONE` | `shadow-none` | El estado de casi todo |

Cada entrada trae también `usage`, la frase de la tabla, por si hace falta
pintarla en un catálogo.

Las sombras van teñidas con el neutro de marca en vez de negro puro: sobre un
panel claro el negro ensucia y el gris azulado se integra.

### Anillo de foco

Único en toda la app. Es lo que hace navegable la interfaz con teclado y no
debe variar por componente.

```ts
FOCUS_RING.default  // anillo de 2px al 30% — para superficies claras
FOCUS_RING.offset   // contorno desplazado — controles sólidos donde el anillo se pierde
FOCUS_RING.invalid  // el mismo anillo en rojo
```

---

## 9. Layout

`src/tokens/layout.tokens.ts` — medidas del armazón. Este archivo sí guarda
números: son valores que JavaScript consume de verdad.

```ts
SIDEBAR.width        // 256  ·  widthClass "w-64"
SIDEBAR.railWidth    // 80   ·  railWidthClass "w-20"   (colapsado)
SIDEBAR.headerHeight // 64   ·  itemHeight 40
NAVBAR.height        // 64   ·  paddingXClass "px-4"
CONTENT.maxWidth     // 1440 ·  proseMaxWidth 720
CONTENT.gutter       // 24   ·  sectionGap 32
```

### Puntos de corte

`xs 480 · sm 640 · md 768 · lg 1024 · xl 1280 · 2xl 1536`

Los cinco grandes son los de Tailwind; `xs` está declarado en `@theme` y añade
la variante `xs:`. Existen en TS porque un `matchMedia` dentro de un hook
necesita el número — no hay forma de leer una media query desde una utilidad.

`DESKTOP_BREAKPOINT` (768) es el punto donde el sidebar deja de ser drawer.

### Capas

Una sola lista evita el clásico `z-[9999]` defensivo.

| Token | Valor | Qué |
|---|---|---|
| `base` | 0 | Contenido |
| `sticky` | 10 | Cabeceras de tabla, controles anclados en el contenido |
| `navbar` | 40 | Barra superior |
| `overlay` | 40 | Velo oscuro |
| `drawer` | 50 | Sidebar en móvil |
| `modal` | 60 | Diálogos |
| **`dropdown`** | **70** | Menús, selectores, popovers |
| `toast` | 80 | Notificaciones |
| `tooltip` | 90 | Siempre lo último |

> **Por qué `dropdown` está por encima de `modal`:** los popovers se montan en
> un portal, así que salen de su contenedor y compiten en la raíz con el
> chrome. Un selector abierto desde la barra superior —o desde dentro de un
> modal— tiene que taparlo, no esconderse debajo. Este orden se corrigió
> después de que el panel del combobox apareciera bajo el navbar.

`Z_INDEX_CLASS` da la utilidad equivalente (`"z-[70]"`).

---

## 10. Movimiento

`src/tokens/motion.tokens.ts`

Duraciones cortas: en un panel de trabajo la animación confirma que algo pasó,
no cuenta una historia. Por encima de 300ms la interfaz se siente lenta aunque
responda igual de rápido.

| Token | ms | Para |
|---|---|---|
| `instant` | 100 | Cambios de color |
| `fast` | 150 | Por defecto |
| `normal` | 200 | Desplegar, plegar, deslizar |
| `slow` | 300 | Entradas de panel y drawers |
| `slower` | 500 | Transiciones de página |

Curvas: `EASING.out` · `in` · `inOut` · `emphasized` (rebote sutil, declarada
en `@theme` como `--ease-emphasized`).

### Transiciones compuestas

Listas para pegar en un `cva`. Limitan la propiedad animada a propósito:
`transition-all` obliga al navegador a vigilar todo el estilo del elemento.

```ts
TRANSITION.colors     // hover y foco de cualquier control
TRANSITION.input      // color, fondo, borde y anillo a la vez
TRANSITION.opacity    // aparición y desaparición
TRANSITION.transform  // desplazamientos y cambios de tamaño
TRANSITION.elevation  // sombra al elevar una tarjeta
```

Todas incluyen `motion-reduce:transition-none`. **Todo lo que se mueva debe
respetar `prefers-reduced-motion`.**

Este es el único bloque que vive en los dos lados a la vez, y con motivo:
framer-motion necesita la duración como número y la curva como string de
cubic-bezier, cosas que no se pueden sacar de una clase.
