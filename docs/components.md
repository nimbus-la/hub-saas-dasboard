# Construir un componente

Cómo se arma un componente con el sistema, con ejemplos completos sacados del
propio proyecto. Para el catálogo de tokens, ver
[`design-tokens.md`](./design-tokens.md).

---

## Anatomía

Cada familia tiene su carpeta en `src/components`, y cada componente dos
archivos:

```
src/components/buttons/
├── GenericButton.tsx          ← estructura y comportamiento
├── generic-button.style.ts    ← todas las clases, en cva
├── LinkButton.tsx
└── link-button.style.ts
```

| Regla | Por qué |
|---|---|
| Componente en `PascalCase.tsx` | Es lo que se importa |
| Estilos en `kebab-case.style.ts` | Un archivo por componente, mismo nombre |
| Los tipos en `src/interfaces/` | Compartidos y reutilizables; el `.tsx` no declara sus props |
| Export en `components/index.ts` | Punto de entrada único |

El `.tsx` no debería tener ni una clase suelta larga. Si estás escribiendo
`className="flex h-10 items-center rounded-lg border…"` dentro del JSX, eso va
al `.style.ts`.

Las familias con primitivos internos añaden una subcarpeta —`inputs/primitives`—
para separar lo que se usa en pantalla de lo que es material de construcción.

---

## El patrón

```ts
// status-badge.style.ts
import { cva } from "class-variance-authority";

export const statusBadgeVariants = cva(
    [ /* base: lo que no cambia nunca */ ],
    {
        variants: { /* ejes independientes */ },
        compoundVariants: [ /* combinaciones especiales */ ],
        defaultVariants: { /* el estado por defecto */ },
    }
);
```

```tsx
// StatusBadge.tsx
export default function StatusBadge({ label, tone, size, className }: StatusBadgeProps) {
    return (
        <span className={cn(statusBadgeVariants({ tone, size }), className)}>
            {label}
        </span>
    );
}
```

Los ejes que casi siempre aparecen:

- **`size`** → sale entero de la receta (`CONTROL_SIZE`, `BADGE_SIZE`…)
- **`variant` / `tone`** → la identidad del componente: colores. Esto sí se
  escribe aquí, porque no lo comparte con nadie.

---

## Ejemplo 1: un botón

El eje `size` no escribe medidas: las toma de la receta. Como todas las clases
salen literales de `components.tokens.ts`, se pueden componer con una función
sin romper el escaneo de Tailwind.

```ts
// generic-button.style.ts
import { cva } from "class-variance-authority";
import { ControlSizeToken } from "@/interfaces";
import { CONTROL_SIZE, FOCUS_RING, TRANSITION } from "@/tokens";

const controlSize = (token: ControlSizeToken) => [
    token.heightClass,
    token.paddingXClass,
    token.gapClass,
    token.radiusClass,
    token.typographyClass,
];

export const genericButtonVariants = cva(
    [
        "inline-flex cursor-pointer select-none items-center justify-center",
        TRANSITION.colors,
        FOCUS_RING.default,
        "disabled:cursor-not-allowed",
    ],
    {
        variants: {
            variant: {
                primary: [
                    "bg-primary-main text-white",
                    "hover:bg-primary-dark",
                    "disabled:bg-neutral-400 disabled:text-white",
                ],
                ghost: [
                    "bg-transparent text-neutral-600",
                    "hover:bg-neutral-200",
                    "disabled:bg-white disabled:text-neutral-300",
                ],
            },
            size: {
                sm: controlSize(CONTROL_SIZE.sm),
                md: controlSize(CONTROL_SIZE.md),
                lg: controlSize(CONTROL_SIZE.lg),
            },
            fullWidth: { true: "w-full", false: "w-auto" },
        },

        // Solo icono → cuadrado, y se anula el relleno horizontal: con el ancho
        // ya cerrado, el `px` solo estrecharía la caja hasta aplastar el icono.
        compoundVariants: [
            { iconOnly: true, size: "md", class: [CONTROL_SIZE.md.squareClass, "px-0"] },
        ],

        defaultVariants: { variant: "primary", size: "md", fullWidth: false },
    }
);
```

Y en el componente, el icono se dimensiona por prop porque lucide no entiende
clases:

```tsx
const sizeToken = size ?? "md";
const iconSize   = CONTROL_SIZE[sizeToken].iconSize;
const iconStroke = ICON_STROKE_BY_SIZE[sizeToken];

<StartIcon size={iconSize} strokeWidth={iconStroke} />
```

---

## Ejemplo 2: un campo compuesto

`TextField` se monta sobre `InputGroup`: el contenedor pinta el borde y los
estados, y el `<input>` va desnudo dentro. Los estados suben al contenedor con
`has-*` y bajan al control por selectores de slot.

