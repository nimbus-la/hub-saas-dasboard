# Design system — tokens

Un solo vocabulario de tamaños —`xs`, `sm`, `md`, `lg`, `xl`, `2xl`— compartido
por espaciado, radios, iconos, tipografía y componentes.

## Quién guarda qué

El sistema vive en dos sitios, y **nada está en los dos a la vez**:

| | Guarda | Por qué ahí |
|---|---|---|
| **`src/style/style.css`** (`@theme`) | Los **valores**: colores, espaciado, radios, tipografía, sombras | Solo sirven para pintar. Tailwind genera una utilidad por token: `gap-md`, `rounded-lg`, `text-body-md`, `shadow-xl` |
| **`src/tokens/`** | Las **recetas** (qué token usa cada componente) y los **números que JS consume** | Un `cva` no puede leer CSS, y `matchMedia`, `size={16}` de lucide o framer-motion necesitan el número |

La regla para decidir: **¿TypeScript necesita el número?** Si no, va solo al CSS.
Si te encuentras copiando un valor del CSS a un `.ts`, casi siempre lo que
faltaba era una utilidad con nombre.

¿Necesitas un valor del CSS desde canvas o Chart.js? `readCssVariable()` de
`lib/theme.ts` — el mismo puente que ya se usa para los colores.

## Archivos

| Archivo | Qué define |
|---|---|
| `scale.tokens.ts` | La escala `xs…2xl`, el tipo `SizeToken`, `SizeMap<T>`, la retícula de 4px |
| `radius.tokens.ts` | Radio por escalón y por uso (badge, control, surface, overlay, pill) |
| `typography.tokens.ts` | Nombre → utilidad de los 24 estilos de la rampa |
| `icons.tokens.ts` | Registro de iconos + tamaños en px y grosores de trazo |
| `components.tokens.ts` | Recetas de tamaño: controles, insignias, avatares, superficies, filas |
| `layout.tokens.ts` | Sidebar, barra superior, anchos de contenido, breakpoints y `z-index` |
| `elevation.tokens.ts` | Qué sombra toca en cada caso + anillo de foco |
| `motion.tokens.ts` | Duraciones, curvas y transiciones compuestas |

## Cómo se usan

Un componente con prop `size` lee su fila entera de la receta:

```ts
import { CONTROL_SIZE } from "@/tokens";

const { heightClass, paddingXClass, gapClass, radiusClass, typographyClass } =
    CONTROL_SIZE.md;
// h-10 · px-lg · gap-sm · rounded-lg · text-label-md
```

Dentro de un `cva`, el token decide **cuál** clase toca; las clases siguen
escribiéndose literales porque Tailwind escanea el código fuente y no detecta
nombres construidos por interpolación:

```ts
size: {
    sm: [CONTROL_SIZE.sm.heightClass, CONTROL_SIZE.sm.paddingXClass],
    md: [CONTROL_SIZE.md.heightClass, CONTROL_SIZE.md.paddingXClass],
}
```

Para el espaciado suelto no hace falta importar nada: son utilidades.

```tsx
<div className="flex flex-col gap-lg p-xl">
    <h3 className="text-h3">Ventas por sucursal</h3>
    <p className="text-body-md text-neutral-600">Últimos 30 días</p>
</div>
```

Iconos de lucide, que reciben el tamaño por prop numérica:

```tsx
<ICON_TOKENS.PRODUCTS
    size={CONTROL_SIZE.md.iconSize}
    strokeWidth={ICON_STROKE.regular}
/>
```

## La escala de un vistazo

| Token | Espaciado | Radio | Icono | Alto de control |
|---|---|---|---|---|
| `xs` | 4 | 4 | 12 | 24 |
| `sm` | 8 | 6 | 14 | 32 |
| `md` | 12 | 8 | 16 | 40 |
| `lg` | 16 | 10 | 18 | 44 |
| `xl` | 24 | 14 | 20 | 48 |
| `2xl` | 32 | 18 | 24 | 56 |

Espaciado y radios son utilidades con nombre (`gap-md`, `rounded-lg`). Los altos
de control **no** salen de la escala de espaciado —son alturas, no ritmo de
layout— así que van con utilidad numérica (`h-10`) desde la receta.

La escala numérica de Tailwind (`p-4`, `gap-2`) sigue disponible y se usa para
lo que no es ritmo del sistema: `size-4.5` de un icono, `h-11` de un control.

## Rampa tipográfica

Cada estilo fija tamaño, interlineado, grosor y tracking a la vez: son
inseparables, y elegirlos por separado es de donde salen los textos que "no
terminan de cuadrar".

| Utilidad | Tamaño / interlineado | Grosor | Uso |
|---|---|---|---|
| `text-display-lg/md/sm` | 48/56 · 40/48 · 32/40 | 700 | Cifras protagonistas, estados vacíos |
| `text-h1` … `text-h6` | 36/44 → 16/24 | 700→600 | Jerarquía de contenido |
| `text-subtitle-lg/md/sm` | 16/24 · 14/22 · 13/20 | 600 | Apoyo de un título, cabecera de tarjeta |
| `text-body-lg/md/sm/xs` | 16/26 → 12/18 | 400 | Párrafos y celdas de tabla |
| `text-label-xl/lg/md/sm/xs` | 18/24 → 11/16 | 500 | Texto dentro de controles |
| `text-caption` | 12/18 | 400 | Ayudas, metadatos, notas |
| `text-overline` | 11/16 · con `uppercase` | 700 | Rótulos de sección |
| `text-code` | 13/20 · con `font-mono` | 400 | SKU, identificadores |

Criterios: interlineado apretado (≈1.2) en títulos y holgado (≈1.55) en
párrafos; tracking negativo solo por encima de 20px; todo interlineado múltiplo
de 2px.

## Relación con los componentes actuales

Los tokens todavía no están aplicados: los componentes siguen con sus valores
propios y **el aspecto de la app no ha cambiado**. La escala de radios se fijó
justo para eso — `rounded-lg` sigue valiendo 10px, `rounded-md` 8px, igual que
cuando se derivaban de `--radius` con `calc()`.

Coincidencias que hacen la migración sustitución directa:

- Altos de control: `32/40/44` de `GenericButton` y `40/48` de `TextField` ya
  están en la escala (`sm`, `md`, `lg`, `xl`); el `h-9` (36px) de `TextField sm`
  es el que se queda fuera.
- `rounded-[10px]` del botón es exactamente `CONTROL_SIZE.md.radiusClass`.
- Sidebar: `w-64` / `md:w-20` / `h-16` están en `SIDEBAR`; `z-40` y `z-50` en
  `Z_INDEX.overlay` y `Z_INDEX.drawer`.
- La cadena de transición repetida en varios `.style.ts` es `TRANSITION.colors`
  y `TRANSITION.input`.

Diferencias a decidir antes de migrar:

1. Los botones usan hoy `px-4` en los tres tamaños; la receta gradúa el relleno
   (`px-md` / `px-lg` / `px-xl`).
2. Los tamaños de botón se llaman `small/medium/large` y los de campo `sm/md/lg`.
   Unificarlos en la escala `xs…2xl` es un cambio de API.
3. Los iconos del botón usan 18/15px; la receta propone 14/16/18.

## Siguientes pasos sugeridos

1. Migrar componente a componente, empezando por `GenericButton` y `TextField`.
2. Sustituir en el JSX los `text-sm` / `text-xs` sueltos por la rampa
   (`text-body-md`, `text-caption`…), que es donde más se nota.
