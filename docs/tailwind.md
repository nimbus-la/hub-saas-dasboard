# Tailwind en este proyecto

Cómo está configurado, qué tokens viven en CSS y cuáles en TypeScript, y los
errores que ya se cometieron una vez. Para el catálogo de valores, ver
[`design-tokens.md`](./design-tokens.md).

Versión: **Tailwind CSS v4**. No hay `tailwind.config.js`: la configuración es
CSS.

---

## Dónde está la configuración

Todo en `src/style/style.css`:

```css
@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/tailwind.css";

@theme {
    /* colores de marca, tipografía, sombras, curva propia, breakpoint xs */
}

@theme inline {
    /* radios y los alias heredados de shadcn */
}

:root  { /* variables heredadas de shadcn */ }
.dark  { /* las mismas en oscuro, sin uso hoy */ }

@layer base { /* reset del proyecto */ }
```

En v4 no hay archivo de configuración: **declarar una variable en `@theme` crea
la utilidad**. `--text-body-md: 14px` genera la clase `text-body-md`, y
`--shadow-lg: …` genera `shadow-lg`.

---

## El reparto entre CSS y TypeScript

| Vive en | Qué | Por qué |
|---|---|---|
| **`style.css`** (`@theme`) | Color, tipografía, radios, sombras | Solo sirven para pintar, y Tailwind ya genera la utilidad |
| **`src/tokens/`** | Recetas de componente, espaciado y los números que consume JS | Un `cva` no puede leer CSS, y `matchMedia`, el `size={16}` de lucide o framer-motion necesitan el número |

La pregunta para decidir: **¿TypeScript necesita el número?** Si no, va solo al
CSS. Si te encuentras copiando un valor del CSS a un `.ts`, lo que falta casi
siempre es una utilidad con nombre.

**Por qué no todo en CSS.** Hay cosas que el CSS no puede expresar. Que un botón
`md` mida 40px es un valor; que un botón `md` use ese alto **con** ese radio
**y** esa tipografía es una decisión, y eso vive en `CONTROL_SIZE`.

**Por qué no todo en TypeScript.** Porque duplicaría lo que Tailwind ya hace, y
porque `text-body-md` en el JSX se lee mejor que un `TYPOGRAPHY.bodyMd`
importado.

### Leer un valor del CSS desde JavaScript

Para canvas o Chart.js, que no entienden clases:

```ts
import { readCssVariable } from "@/lib/theme";

const color = readCssVariable("--color-primary-main", "#7635DC");
const size  = readCssVariable("--text-body-md", "14px");
```

Solo funciona en cliente, porque usa `getComputedStyle`. Va dentro de un efecto
o de un manejador; llamarla durante el render rompería la hidratación.

---

## Namespaces de `@theme` que usa el proyecto

| Namespace | Genera | Entradas |
|---|---|---|
| `--color-*` | `bg-*` `text-*` `border-*` `ring-*` | 41 de marca, más 31 alias heredados de shadcn |
| `--text-*` | `text-*` (tamaño, interlineado, grosor y tracking) | 24 estilos |
| `--radius-*` | `rounded-*` | 6 |
| `--shadow-*` | `shadow-*` | 6 |
| `--ease-*` | `ease-*` | 1 (`emphasized`) |
| `--animate-*` | `animate-*` | 1 (`countdown`) |
| `--breakpoint-*` | variantes `xs:` … | 1 (`xs`) |
| `--font-*` | `font-sans`, `font-heading` | 2 |

Los 41 colores de marca son las seis familias semánticas por cinco tonos, más
`white` y los diez neutros. Los 31 restantes (`--color-card`,
`--color-popover`, `--color-sidebar-*`, `--color-chart-*`) son alias del bloque
heredado que se explica al final de este documento; ningún componente del
sistema los usa.

### Un estilo tipográfico completo

Los modificadores `--text-<nombre>--<propiedad>` viajan con el tamaño:

```css
--text-body-md: 14px;
--text-body-md--line-height: 22px;
--text-body-md--font-weight: 400;
--text-body-md--letter-spacing: 0em;
```

Una sola clase aplica las cuatro:

```html
<p class="text-body-md">…</p>
```

Y se puede sobrescribir una propiedad sin perder las otras tres, porque v4 las
emite a través de variables con fallback:

```html
<p class="text-body-md font-semibold">…</p>   <!-- 14/22, pero en 600 -->
```

