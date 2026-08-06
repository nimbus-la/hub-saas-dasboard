# Tailwind en este proyecto

Cómo está montado, por qué unos tokens viven en CSS y otros en TypeScript, y
las trampas que ya costaron un rato. Para el catálogo de valores, ver
[`design-tokens.md`](./design-tokens.md).

Versión: **Tailwind CSS v4** (sin `tailwind.config.js` — la configuración es
CSS).

---

## Dónde está la configuración

Todo en `src/style/style.css`:

```css
@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/tailwind.css";

@theme {
    /* colores, tipografía, sombras, curva propia, breakpoint xs */
}

@theme inline {
    /* radios */
}

:root  { /* variables heredadas de shadcn */ }
.dark  { /* idem, sin uso hoy */ }

@layer base { /* reset del proyecto */ }
```

En v4 no hay archivo de configuración: **declarar una variable en `@theme` crea
utilidades**. `--text-body-md: 14px` genera la clase `text-body-md`, y
`--shadow-lg: …` genera `shadow-lg`.

---

## El reparto: CSS o TypeScript

| Vive en | Qué | Por qué |
|---|---|---|
| **`style.css`** (`@theme`) | Color, tipografía, radios, sombras | Solo sirven para pintar. Tailwind ya genera la utilidad |
| **`src/tokens/`** | Recetas de componente, espaciado, y los números que JS consume | Un `cva` no puede leer CSS, y `matchMedia`, `size={16}` de lucide o framer-motion necesitan el número |

La regla para decidir: **¿TypeScript necesita el número?** Si no, va solo al
CSS. Si te encuentras copiando un valor del CSS a un `.ts`, casi siempre lo que
faltaba era una utilidad con nombre.

### Por qué no todo en CSS

Porque hay cosas que el CSS no puede expresar. Que un botón `md` mida 40px es
un valor; que un botón `md` use *ese* alto **con** ese radio **y** esa
tipografía es una decisión, y vive en `CONTROL_SIZE`.

### Por qué no todo en TypeScript

Porque duplicaría lo que Tailwind ya sabe hacer, y porque `text-body-md` en el
JSX se lee mejor que `TYPOGRAPHY.bodyMd` importado.

### Leer un valor del CSS desde JavaScript

Para canvas o Chart.js, que no entienden clases:

```ts
import { readCssVariable } from "@/lib/theme";

const color = readCssVariable("--color-primary-main", "#7635DC");
const size  = readCssVariable("--text-body-md", "14px");
```

Solo en cliente: usa `getComputedStyle`, así que va dentro de un efecto o de un
manejador. Llamarla durante el render rompería la hidratación.

---

## Namespaces de `@theme` que usa el proyecto

| Namespace | Genera | Entradas |
|---|---|---|
| `--color-*` | `bg-*` `text-*` `border-*` `ring-*` | 72 |
| `--text-*` | `text-*` (tamaño + interlineado + grosor + tracking) | 24 estilos |
| `--radius-*` | `rounded-*` | 6 |
| `--shadow-*` | `shadow-*` | 6 |
| `--ease-*` | `ease-*` | 1 (`emphasized`) |
| `--breakpoint-*` | variantes `xs:` … | 1 (`xs`) |
| `--font-*` | `font-sans` | 1 |

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

Y se puede sobrescribir puntualmente sin romperlo, porque v4 emite las
propiedades a través de variables con fallback:

```html
<p class="text-body-md font-semibold">…</p>   <!-- 14/22, pero en 600 -->
```

---

## Añadir un token nuevo

**Un estilo tipográfico:**

1. Declara las cuatro variables en `@theme` (`--text-x`, `--text-x--line-height`,
   `--text-x--font-weight`, `--text-x--letter-spacing`).
2. Añade la entrada a `TYPOGRAPHY` en `typography.tokens.ts`.
3. Nada más: `cn()` se entera solo, porque la lista que registra en
   tailwind-merge se deriva de `TYPOGRAPHY`.

**Un color:** solo el paso 1 (`--color-*`). No hay tokens de color en TS.

**Un tamaño de componente:** añade la fila a la receta correspondiente de
`components.tokens.ts`. El tipo `SizeMap<T>` no compila si te dejas un escalón.

---

## `cn()` — más que clsx + twMerge

`src/lib/utils.ts`