```ts
size: {
    md: [
        CONTROL_SIZE.md.heightClass,   // directo de la receta
        CONTROL_SIZE.md.radiusClass,

        // Dentro de un slot hay que escribir la clase con su variante delante,
        // y eso no se puede componer: va literal, con el escalón de la receta.
        "[&_[data-slot=input-group-control]]:px-4",
        "[&_[data-slot=input-group-control]]:text-label-lg",
        "md:[&_[data-slot=input-group-control]]:text-label-md",
        "[&_svg]:size-4",
    ],
},

tone: {
    default: [
        "border-neutral-300 hover:border-neutral-400",
        "has-[[data-slot=input-group-control]:focus-visible]:border-primary-main",
        "has-[[data-slot=input-group-control]:focus-visible]:ring-2",
        "has-[[data-slot=input-group-control]:focus-visible]:ring-primary-main/15",
    ],
},
```

Dos cosas que hay que saber de este patrón:

**El texto sube a 16px en móvil.** `text-label-lg md:text-label-md` no es un
capricho: por debajo de 16px iOS hace zoom automático al enfocar un campo. Todo
control con entrada de texto lo lleva.

**Los `data-slot` son contrato.** Los estilos llegan al control, a los adornos y
a los botones a través de ellos. Renombrarlos rompe los campos en silencio.

---

## Dónde van los tipos

En `src/interfaces/`, un archivo por familia, todos re-exportados desde su
barril. Se derivan del `cva` para no mantener dos listas:

```ts
// interfaces/buttons.interfaces.ts
import { VariantProps } from "class-variance-authority";
import { genericButtonVariants } from "@/components/buttons/generic-button.style";

export interface ButtonProps
    extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof genericButtonVariants> {
    label?: string;
    icon?: LucideIcon;
}

/** Se actualiza solo si cambian las variantes. */
export type ButtonSize = NonNullable<ButtonProps["size"]>;
```

Los tipos de los tokens viven aparte, en `interfaces/tokens/`.

---

## Elegir el tamaño

| Si el componente… | Expón |
|---|---|
| Es un control pulsable (botón, pestaña) | Los seis escalones |
| Acepta texto escrito (campo, selector) | `sm · md · lg · xl` — `xs` no admite texto legible y `2xl` convierte un campo en un cartel |
| Es decorativo (insignia, avatar) | Los seis |
| No cambia de tamaño (textarea) | Ninguno: el alto lo decide otra cosa, como `rows` |

```ts
// Recortar la escala sin salirse de ella
export type InputSize = Extract<SizeToken, "sm" | "md" | "lg" | "xl">;
```

---

## Checklist

Antes de dar un componente por terminado:

- [ ] Las clases están en `*.style.ts`, no en el `.tsx`
- [ ] `size` sale de una receta de `components.tokens.ts`
- [ ] Ni un valor arbitrario: nada de `text-[13px]` ni `p-[18px]`
- [ ] La tipografía es un token de la rampa, no `text-sm` suelto
- [ ] El foco usa `FOCUS_RING`, no un anillo propio
- [ ] Las transiciones usan `TRANSITION.*` (llevan `motion-reduce` incluido)
- [ ] Si lleva texto escribible, sube a 16px en móvil
- [ ] Si flota, la capa sale de `Z_INDEX`
- [ ] Los iconos salen de `ICON_TOKENS` y se dimensionan con `iconSize`
- [ ] Las props están tipadas en `src/interfaces/`
- [ ] Exportado desde `components/index.ts`

---

## Migrar un componente pendiente

Quedan `pagination/`, `tabs/`, `tables/`, `sidebar/` y `toggles/`. El orden
recomendado es de menos a más superficie: `Pagination` primero, que
`CONTROL_SIZE.sm` lo cubre entero.

**Pendiente de las tarjetas:** al migrar `cards/` el radio de superficie subió
a `rounded-xl` (`RADIUS_SEMANTIC.surface`). Los paneles que aún no están
migrados —`RecentOrdersTable`, `TopProductsCard`, `SalesChartSection`— siguen
en `rounded-lg`, así que en el dashboard conviven dos radios. Se cierra solo
cuando les toque el turno; no hay que tocarlos antes.

El procedimiento que funcionó con los ya migrados:

1. **Mide lo que hay.** Anota altos, radios y tamaños de texto actuales, y
   busca a qué escalón corresponden. Casi todo coincide: la escala se eligió a
   partir de lo que ya existía.
2. **Sustituye los valores por tokens**, empezando por los que coinciden.
3. **Decide qué hacer con los que no.** Un `h-9` (36px) que no está en la
   escala es una decisión, no un descuido: o sube a 40 o baja a 32, y se anota
   el cambio.
4. **Busca los call sites** antes de tocar la API. Cambiar `small/medium/large`
   por `sm/md/lg` es un cambio de contrato.
5. **Verifica en pantalla, no solo en el build.** Un `tsc` verde no dice nada
   sobre si una clase se está aplicando: puede estar perdiendo una guerra de
   especificidad contra otra.

Sobre el punto 5: mídelo en el navegador con `getComputedStyle`. Más de un
problema de esta migración —el tamaño de icono que nunca se aplicaba, la
tipografía que perdía contra `text-sm`— compilaba perfectamente.