---

## Añadir un token nuevo

**Un estilo tipográfico:**

1. Declara las cuatro variables en `@theme` (`--text-x`,
   `--text-x--line-height`, `--text-x--font-weight`,
   `--text-x--letter-spacing`).
2. Añade la entrada a `TYPOGRAPHY`, en `typography.tokens.ts`.
3. Nada más: `cn()` se entera por su cuenta, porque la lista que registra en
   tailwind-merge se deriva de `TYPOGRAPHY`.

**Un color:** solo el paso 1 (`--color-*`). No hay tokens de color en
TypeScript.

**Una animación:** declara `--animate-x` en `@theme` y sus `@keyframes`
**dentro del mismo bloque**, porque v4 solo emite los fotogramas de las
animaciones que se usan. Si la duración no se conoce hasta ejecución, déjala
fuera de la variable y que la ponga quien la use con `style`: es lo que hace
`--animate-countdown` con los cinco segundos del aviso.

**Una utilidad que Tailwind no trae:** `@utility nombre { … }` en la raíz de
`style.css`. Admite variantes como cualquier otra
(`data-paused:animation-paused`), y evita escribirla como propiedad arbitraria
en cada componente. Hoy hay dos: `animation-paused` y `rounded-inherit`, que
copia el radio del padre y permite que el avatar cambie de forma sin tocar sus
piezas internas.

**Un tamaño de componente:** añade la fila a la receta correspondiente de
`components.tokens.ts`. El tipo `SizeMap<T>` no compila si falta un escalón.

---

## `cn()` es más que clsx + twMerge

`src/lib/utils.ts`

La rampa tipográfica está **registrada en tailwind-merge**:

```ts
const typographyScale = Object.values(TYPOGRAPHY)
    .flatMap((className) => className.split(" "))
    .filter((className) => className.startsWith("text-"))
    .map((className) => className.slice("text-".length))

const twMerge = extendTailwindMerge({
    extend: {
        classGroups: {
            "font-size": [{ text: typographyScale }],
        },
    },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

Sin ese registro, `cn("text-sm", "text-body-md")` conserva **las dos clases**:
tailwind-merge no sabe que `text-body-md` es un tamaño de fuente y no las
considera en conflicto, así que cuál gana lo decide el orden del stylesheet. En
la práctica ganaba la del componente instalado con el CLI, que es justo la que
se quería sustituir.

La lista se deriva de `TYPOGRAPHY`, así que añadir un estilo a la rampa no
obliga a mantenerla a mano.

---

## Cinco errores que conviene no repetir

### 1. No declares `--spacing-*` con la escala de camiseta

Parece lo natural: `--spacing-md: 12px` y ya tienes `gap-md` y `p-md`. Funciona
hasta que miras `w-*` y `max-w-*`, que **comparten ese namespace** pero
resuelven contra la escala de contenedores. Al declararlo:

```
max-w-sm   24rem  →  8px
w-xs       20rem  →  4px
```

En todo el proyecto y sin ningún aviso. Colapsó el buscador del catálogo y el
selector de sucursal. Por eso el espaciado usa la escala numérica de Tailwind
(`p-3` = 12px) y los tokens solo le ponen nombre.

### 2. Las clases se escriben literales

Tailwind lee el código fuente buscando texto que parezca una clase. Una clase
construida en ejecución no existe:

```ts
const cls = `gap-${size}`;                          // no genera CSS
const cls = "[&_svg]:" + CONTROL_SIZE.md.iconClass; // tampoco

const cls = SPACING_CLASS.gap[size];                // correcto: el literal
                                                    // está en el token
```

Componer con una función sí vale, siempre que los literales estén escritos en
algún archivo fuente:

```ts
const controlSize = (token: ControlSizeToken) => [
    token.heightClass,      // "h-10" está literal en components.tokens.ts,
    token.paddingXClass,    // y Tailwind lo lee allí
];
```

**Una variante delante tampoco se puede pegar**, aunque las dos mitades
existan:

```ts
`data-closing:${DURATION_CLASS.fast}`  // "duration-150" existe, pero
                                       // "data-closing:duration-150" no

"data-closing:duration-150"            // correcto, con el escalón de la
                                       // receta anotado al lado
