# Construir un componente

Cómo se arma un componente con el sistema, con ejemplos tomados del propio
proyecto. Para el catálogo de tokens, ver
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
| Componente en `PascalCase.tsx` | Es el nombre que se importa |
| Estilos en `kebab-case.style.ts` | Un archivo por componente, con el mismo nombre |
| Props en `src/interfaces/components/` | Son compartidas y reutilizables; el `.tsx` no declara las suyas |
| Export en `components/index.ts` | Punto de entrada único |

El `.tsx` no debería tener ninguna clase larga suelta. Si estás escribiendo
`className="flex h-10 items-center rounded-lg border…"` dentro del JSX, eso va
al `.style.ts`.

Las familias con primitivos internos añaden una subcarpeta, como
`inputs/primitives`, para separar lo que se usa en pantalla de lo que es
material de construcción.

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

- **`size`**: sale entero de la receta (`CONTROL_SIZE`, `BADGE_SIZE`…).
- **`variant`** o **`tone`**: la identidad del componente, sus colores. Esto sí
  se escribe aquí, porque no lo comparte con nadie.

---

## Ejemplo 1: un botón

El eje `size` no escribe medidas, las toma de la receta. Como todas las clases
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

        // Solo icono: cuadrado, y se anula el relleno horizontal. Con el ancho
        // ya cerrado, el `px` solo estrecharía la caja hasta aplastar el icono.
        compoundVariants: [
            { iconOnly: true, size: "md", class: [CONTROL_SIZE.md.squareClass, "px-0"] },
        ],

        defaultVariants: { variant: "primary", size: "md", fullWidth: false },
    }
);
```

En el componente, el icono se dimensiona por prop, porque lucide no entiende
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
`has-*` y bajan al control con selectores de slot.

```ts
size: {
    md: [
        CONTROL_SIZE.md.heightClass,   // directo de la receta
        CONTROL_SIZE.md.radiusClass,

        // Dentro de un slot la clase lleva su variante delante, y eso no se
        // puede componer: va literal, con el escalón de la receta.
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
capricho: por debajo de 16px, iOS hace zoom automático al enfocar un campo.
Todo control con entrada de texto lo lleva.

**Los `data-slot` son un contrato.** Los estilos llegan al control, a los
adornos y a los botones a través de ellos, así que renombrarlos rompe los
campos sin que salte ningún error.

### Campos de número: `NumberField`

Para cantidades, precios o cualquier número se usa `NumberField`, no un
`TextField` con `type="number"`. Pone los puntos de miles mientras se escribe,
así que `12.000` no se confunde con `120`, y de cara afuera trabaja con
`number | null`. El formato y la posición del cursor los maneja
`react-number-format`; el marco, la etiqueta y el error son los mismos de
`TextField`.

```tsx
<NumberField label="Cantidad" value={quantity} onChange={setQuantity} suffix="g" />
<NumberField label="Precio" value={price} onChange={setPrice} maxDecimals={0} prefix="$" />
```

Dos decisiones que conviene conocer antes de tocarlo:

- **Solo la coma es decimal.** Si alguien escribe los puntos de miles por
  costumbre, se ignoran y el número queda correcto. El coste es que en un
  teclado en inglés `1.5` se convierte en `15`, pero se ve en el momento.
- **Lo que se pega se interpreta aparte**, con `parsePastedNumber` de
  `lib/format.ts`. Sin eso, un `1234.56` copiado de una hoja de cálculo en
  inglés se guardaría como `123.456`. Los separadores salen de
  `NUMBER_SEPARATORS`, que los lee del idioma de la interfaz.

---

## Dónde van los tipos

Todo se importa desde `@/interfaces`. Dentro, el reparto es por **origen del
tipo**, no por quién lo usa:

```
src/interfaces/
├── components/          ← props de los componentes, un archivo por familia
│   ├── buttons.interfaces.ts
│   ├── cards.interfaces.ts
│   └── …
├── tokens/              ← la forma de las recetas del design system
├── http/                ← contrato del cliente HTTP y del sobre de la API
├── menu.types.ts        ← dominio
└── data-table.types.ts  ← augmentación de @tanstack/react-table
```

La regla está en el sufijo: **`*.interfaces.ts` son props de un componente y
viven en `components/`; `*.types.ts` es todo lo demás** (tipos de dominio,
augmentación de una librería) y se queda en la raíz.

Las props se derivan del `cva` para no mantener dos listas:

```ts
// interfaces/components/buttons.interfaces.ts
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

---

## Elegir el tamaño

| Si el componente… | Expón |
|---|---|
| Es un control pulsable (botón, pestaña) | Los seis escalones |
| Acepta texto escrito (campo, selector) | `sm`, `md`, `lg`, `xl`. En `xs` el texto no se lee y `2xl` convierte un campo en un cartel |
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
- [ ] Ningún valor arbitrario: nada de `text-[13px]` ni `p-[18px]`
- [ ] La tipografía es un token de la rampa, no un `text-sm` suelto
- [ ] El foco usa `FOCUS_RING`, no un anillo propio
- [ ] Las transiciones usan `TRANSITION.*`, que ya traen `motion-reduce`
- [ ] Si lleva texto escribible, el tamaño sube a 16px en móvil
- [ ] Si flota, la capa sale de `Z_INDEX`
- [ ] Los iconos salen de `ICON_TOKENS` y se dimensionan con `iconSize`
- [ ] Las props están tipadas en `src/interfaces/components/`
- [ ] Está exportado desde `components/index.ts`

---

## Criterios que salieron de la migración

Todas las familias de `src/components/` están construidas con tokens. Estas
son las reglas que se fueron fijando por el camino, cada una con el caso que la
motivó.

**Hay geometría que no es la retícula.** Cuando un puñado de medidas solo
funciona en conjunto, se deja junta y documentada en su `*.style.ts` en lugar
de sustituirla token a token. Tres casos: el carril del `Switch` (24 de alto,
menos 4 de borde y relleno, da 20 de perilla y 20 de recorrido), el alto de una
pestaña subrayada, y la cadena horizontal del sidebar, donde
`SIDEBAR.paddingX` (12) más medio icono (18/2) sitúa el riel del submenú en
21px, y de ese mismo 12 cuelgan la sangría del título de sección y el
desplazamiento del indicador de selección. Se verifica midiendo: el centro del
icono del padre y el borde del riel tienen que dar el mismo número. Todo lo
demás (tipografía, transiciones, foco, radios, capas, elevación) sí se migra.

**No todo componente pulsable toma su alto de `CONTROL_SIZE`.** Una pestaña
subrayada no es una caja, es texto con una línea debajo: fijarle `h-10`
centraría el texto y despegaría el subrayado. En `FilterTabs` el alto lo pone
el relleno vertical, que ya cae en la retícula de 4px, y el resto sale del
sistema, incluido el contador, que es un `BADGE_SIZE.xs` con el radio cambiado
a píldora.

**Si un elemento dibuja una línea que debe leerse continua con la de su vecino,
la separación va en relleno, nunca en `gap`.** Con hueco entre pestañas, el
subrayado del hover se ve como un trozo suelto flotando entre dos vacíos. El
relleno es simétrico también en la primera: quitarle el `pl` para alinearla con
el título de la página la deja descentrada respecto a su propio subrayado, y
eso se nota más que el desfase con el título.

**El alto de fila se declara, no se calcula.** `ROW_HEIGHT_CLASS.md` en el `td`
da los 48px del escalón y actúa como mínimo, así que las filas con celdas de
dos líneas crecen solas. La alternativa (despejar la ecuación del relleno, como
el `py-3.5` que había antes) se descuadra en cuanto cambia la tipografía.

**Con una librería headless, el cuidado está en el contrato, no en las clases.**
TanStack Table no trae ninguna clase, así que en `tables/` no hubo conflictos
de especificidad. Lo que sí hay es `meta.headerClassName` y `meta.cellClassName`,
con los que una columna afina su celda: esas clases tienen que quedar **al final
del `cn()`** para que tailwind-merge las deje ganar sobre la base. Si se meten
dentro del `cva`, una columna deja de poder ajustar su ancho.

**Si la decisión ya está tomada, tómala en el componente y no en el selector.**
El `alert-dialog` del CLI resolvía la cabecera con una rejilla y cuatro
variantes cruzadas para que el icono se colocara al lado del texto en
escritorio y encima en móvil. Ese es el precio de exponer piezas sueltas: el
CSS tiene que cubrir todas las composiciones posibles. `ConfirmDialog` recibe
icono, título y descripción por props y tiene un solo formato, así que esas
variantes desaparecen.

**Dos ejes de color solo se cruzan donde hace falta.** El `Alert` tiene
`variant` (tintada o blanca) y `tone` (qué significa), y el reflejo es escribir
las diez combinaciones. No hace falta: `variant` decide la superficie, `tone`
decide el icono y la barra de cuenta atrás, y solo se cruzan en la tintada, que
es la única donde el tono pinta el fondo. Cinco `compoundVariants` en lugar de
diez. La pregunta que lo resuelve es qué parte cambia con cada eje, no cuántas
combinaciones hay.

**Sobre un fondo tintado, el texto va en `-darker`.** Es contraste medido, no
preferencia; los números están en
[`design-tokens.md`](./design-tokens.md#5-color). Por eso el título y la
descripción del aviso comparten color y se distinguen por grosor: bajarle la
opacidad al párrafo lo devuelve por debajo del umbral. La familia entera usa
tres tonos con un papel fijo: `-lighter` el fondo, `-light` el relleno del
medallón y `-darker` todo lo que hay que leer. El `-dark` se queda para la
equis, que es un control y no un texto.

**Un icono puede hacer de medallón.** El aviso no monta un círculo de color con
un glifo dentro, como hace el diálogo de confirmación: dibuja el propio icono
de estado a 40px, relleno en `-light` y perfilado en `-darker`. Así cada tono
trae su silueta (círculo, triángulo, octógono), que es lo que distingue un
error de una confirmación sin depender del color. Con dos avisos: el tamaño
sale de `CONTROL_SIZE` y no de `ICON_SIZE`, porque la escala de iconos se corta
en 24px a propósito; y el relleno no se puede aplicar al icono entero, porque
lucide no garantiza que el contorno sea el primer `path` del SVG. En `OctagonX`
el octógono se pinta encima de una de las aspas y el aspa desaparece, así que
se dibuja dos veces: abajo la silueta con el trazo a cero, arriba el dibujo
completo sin relleno.

**Un componente que se desmonta solo necesita `key`.** El aviso se cierra (por
la equis o por temporizador), termina su animación de salida y se pinta como
nada. Si quien lo muestra vuelve a renderizar el mismo elemento, React
reutiliza la instancia cerrada y el segundo aviso no llega a verse. Con una
identidad nueva (el `id` de una lista, un contador) se monta de verdad.

**Pausar es guardar lo que queda, no reiniciar.** El temporizador del aviso se
detiene con el puntero encima y sigue por donde iba al salir. Rearmarlo con los
cinco segundos completos es una línea más corta, pero un aviso por el que se
pasa dos veces no se cerraría nunca. Lo que queda vive en una `ref` porque
cambia en la limpieza del efecto y no lo pinta nadie: la barra la anima el CSS,
que se congela con `data-paused` en el mismo momento.

**El primitivo importa tanto como el estilo.** `Modal` se monta sobre `Dialog` y
`ConfirmDialog` sobre `AlertDialog`, que es el mismo diálogo con una
diferencia: la alerta no se cierra al pulsar fuera, porque un clic despistado
no puede ser la respuesta a "¿seguro que quieres borrar esto?". Base UI ni
siquiera expone ahí el `disablePointerDismissal` del diálogo normal, y eso es
una pista: cuando la librería quita una prop, está diciendo cuál es el
componente correcto para el caso.

---

## Migrar una pantalla

Lo que queda pendiente está en [`README.md`](./README.md#pantallas-srcfeatures):
`main-dashboard`, `cashier` y `login`. En el dashboard conviven dos radios
porque las tarjetas migradas subieron a `rounded-xl` y sus paneles siguen en
`rounded-lg`.

El procedimiento que funcionó:

1. **Mide lo que hay.** Anota altos, radios y tamaños de texto actuales y busca
   a qué escalón corresponden. Casi todo coincide, porque la escala se eligió a
   partir de lo que ya existía.
2. **Sustituye los valores por tokens**, empezando por los que coinciden.
3. **Decide qué hacer con los que no.** Un `h-9` (36px) que no está en la
   escala es una decisión, no un descuido: o sube a 40 o baja a 32, y se anota
   el cambio.
4. **Busca los usos** antes de tocar la API. Cambiar `small`/`medium`/`large`
   por `sm`/`md`/`lg` es un cambio de contrato.
5. **Verifica en pantalla, no solo en el build.** Un `tsc` verde no dice nada
   sobre si una clase se está aplicando; puede estar perdiendo una guerra de
   especificidad contra otra.

Sobre el punto 5: mídelo en el navegador con `getComputedStyle`. Más de un
problema de esta migración (el tamaño de icono que nunca se aplicaba, la
tipografía que perdía contra `text-sm`) compilaba sin una sola queja.
