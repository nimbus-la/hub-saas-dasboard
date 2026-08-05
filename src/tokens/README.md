# Design system — tokens

Un solo vocabulario de tamaños —`xs`, `sm`, `md`, `lg`, `xl`, `2xl`— compartido
por espaciado, radios, iconos, tipografía y componentes.

## Quién guarda qué

El sistema vive en dos sitios, y **nada está en los dos a la vez**:

| | Guarda | Por qué ahí |
|---|---|---|
| **`src/style/style.css`** (`@theme`) | Los **valores**: colores, radios, tipografía, sombras | Solo sirven para pintar. Tailwind genera una utilidad por token: `rounded-lg`, `text-body-md`, `shadow-xl` |
| **`src/tokens/`** | Las **recetas** (qué token usa cada componente), el **espaciado** y los **números que JS consume** | Un `cva` no puede leer CSS, y `matchMedia`, `size={16}` de lucide o framer-motion necesitan el número |

La regla para decidir: **¿TypeScript necesita el número?** Si no, va solo al CSS.
Si te encuentras copiando un valor del CSS a un `.ts`, casi siempre lo que
faltaba era una utilidad con nombre.

**El espaciado es la excepción, y conviene saber por qué.** Declararlo en
`@theme` como `--spacing-xs…2xl` funciona para `p-*`, `m-*` y `gap-*`, pero ese
namespace lo comparten `w-*` y `max-w-*`, que resuelven contra la escala de
contenedores. Al nombrarlo con la escala de camiseta, `max-w-sm` deja de ser
24rem y pasa a ser 8px, y `w-xs` de 20rem a 4px — en silencio y en todo el
proyecto. Se probó, rompió el buscador y el selector de sucursal, y se revirtió:
el espaciado usa la escala numérica de Tailwind (`p-3` = 12px) y los tokens
ponen el nombre.

¿Necesitas un valor del CSS desde canvas o Chart.js? `readCssVariable()` de
`lib/theme.ts` — el mismo puente que ya se usa para los colores.

## Archivos

| Archivo | Qué define |
|---|---|
| `scale.tokens.ts` | La escala `xs…2xl`, el tipo `SizeToken`, `SizeMap<T>`, la retícula de 4px |
| `spacing.tokens.ts` | Escala de espaciado en px y su utilidad de Tailwind por eje |
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
// h-10 · px-4 · gap-2 · rounded-lg · text-label-md
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

La tipografía sí es una utilidad directa: no hace falta importar nada.

```tsx
<div className="flex flex-col gap-4 p-6">
    <h3 className="text-h3">Ventas por sucursal</h3>
    <p className="text-body-md text-neutral-600">Últimos 30 días</p>
</div>
```

Para el espaciado, `SPACING_CLASS` da la utilidad del escalón cuando se necesita
indexar por `size`; escribir `gap-4` a mano es igual de válido — es el mismo
valor.

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

Los radios son utilidades con nombre (`rounded-lg`); el espaciado usa la escala
numérica (`gap-4` = 16px). Los altos de control **no** salen de la escala de
espaciado —son alturas, no ritmo de layout— así que van con utilidad numérica
(`h-10`) desde la receta, igual que `size-4.5` para un icono.

## Trampas conocidas

Tres cosas que costaron un rato y conviene no volver a descubrir:

1. **No declarar `--spacing-*` con la escala de camiseta.** Rompe `w-*` y
   `max-w-*` en todo el proyecto (ver arriba).
2. **`cn()` lleva la rampa tipográfica registrada en tailwind-merge**
   (`lib/utils.ts`). Sin eso, `cn("text-sm", "text-body-md")` deja las dos
   clases —tailwind-merge no sabe que `text-body-md` es un tamaño— y gana la
   del componente ajeno, que es justo la que se quería sustituir. Si se añade
   un estilo a la rampa, el registro se actualiza solo: se deriva de
   `TYPOGRAPHY`.
3. **Lo que llegue de shadcn hay que traducirlo antes de usarlo.** Sus clases
   apuntan a otras variables (`border-input`, `bg-popover`, `ring-ring`) y sus
   tamaños vienen con más especificidad que la receta: el addon del
   `InputGroup` fijaba los iconos a 16px con
   `[&>svg:not([class*='size-'])]:size-4` y ganaba siempre.

   El alias `ui` de `components.json` sigue apuntando a `components/ui`, así
   que ahí es donde aterriza lo que se añada con el CLI. Es una sala de
   espera, no un destino: se traduce y se mueve a su familia, como se hizo con
   los campos (`inputs/primitives`) y el avatar (`avatars`).

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

## Estado de la migración

| Componente | Estado |
|---|---|
| `GenericButton`, `LinkButton` | Migrados — escala `xs…2xl` |
| `TextField`, `InputSelector`, `TextAreaField` | Migrados — escala `sm…xl` |
| Resto (`StatusBadge`, `Pagination`, `FilterTabs`, tarjetas, tablas, sidebar) | Pendientes |

Los campos exponen `sm | md | lg | xl` y no los seis escalones: `xs` (24px) no
admite texto legible dentro y `2xl` (56px) convierte un campo en un cartel.

Al migrar los campos cambiaron tres cosas: el alto de `sm` (36 → 32px, el `h-9`
que se quedaba fuera de la escala), el tamaño de los iconos, que ahora sigue de
verdad a la receta —antes el addon de shadcn los fijaba a 16px pasara lo que
pasara—, y el texto de ayuda, que pasa a `text-caption` en todos los tamaños.

## Siguientes pasos sugeridos

1. Seguir componente a componente: `StatusBadge` y `Pagination` son los más
   directos, ya que `BADGE_SIZE` y `CONTROL_SIZE.sm` los cubren enteros.
2. Sustituir en el JSX los `text-sm` / `text-xs` sueltos por la rampa
   (`text-body-md`, `text-caption`…), que es donde más se nota.
3. Los estados de campo (`tone`/`invalid`) están duplicados literalmente entre
   `text-field.style.ts` y `input-selector.style.ts`; extraerlos a un módulo
   compartido de `inputs/` evitaría que se desincronicen.