```

El escaneo busca la clase entera, con su prefijo. Es el mismo motivo por el que
las clases que apuntan a un slot (`[&_[data-slot=…]]:px-4`) se escriben a mano
en lugar de salir del token.

### 3. Lo que llega del CLI de shadcn hay que traducirlo

Sus clases apuntan a otras variables (`border-input`, `bg-popover`,
`text-muted-foreground`, `ring-ring`) que no son las de marca, y sus tamaños
llegan con más especificidad que la receta. El addon del `InputGroup` fijaba los
iconos a 16px con `[&>svg:not([class*='size-'])]:size-4` y ganaba siempre,
hiciera lo que hiciera el campo.

El alias `ui` de `components.json` apunta a `components/ui`, así que ahí
aterriza todo lo que se instale. Es un punto de paso, no un destino: se traduce
y se mueve a su familia, como se hizo con los campos (`inputs/primitives`), el
avatar (`avatars/`) y los diálogos (`modals/`). Lo que duplica algo que el
sistema ya tiene no se traduce, se borra: fue el caso del `button` que bajó con
los diálogos, porque `GenericButton` ya hacía ese trabajo.

### 4. `translate-x-*` ya no escribe en `transform`

En v4, `translate`, `scale` y `rotate` dejaron de componerse dentro de la
propiedad `transform`: cada una escribe la suya. Una lista de transición que
solo nombre `transform` **no anima un desplazamiento**:

```html
<!-- la perilla salta: la clase se aplica, pero sin transición -->
<span class="transition-[width,transform] duration-200 data-[checked]:translate-x-5">

<!-- correcto -->
<span class="transition-[width,transform,translate,scale,rotate] duration-200 …">
```

Es un fallo que no se ve revisando el código: la clase existe, la regla se
genera y el elemento acaba donde tiene que acabar. Lo único que falta es el
recorrido, y eso solo se detecta mirándolo en movimiento o comprobando
`getComputedStyle(el).transitionProperty`.

`TRANSITION.transform` ya lleva la lista completa. Si escribes la transición a
mano, no la dejes corta.

### 5. Cuidado con la especificidad de los componentes ajenos

Si un componente de fuera declara su tamaño con `:not([class*='size-'])` o con
un selector de hijo directo, una regla de descendencia simple pierde. Dos
salidas, por orden de preferencia:

1. Si el componente es tuyo, baja **su** especificidad (`[&_svg]:size-4` a
   secas) y deja que tailwind-merge resuelva el conflicto.
2. Si no lo es, alcánzalo por su slot con un selector más específico.

---

## La capa heredada de shadcn

`style.css` conserva un bloque `:root` y `.dark` con las variables de shadcn
(`--background`, `--card`, `--popover`, `--muted`, `--destructive`,
`--sidebar-*`, `--chart-*`), sus 31 alias en `@theme inline` y un `@layer base`
que aplica `border-border outline-ring/50` y `bg-background text-foreground`.

Ningún componente del sistema de diseño usa esas variables, y en el JSX ya no
queda ninguna clase que apunte a ellas: al migrar la Navbar, `ring-background`
y `bg-background` pasaron a `ring-white` y `bg-white`. Las únicas referencias
que quedan están en comentarios, explicando de dónde venía cada traducción.

Lo que sigue vivo de ese bloque son **las reglas del `@layer base`**, que
aplican a toda la aplicación:

```css
* { @apply border-border outline-ring/50; }
body { @apply bg-background text-foreground; }
```

**Pendiente:** podar el bloque. Ya no lo bloquea nada, pero no es un borrado
limpio. `border-border` le da color por defecto al borde de *cualquier*
elemento con `border`, así que las reglas hay que sustituirlas antes de quitar
las variables, no después. El reemplazo natural es `border-neutral-200`,
`outline-primary-main/50` y `bg-white text-neutral-800`, y conviene hacerlo con
la aplicación delante: un cambio en el color de borde por defecto no rompe el
build y se nota en sitios que nadie estaba mirando.

Quedan además tres archivos en `src/components/ui/`. `input.tsx` lo usa todavía
el buscador de comandas (`features/cashier`); `card.tsx` y `tabs.tsx` no los
importa nadie y se pueden borrar. El detalle está en
[`README.md`](./README.md#pendiente-srccomponentsui).

El bloque `.dark` no está en uso: la aplicación no tiene modo oscuro y la
paleta de marca no define tonos oscuros. Si algún día entra, se declara en los
tokens y baja a todo a la vez.