```ts
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

Con un detalle que importa: **la rampa tipográfica está registrada en
tailwind-merge**.

Sin eso, `cn("text-sm", "text-body-md")` conserva **las dos clases** —
tailwind-merge no sabe que `text-body-md` es un tamaño de fuente y no las
considera en conflicto — y cuál gana lo decide el orden del stylesheet. En la
práctica ganaba la del componente vendorizado, que es justo la que se quería
sustituir.

La lista se deriva de `TYPOGRAPHY`, así que añadir un estilo a la rampa no
obliga a mantenerla a mano.

---

## Trampas conocidas

Cinco cosas que ya se descubrieron por las malas.

### 1. No declares `--spacing-*` con la escala de camiseta

Parece lo natural: `--spacing-md: 12px` y ya tienes `gap-md`, `p-md`. Y
funciona… hasta que miras `w-*` y `max-w-*`, que **comparten ese namespace**
pero resuelven contra la escala de contenedores.

Al declararlo:

```
max-w-sm   24rem  →  8px
w-xs       20rem  →  4px
```

En silencio y en todo el proyecto. Colapsó el buscador del catálogo y el
selector de sucursal. Por eso el espaciado usa la escala numérica de Tailwind
(`p-3` = 12px) y los tokens le ponen el nombre.

### 2. Las clases se escriben literales

Tailwind escanea el código fuente buscando texto que parezca una clase. Una
clase construida en tiempo de ejecución no existe:

```ts
// ❌ nunca se genera el CSS
const cls = `gap-${size}`;
const cls = "[&_svg]:" + CONTROL_SIZE.md.iconClass;

// ✅ el literal vive en el token; aquí solo se indexa
const cls = SPACING_CLASS.gap[size];
```

Componer con una función **sí** vale, mientras los literales estén escritos en
algún archivo fuente:

```ts
const controlSize = (token: ControlSizeToken) => [
    token.heightClass,      // "h-10" está escrito literal en components.tokens.ts
    token.paddingXClass,    // y Tailwind lo escanea allí
];
```

### 3. Lo que llega de shadcn hay que traducirlo

Sus clases apuntan a otras variables (`border-input`, `bg-popover`,
`text-muted-foreground`, `ring-ring`) que no son las de marca, y sus tamaños
vienen con más especificidad que la receta. El addon del `InputGroup` fijaba
los iconos a 16px con `[&>svg:not([class*='size-'])]:size-4` y ganaba siempre,
hiciera lo que hiciera el campo.

El alias `ui` de `components.json` sigue apuntando a `components/ui`, así que
ahí aterriza lo que se añada con el CLI. **Es una sala de espera, no un
destino:** se traduce y se mueve a su familia, como se hizo con los campos
(`inputs/primitives`) y el avatar (`avatars`).

### 4. `translate-x-*` ya no escribe en `transform`

En v4, `translate`, `scale` y `rotate` dejaron de componerse dentro de la
propiedad `transform`: cada una escribe la suya. Así que una lista de
transición que solo nombre `transform` **no anima un desplazamiento**:

```html
<!-- ❌ la perilla salta: la clase se aplica, pero sin transición -->
<span class="transition-[width,transform] duration-200 data-[checked]:translate-x-5">

<!-- ✅ -->
<span class="transition-[width,transform,translate,scale,rotate] duration-200 …">
```

Es de las que no se ven revisando el código: la clase existe, la regla se
genera y el elemento acaba justo donde tiene que acabar. Lo único que falta es
el recorrido, y eso solo se detecta mirándolo en movimiento o comprobando
`getComputedStyle(el).transitionProperty`.

`TRANSITION.transform` ya lleva la lista completa. Si escribes la transición a
mano, no te la dejes.

### 5. Cuidado con las especificidades prestadas

Si un componente de fuera declara un tamaño con `:not([class*='size-'])` o con
un selector de hijo directo, tu regla de descendencia simple pierde. Dos
salidas, por orden de preferencia:

1. Si el componente es tuyo, baja **su** especificidad (`[&_svg]:size-4` a
   secas) y deja que tailwind-merge resuelva el conflicto.
2. Si no lo es, alcánzalo por su slot con un selector más específico.

---

## Capa heredada de shadcn

`style.css` conserva un bloque `:root`/`.dark` con las variables de shadcn
(`--background`, `--card`, `--popover`, `--muted`, `--destructive`,
`--sidebar-*`, `--chart-*`) y su `@layer base`, que aplica
`border-border outline-ring/50` y `bg-background text-foreground`.

Ya no queda ningún componente de shadcn en el proyecto, y desde la migración de
la Navbar tampoco queda ninguna clase suya en el JSX: `ring-background` y
`bg-background` pasaron a `ring-white` y `bg-white`.

De ese bloque solo siguen vivas **las tres reglas del `@layer base`**, que son
las que lo mantienen en pie:

```css
* { @apply border-border outline-ring/50; }
body { @apply bg-background text-foreground; }
```

**Pendiente:** podar el bloque. Ya no lo bloquea nada, pero no es un borrado
limpio: esas dos reglas aplican a toda la aplicación —`border-border` le pone
color por defecto al borde de *cualquier* elemento con `border`— así que hay
que sustituirlas antes de quitar las variables, no después. El reemplazo
natural es `border-neutral-200`, `outline-primary-main/50` y `bg-white
text-neutral-800`, y conviene hacerlo con la app delante: un cambio en el color
de borde por defecto no rompe el build y se nota en sitios que nadie estaba
mirando.

El bloque `.dark` no está en uso: la app no tiene modo oscuro y la paleta de
marca no define tonos oscuros. Si algún día entra, se declara en los tokens y
baja a todo a la vez.
